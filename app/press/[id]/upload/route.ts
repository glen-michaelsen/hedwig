import { revalidatePath } from "next/cache";
import { warmLargestVariant } from "@/lib/press/images";
import { isResizableImage } from "@/lib/press/variants";
import { getAccount } from "@/lib/auth";
import { addAsset, getRelease } from "@/lib/dal/press";
import {
  ASSET_RULES,
  isAllowedFile,
  isAssetKind,
  type AssetKind,
} from "@/lib/press/assets";
import { deletePressObject } from "@/lib/press/images";
import {
  createUpload,
  deleteObject,
  isOwnPressKey,
  pressKey,
  resumeUpload,
} from "@/lib/r2";

/**
 * Chunked upload for press-kit files, in four phases: start, part, complete,
 * abort. A Server Action would have been less code, but it buffers the whole
 * body (capped at 25 MB) and a WAV master is bigger than that.
 *
 * Every phase re-checks the account and the release. The key is derived
 * server-side and verified to belong to this account and release, so a
 * client that invents one writes nowhere.
 */

/** 8 MB: over R2's 5 MB minimum, and small enough to hold comfortably. */
const PART_SIZE = 8 * 1024 * 1024;

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(
  request: Request,
  { params }: RouteContext<"/press/[id]/upload">,
) {
  const { id: releaseId } = await params;

  const account = await getAccount();
  if (!account) return bad("Not signed in", 401);

  const release = await getRelease(account.id, releaseId);
  if (!release) return bad("Not found", 404);

  const phase = new URL(request.url).searchParams.get("phase");

  switch (phase) {
    case "start":
      return start(request, account.id, releaseId);
    case "part":
      return part(request, account.id, releaseId);
    case "complete":
      return complete(request, account.id, releaseId);
    case "abort":
      return abort(request, account.id, releaseId);
    default:
      return bad("Unknown phase");
  }
}

async function start(request: Request, accountId: string, releaseId: string) {
  const body = (await request.json()) as {
    kind?: string;
    filename?: string;
    contentType?: string;
    size?: number;
  };

  const kind = String(body.kind ?? "");
  if (!isAssetKind(kind)) return bad("Unknown file kind");

  const filename = String(body.filename ?? "").slice(0, 200);
  const contentType = String(body.contentType ?? "application/octet-stream");
  const size = Number(body.size ?? 0);
  const rule = ASSET_RULES[kind as AssetKind];

  if (!filename) return bad("Missing filename");
  if (!Number.isFinite(size) || size <= 0) return bad("Empty file");
  if (size > rule.maxBytes) {
    return bad(`${rule.label} files must be under ${rule.maxBytes / 1024 / 1024} MB`);
  }
  if (!isAllowedFile(kind as AssetKind, contentType, filename)) {
    return bad(`That isn't a file type ${rule.plural.toLowerCase()} accept`);
  }

  const key = pressKey(accountId, releaseId, filename);
  const upload = await createUpload(key, contentType);

  return Response.json({
    key,
    uploadId: upload.uploadId,
    partSize: PART_SIZE,
  });
}

async function part(request: Request, accountId: string, releaseId: string) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") ?? "";
  const uploadId = url.searchParams.get("uploadId") ?? "";
  const partNumber = Number(url.searchParams.get("partNumber"));

  if (!isOwnPressKey(key, accountId, releaseId)) return bad("Not found", 404);
  if (!uploadId) return bad("Missing upload");
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10_000) {
    return bad("Bad part number");
  }

  const chunk = await request.arrayBuffer();
  if (chunk.byteLength === 0) return bad("Empty part");
  if (chunk.byteLength > PART_SIZE) return bad("Part too large");

  const upload = await resumeUpload(key, uploadId);
  const uploaded = await upload.uploadPart(partNumber, chunk);

  return Response.json({
    partNumber: uploaded.partNumber,
    etag: uploaded.etag,
  });
}

async function complete(
  request: Request,
  accountId: string,
  releaseId: string,
) {
  const body = (await request.json()) as {
    key?: string;
    uploadId?: string;
    parts?: { partNumber: number; etag: string }[];
    kind?: string;
    filename?: string;
    contentType?: string;
    size?: number;
    width?: number;
    height?: number;
  };

  const key = String(body.key ?? "");
  const uploadId = String(body.uploadId ?? "");
  const kind = String(body.kind ?? "");

  if (!isOwnPressKey(key, accountId, releaseId)) return bad("Not found", 404);
  if (!uploadId) return bad("Missing upload");
  if (!isAssetKind(kind)) return bad("Unknown file kind");
  if (!Array.isArray(body.parts) || body.parts.length === 0) {
    return bad("No parts uploaded");
  }

  const upload = await resumeUpload(key, uploadId);
  const object = await upload.complete(
    body.parts.map((entry) => ({
      partNumber: Number(entry.partNumber),
      etag: String(entry.etag),
    })),
  );

  const added = await addAsset(accountId, releaseId, {
    kind: kind as AssetKind,
    r2Key: key,
    filename: String(body.filename ?? "file").slice(0, 200),
    contentType: String(body.contentType ?? "application/octet-stream"),
    // R2 knows the real size; the client's claim is only a pre-check.
    sizeBytes: object.size,
    // Dimensions are the client's word, because measuring server-side means
    // reading the whole image back through the Images binding — which is
    // exactly what took the Worker over its CPU limit when the page did it.
    // A wrong number here is a cosmetic error on one panel, nothing more.
    width: Number.isFinite(body.width) ? Number(body.width) : null,
    height: Number.isFinite(body.height) ? Number(body.height) : null,
  });

  if (!added) {
    // The release went away mid-upload. Don't leave the object orphaned.
    await deleteObject(key);
    return bad("Not found", 404);
  }

  if (added.replacedKey) await deletePressObject(added.replacedKey);

  // Cut the large copy now, while this request is about this one image.
  // Left until later, a page showing four photos triggers four transforms
  // of four originals at once — which is what took the isolate past its CPU
  // limit. Failure here isn't fatal: the asset route still cuts on demand.
  if (isResizableImage(String(body.contentType ?? ""))) {
    try {
      await warmLargestVariant(key);
    } catch {
      // Left for the asset route to do lazily.
    }
  }

  revalidatePath(`/press/${releaseId}`);
  return Response.json({ id: added.id });
}

async function abort(request: Request, accountId: string, releaseId: string) {
  const body = (await request.json()) as { key?: string; uploadId?: string };
  const key = String(body.key ?? "");
  const uploadId = String(body.uploadId ?? "");

  if (!isOwnPressKey(key, accountId, releaseId)) return bad("Not found", 404);
  if (!uploadId) return bad("Missing upload");

  const upload = await resumeUpload(key, uploadId);
  await upload.abort();

  return Response.json({ ok: true });
}
