/**
 * The Instagram caption for a Spotlight article — plain text, built once
 * server-side (everything it needs is already on the article row) and
 * handed to a client-side copy button. Same "pure function, no app deps"
 * shape as lib/press/spotlight-image.tsx, for the same reason: easy to
 * reason about and to change without also touching data-fetching code.
 */

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export function buildSpotlightCaption({
  artistName,
  releaseTitle,
  releaseKind,
  headline,
  rating,
  maxRating,
  body,
}: {
  artistName: string;
  releaseTitle: string;
  releaseKind: keyof typeof KIND_LABELS;
  headline: string;
  rating: number;
  maxRating: number;
  body: string;
}): string {
  const hearts =
    "💜".repeat(rating) + "🤍".repeat(Math.max(maxRating - rating, 0));

  // Same paragraph split as the article page itself (blank line = break) —
  // the first one is the pull quote.
  const firstParagraph =
    body
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)[0] ?? "";

  return [
    `${artistName} – ${releaseTitle} (${KIND_LABELS[releaseKind]})`,
    "",
    `👉 ${headline}`,
    "",
    hearts,
    "",
    `“${firstParagraph}”`,
    "",
    "Get inspired to upcoming musicians on Trenodo.com 🔗",
  ].join("\n");
}
