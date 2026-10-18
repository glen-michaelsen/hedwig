/**
 * Quotes picked from a Spotlight for its Instagram stories. Stored as a
 * JSON array on the article; edited as one quote per line.
 */

export const MAX_QUOTES = 6;
export const MAX_QUOTE_LENGTH = 180;

/** Quotation marks a line might arrive wrapped in. The stories draw their own. */
const WRAPPING = /^["“”„«»'‘’]+|["“”„«»'‘’]+$/g;

/** One quote per non-empty line, trimmed and unwrapped. */
export function quotesFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(WRAPPING, "").trim())
    .filter(Boolean);
}

export function parseQuotes(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function serializeQuotes(quotes: string[]): string | null {
  return quotes.length > 0 ? JSON.stringify(quotes) : null;
}
