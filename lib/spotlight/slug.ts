/**
 * Slugs and ratings for Spotlight articles. Shared by the admin form and the
 * server that saves it, so nothing server-only belongs here.
 */

/** Hearts. Six of them, as asked. */
export const MAX_RATING = 6;

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_RATING;
}

/**
 * Danish and Norwegian vowels are transliterated rather than dropped —
 * "Sølv" becomes "solv", not "slv", which would be unreadable in a URL and
 * unsearchable in a CMS.
 */
export function slugify(headline: string): string {
  const base = headline
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/å/g, "a")
    .replace(/ß/g, "ss")
    // Split the rest into letter + combining mark, then drop the marks.
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

  return base || "spotlight";
}
