import "server-only";
import { newId } from "@/lib/crypto";
import { getEnv } from "@/lib/db";

/**
 * Bio avatars and backgrounds are public by nature, unlike sheet music.
 * They live under a `public/` prefix in the same bucket, and /i/[...key] is
 * the only route that serves it — the bucket itself stays private and
 * /s/m/[id] keeps its ownership check.
 */
export const PUBLIC_PREFIX = "public/";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function isPublicKey(key: string) {
  return key.startsWith(PUBLIC_PREFIX) && !key.includes("..");
}

export async function putPublicImage(accountId: string, file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Images only — JPEG, PNG, WebP or AVIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 5 MB.");
  }

  const env = await getEnv();
  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const key = `${PUBLIC_PREFIX}${accountId}/${newId()}.${extension}`;

  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return key;
}

export async function deletePublicImage(key: string | null) {
  if (!key || !isPublicKey(key)) return;
  const env = await getEnv();
  await env.MEDIA.delete(key);
}
