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
 * A resized copy of a press image, generated on first request and kept in R2
 * next to the original. Generating on demand rather than at upload time means
 * images uploaded before this existed get variants too, the first time anyone
 * looks at them.
 *
 * Returns null when there is nothing to serve — no original, or the resize
 * didn't work — and the caller falls back to the original bytes.
 */
export async function getImageVariant(
  r2Key: string,
  variant: ImageVariant,
): Promise<VariantBody | null> {
  const key = variantKey(r2Key, variant);

  const cached = await getObject(key);
  if (cached) {
    return { body: cached.body, size: cached.size, etag: cached.httpEtag };
  }

  const original = await getObject(r2Key);
  if (!original) return null;

  try {
    const env = await getEnv();
    const result = await env.IMAGES.input(original.body)
      .transform({ width: IMAGE_VARIANTS[variant], fit: "scale-down" })
      .output({ format: VARIANT_CONTENT_TYPE });

    const bytes = await result.response().arrayBuffer();
    const stored = await env.MEDIA.put(key, bytes, {
      httpMetadata: { contentType: VARIANT_CONTENT_TYPE },
    });

    return { body: bytes, size: bytes.byteLength, etag: stored.httpEtag };
  } catch {
    // A corrupt file, or an account without image transformations. Neither is
    // worth a broken page when the original is right there.
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
