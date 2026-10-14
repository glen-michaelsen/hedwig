/**
 * What a press kit needs before it's a good Spotlight candidate. One list,
 * read by the musician's "Ready for Spotlight" checklist on the kit, the
 * admin's Spotlight board, and the email asking for what's missing.
 *
 * Two items are essential: without a cover and a press photo there's no
 * article to show. The rest are extras, the link included (it's optional
 * on the kit too): they put the release on the right Discover lists and
 * give the article its details.
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
  /** How the email asking for it names it: "A link to the music". */
  ask: string;
  essential: boolean;
  done: boolean;
  /** Where on the kit to fix it: "cover" is the kit page, the rest the edit form. */
  where: "kit" | "edit";
  anchor: string;
};

export function readinessOf(input: ReadinessInput): ReadinessItem[] {
  return [
    { key: "cover", label: "Album cover", ask: "An album cover", essential: true, done: input.hasCover, where: "kit", anchor: "cover" },
    { key: "photo", label: "Press photo", ask: "A press photo", essential: true, done: input.photoCount >= 1, where: "kit", anchor: "photos" },
    { key: "url", label: "Link", ask: "A link to the music", essential: false, done: Boolean(input.url), where: "edit", anchor: "url" },
    { key: "genre", label: "Genre", ask: "Genre", essential: false, done: input.genre.length > 0, where: "edit", anchor: "genre" },
    { key: "mood", label: "Mood/vibe", ask: "Mood", essential: false, done: input.mood.length > 0, where: "edit", anchor: "mood" },
    { key: "country", label: "Country", ask: "Country", essential: false, done: Boolean(input.country), where: "edit", anchor: "country" },
    { key: "language", label: "Language", ask: "Language", essential: false, done: Boolean(input.language), where: "edit", anchor: "language" },
    { key: "label", label: "Label", ask: "Label status", essential: false, done: Boolean(input.labelStatus), where: "edit", anchor: "labelStatus" },
    { key: "gender", label: "Gender", ask: "Gender", essential: false, done: Boolean(input.gender), where: "edit", anchor: "gender" },
  ];
}

export function readinessHref(releaseId: string, item: ReadinessItem) {
  return item.where === "kit" ? `/press/${releaseId}#${item.anchor}` : `/press/${releaseId}/edit#${item.anchor}`;
}

/** What's missing, split into what's needed and what would help. */
export function missingOf(items: ReadinessItem[]) {
  const missing = items.filter((item) => !item.done);
  return {
    essentials: missing.filter((item) => item.essential),
    extras: missing.filter((item) => !item.essential),
  };
}
