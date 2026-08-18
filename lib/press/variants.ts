/**
 * Display sizes for press-kit images.
 *
 * The upload is the archive copy — full resolution, whatever the photographer
 * sent — and it is only ever handed over as a download. Everything the app
 * puts on screen is one of these resized copies instead.
 *
 * Shared by the pages (to build URLs) and the asset route (to resize and
 * cache), so nothing server-only belongs here.
 */

/** Longest edge, in CSS pixels, allowing for a 2× screen. */
export const IMAGE_VARIANTS = {
  sm: 320,
  md: 1024,
  lg: 2048,
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

export function isImageVariant(value: string | null): value is ImageVariant {
  return value !== null && value in IMAGE_VARIANTS;
}

/** WebP for all of them: every browser that can run this app reads it. */
export const VARIANT_CONTENT_TYPE = "image/webp";

/**
 * Formats worth resizing. A file that isn't one of these — audio, a PDF, a
 * TIFF someone talked past the picker — is served exactly as uploaded.
 */
const RESIZABLE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function isResizableImage(contentType: string) {
  return RESIZABLE.has(contentType.toLowerCase());
}

/**
 * Variants live beside the original rather than in a table of their own: the
 * key is derivable, so an asset row needs no extra columns and a missing
 * variant is just a cache miss.
 */
export function variantKey(r2Key: string, variant: ImageVariant) {
  return `${r2Key}.${variant}.webp`;
}

export function variantKeys(r2Key: string) {
  return Object.keys(IMAGE_VARIANTS).map((variant) =>
    variantKey(r2Key, variant as ImageVariant),
  );
}
