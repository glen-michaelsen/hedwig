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

export async function getObject(key: string) {
  const env = await getEnv();
  return env.MEDIA.get(key);
}

export async function deleteObject(key: string) {
  const env = await getEnv();
  await env.MEDIA.delete(key);
}
