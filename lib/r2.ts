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
