/**
 * Slugs and ratings for Spotlight articles. Shared by the admin form and the
 * server that saves it, so nothing server-only belongs here.
 */

/** Hearts. Six of them, as asked. */
export const MAX_RATING = 6;

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_RATING;
}

export { slugify } from "@/lib/slug";
