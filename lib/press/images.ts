import "server-only";
import { getEnv } from "@/lib/db";
import { getObject } from "@/lib/r2";
import {
  IMAGE_VARIANTS,
  VARIANT_CONTENT_TYPE,
  variantKey,
  variantKeys,
  type ImageVariant,
} from "./variants";

export type VariantBody = {
  body: ReadableStream<Uint8Array> | ArrayBuffer;
  size: number;
  etag: string;
};

/**
 * A resized copy of a press image, generated once and kept in R2 next to the
 * original.
 *
 * Two rules keep this from taking the Worker down, both learned the hard way
 * (an `exceededCpu` on the asset route: a page requesting four images at
 * once had four ~12 MB originals transforming in one isolate, and the whole
 * isolate died, taking the page request down with it):
 *
 * 1. Only ONE size is ever cut from the original — the largest. The smaller
 *    two are cut from that copy, which is a couple of hundred kilobytes
 *    rather than a dozen megabytes.
 * 2. `warmLargestVariant` is called at upload, one image per request, so by
 *    the time a page asks for anything the expensive step is already done.
 */
const SOURCE_VARIANT: ImageVariant = "lg";

async function cut(
  sourceBody: ReadableStream<Uint8Array>,
  key: string,
  width: number,
): Promise<VariantBody | null> {
  const env = await getEnv();

  const result = await env.IMAGES.input(sourceBody)
    .transform({ width, fit: "scale-down" })
    .output({ format: VARIANT_CONTENT_TYPE });

  const bytes = await result.response().arrayBuffer();
  const stored = await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType: VARIANT_CONTENT_TYPE },
  });

  return { body: bytes, size: bytes.byteLength, etag: stored.httpEtag };
}

/** The largest copy, cut straight from the original. The expensive one. */
export async function warmLargestVariant(
  r2Key: string,
): Promise<VariantBody | null> {
  const key = variantKey(r2Key, SOURCE_VARIANT);

  const cached = await getObject(key);
  if (cached) {
    return { body: cached.body, size: cached.size, etag: cached.httpEtag };
  }

  const original = await getObject(r2Key);
  if (!original) return null;

  try {
    return await cut(original.body, key, IMAGE_VARIANTS[SOURCE_VARIANT]);
  } catch {
    // A corrupt file, or an account without image transformations. Neither
    // is worth a broken page when the original is right there.
    return null;
  }
}

export async function getImageVariant(
  r2Key: string,
  variant: ImageVariant,
): Promise<VariantBody | null> {
  const key = variantKey(r2Key, variant);

  const cached = await getObject(key);
  if (cached) {
    return { body: cached.body, size: cached.size, etag: cached.httpEtag };
  }

  // Everything is cut from the largest copy, so the original is read at most
  // once per image no matter how many sizes are asked for.
  const source = await warmLargestVariant(r2Key);
  if (!source) return null;
  if (variant === SOURCE_VARIANT) return source;

  try {
    const body =
      source.body instanceof ArrayBuffer
        ? new Response(source.body).body
        : source.body;
    if (!body) return null;

    return await cut(body, key, IMAGE_VARIANTS[variant]);
  } catch {
    return null;
  }
}

/**
 * Removes a press object and any variants cut from it. Keys that were never
 * images simply have nothing to delete.
 */
export async function deletePressObject(key: string) {
  const env = await getEnv();
  await env.MEDIA.delete([key, ...variantKeys(key)]);
}
