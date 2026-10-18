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

/** The badge designs, in the order they're offered. */
export const BADGE_DESIGNS = [
  { variant: "a-light", name: "Simple", tone: "Light" },
  { variant: "a-dark", name: "Simple", tone: "Dark" },
  { variant: "b", name: "With hearts", tone: null },
  { variant: "c-light", name: "With your cover", tone: "Light" },
  { variant: "c-dark", name: "With your cover", tone: "Dark" },
] as const satisfies readonly { variant: BadgeVariant; name: string; tone: string | null }[];

/**
 * Copy-paste code for a badge: a plain link around an <img>, so it works
 * on any site builder, counts as a real link to the article, and runs no
 * script of ours on the artist's page.
 */
export function badgeEmbedCode(
  articleUrl: string,
  variant: BadgeVariant,
  data: { title: string; artist: string; rating: number; maxRating: number },
) {
  const { width, height } = badgeSize(variant);
  const alt = badgeAlt(variant, data).replace(/"/g, "&quot;");
  return `<a href="${articleUrl}" target="_blank" rel="noopener"><img src="${articleUrl}/badge/${variant}.png" alt="${alt}" width="${width}" height="${height}" style="border:0"></a>`;
}
