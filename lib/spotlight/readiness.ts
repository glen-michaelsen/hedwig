/**
 * What a press kit needs before it's a good Spotlight candidate. One list,
 * read by the musician's "Ready for Spotlight" checklist on the kit and by
 * the admin's Spotlight board, so the two can never disagree about what
 * "ready" means.
 */

export type ReadinessInput = {
  hasCover: boolean;
  photoCount: number;
  url: string | null;
  genre: string[];
  mood: string[];
  country: string | null;
  language: string | null;
  labelStatus: string | null;
  gender: string | null;
};

export type ReadinessItem = {
  key: string;
  label: string;
  done: boolean;
  /** Where on the kit to fix it: "cover" is the kit page, the rest the edit form. */
  where: "kit" | "edit";
  anchor: string;
};

export function readinessOf(input: ReadinessInput): ReadinessItem[] {
  return [
    { key: "cover", label: "Album cover", done: input.hasCover, where: "kit", anchor: "cover" },
    { key: "photo", label: "Press photo", done: input.photoCount >= 1, where: "kit", anchor: "photos" },
    { key: "url", label: "Link", done: Boolean(input.url), where: "edit", anchor: "url" },
    { key: "genre", label: "Genre", done: input.genre.length > 0, where: "edit", anchor: "genre" },
    { key: "mood", label: "Mood/vibe", done: input.mood.length > 0, where: "edit", anchor: "mood" },
    { key: "country", label: "Country", done: Boolean(input.country), where: "edit", anchor: "country" },
    { key: "language", label: "Language", done: Boolean(input.language), where: "edit", anchor: "language" },
    { key: "label", label: "Label", done: Boolean(input.labelStatus), where: "edit", anchor: "labelStatus" },
    { key: "gender", label: "Gender", done: Boolean(input.gender), where: "edit", anchor: "gender" },
  ];
}

export function readinessHref(releaseId: string, item: ReadinessItem) {
  return item.where === "kit" ? `/press/${releaseId}#${item.anchor}` : `/press/${releaseId}/edit#${item.anchor}`;
}
