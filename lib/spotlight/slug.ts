/**
 * Slugs and ratings for Spotlight articles. Shared by the admin form and the
 * server that saves it, so nothing server-only belongs here.
 */

/** Hearts. Six of them, as asked. */
export const MAX_RATING = 6;

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_RATING;
}

export type SpotlightStatus = "draft" | "planned" | "published";

/**
 * `published` never changes meaning — it's still "an admin approved this
 * to go out." Whether that actually makes it live is a second question,
 * answered here: a future release date holds it back regardless, and that
 * combination is worth its own name (Planned) rather than looking like an
 * ordinary draft.
 */
export function computeSpotlightStatus(
  published: boolean,
  releaseDate: string | null,
  today: string,
): SpotlightStatus {
  if (!published) return "draft";
  if (releaseDate && releaseDate > today) return "planned";
  return "published";
}

export { slugify } from "@/lib/slug";
