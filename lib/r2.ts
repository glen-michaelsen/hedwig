import "server-only";
import { newId } from "./crypto";
import { getEnv } from "./db";

/** Keys are namespaced per tutor so a listing can never cross tenants. */
export function mediaKey(tutorId: string, filename: string) {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  return `${tutorId}/${newId()}-${safe}`;
}

export const MAX_PDF_BYTES = 20 * 1024 * 1024;

export async function putPdf(tutorId: string, file: File) {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("File is larger than 20 MB");
  }
  const env = await getEnv();
  const key = mediaKey(tutorId, file.name);
  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type || "application/pdf",
    },
  });
  return { key, size: file.size };
}

/**
 * Press-kit objects. The account id leads the key so ownership can be
 * checked against the key itself, before anything is read or written.
 */
export function pressKey(
  accountId: string,
  releaseId: string,
  filename: string,
) {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  return `${accountId}/press/${releaseId}/${newId()}-${safe}`;
}

export function isOwnPressKey(
  key: string,
  accountId: string,
  releaseId: string,
) {
  return key.startsWith(`${accountId}/press/${releaseId}/`);
}

/**
 * Multipart, because a WAV master is tens of megabytes and neither a
 * Server Action (25 MB) nor a Worker's memory (128 MB) is somewhere to put
 * a whole one. The browser sends it in parts; only one part is ever held.
 */
export async function createUpload(key: string, contentType: string) {
  const env = await getEnv();
  return env.MEDIA.createMultipartUpload(key, {
    httpMetadata: { contentType },
  });
}

export async function resumeUpload(key: string, uploadId: string) {
  const env = await getEnv();
  return env.MEDIA.resumeMultipartUpload(key, uploadId);
}

export async function getObject(key: string) {
  const env = await getEnv();
  return env.MEDIA.get(key);
}

export async function deleteObject(key: string) {
  const env = await getEnv();
  await env.MEDIA.delete(key);
}

/**
 * Serves an object with byte-range support.
 *
 * Without this a browser must download a whole file before it can play any
 * of it, and the seek bar does nothing — a 60 MB WAV is unusable over a hotel
 * connection. With it, `<audio>` asks for the slice it needs, playback starts
 * on the first chunk, and dragging the scrubber fetches from the new offset
 * instead of starting again.
 *
 * `head()` first, because a suffix range ("give me the last 200 KB") can't be
 * turned into an offset without knowing the size.
 */
export async function objectResponse(
  key: string,
  request: Request,
  options: {
    contentType: string;
    filename?: string;
    download?: boolean;
    cacheControl?: string;
  },
): Promise<Response | null> {
  const env = await getEnv();
  const head = await env.MEDIA.head(key);
  if (!head) return null;

  const size = head.size;
  const disposition = options.filename
    ? `${options.download ? "attachment" : "inline"}; filename="${options.filename.replace(/["\\]/g, "")}"`
    : undefined;

  const baseHeaders: Record<string, string> = {
    "content-type": options.contentType,
    "accept-ranges": "bytes",
    "cache-control": options.cacheControl ?? "private, max-age=300",
    etag: head.httpEtag,
  };
  if (disposition) baseHeaders["content-disposition"] = disposition;

  const rangeHeader = request.headers.get("range");
  const match = rangeHeader?.match(/^bytes=(\d*)-(\d*)$/);

  if (!match) {
    const object = await env.MEDIA.get(key);
    if (!object) return null;
    return new Response(object.body, {
      headers: { ...baseHeaders, "content-length": String(size) },
    });
  }

  const [, rawStart, rawEnd] = match;
  let start: number;
  let end: number;

  if (rawStart === "") {
    // bytes=-N — the final N bytes.
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) {
      return new Response("Range not satisfiable", {
        status: 416,
        headers: { "content-range": `bytes */${size}` },
      });
    }
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd === "" ? size - 1 : Math.min(Number(rawEnd), size - 1);
  }

  if (!Number.isFinite(start) || start >= size || end < start) {
    return new Response("Range not satisfiable", {
      status: 416,
      headers: { "content-range": `bytes */${size}` },
    });
  }

  const length = end - start + 1;
  const object = await env.MEDIA.get(key, { range: { offset: start, length } });
  if (!object) return null;

  return new Response(object.body, {
    status: 206,
    headers: {
      ...baseHeaders,
      "content-length": String(length),
      "content-range": `bytes ${start}-${end}/${size}`,
    },
  });
}
