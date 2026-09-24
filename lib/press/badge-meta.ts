/**
 * Names and sizes of the Spotlight badges, with no rendering code, so the
 * article page's embed box can use them without pulling in the image
 * layout. The drawing itself is in spotlight-badge.tsx.
 */

export const BADGE_VARIANTS = [
  "a-light",
  "a-dark",
  "b",
  "c-light",
  "c-dark",
] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export function isBadgeVariant(value: string): value is BadgeVariant {
  return (BADGE_VARIANTS as readonly string[]).includes(value);
}

const SCALE = 2;
export const px = (value: number) => value * SCALE;

/** Transparent room around each badge, so its shadow isn't cut off. */
const MARGIN = 14;

export const BADGE_BODY = {
  "a-light": { width: 204, height: 44 },
  "a-dark": { width: 204, height: 44 },
  b: { width: 312, height: 40 },
  "c-light": { width: 300, height: 88 },
  "c-dark": { width: 300, height: 88 },
} as const;

/** The size the embed code gives the <img>, in CSS pixels. */
export function badgeSize(variant: BadgeVariant) {
  const body = BADGE_BODY[variant];
  return { width: body.width + MARGIN * 2, height: body.height + MARGIN * 2 };
}

/** The size of the PNG itself. */
export function badgeImageSize(variant: BadgeVariant) {
  const size = badgeSize(variant);
  return { width: px(size.width), height: px(size.height) };
}

export function badgeAlt(variant: BadgeVariant, data: { title: string; artist: string; rating: number; maxRating: number }) {
  if (variant.startsWith("a")) return "Featured on Trenodo Spotlight";
  return `${data.title} by ${data.artist}, featured on Trenodo Spotlight: ${data.rating} of ${data.maxRating} hearts`;
}
