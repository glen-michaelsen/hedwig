import "server-only";
import { getEnv } from "@/lib/db";
import { getObject } from "@/lib/r2";
import { isResizableImage } from "./variants";

/**
 * A PNG copy of a press image, sized for compositing into a generated
 * ImageResponse (Satori + resvg). Deliberately not the existing webp
 * variant pipeline in images.ts — every image this app already serves is
 * webp (variants.ts), and resvg's webp decoding is inconsistent enough that
 * betting a generated share image on it isn't worth it. This reuses the
 * exact same env.IMAGES transform call, just a different output format, so
 * it's proven machinery rather than a new integration.
 *
 * Cached beside the original under its own key — `.sm`/`.md`/`.lg.webp`
 * variants are untouched, no collision.
 */
function ogKey(r2Key: string, maxWidth: number) {
  return `${r2Key}.og${maxWidth}.png`;
}

export async function resolveOgImageDataUrl(
  r2Key: string,
  contentType: string,
  maxWidth: number,
): Promise<string | null> {
  const key = ogKey(r2Key, maxWidth);

  const cached = await getObject(key);
  if (cached) {
    const bytes = await cached.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
  }

  if (!isResizableImage(contentType)) return null;

  const original = await getObject(r2Key);
  if (!original) return null;

  const env = await getEnv();

  try {
    const result = await env.IMAGES.input(original.body)
      .transform({ width: maxWidth, fit: "scale-down" })
      .output({ format: "image/png" });

    const bytes = await result.response().arrayBuffer();
    await env.MEDIA.put(key, bytes, {
      httpMetadata: { contentType: "image/png" },
    });

    return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
  } catch {
    // A corrupt file, or an account without image transformations. The
    // composite still renders — just without this one image.
    return null;
  }
}
