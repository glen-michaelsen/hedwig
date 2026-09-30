/**
 * Discover pages: saved searches over Spotlight, like "Songs by Danish
 * female singers". Nobody writes them. Every page is generated from the
 * tags musicians already put on their releases (lib/press/taxonomy.ts), and
 * a page only goes public once enough Spotlights match it.
 *
 * The rules, all in this file:
 * - One or two tags per page, never three. Three-tag pages multiply into
 *   thousands of near-empty pages nobody searches for.
 * - A page goes live at GO_LIVE_AT Spotlights. Once live it stays live down
 *   to STAY_LIVE_AT, so one unpublished article doesn't flip it off.
 * - A two-tag page must be narrower than both of its one-tag pages, or it's
 *   the same list under a second name.
 * - "Nordic" needs Spotlights from at least two Nordic countries, or it's
 *   the Danish page again.
 * - Singers sing: an instrumental release is never on a singers page.
 * - Only some values become pages. "Prefer not to say", "Another identity"
 *   and "Mixed" stay on the release and never become a headline.
 *
 * Slugs are part of the public URL. Once a page has been live, never change
 * its slug; add a new word instead.
 */

/** Low while Spotlight is young; raise both as it fills up. */
export const GO_LIVE_AT = 4;
export const STAY_LIVE_AT = 2;

export type DiscoverTags = {
  genre: string[];
  mood: string[];
  country: string | null;
  language: string | null;
  gender: string | null;
};

type Facet = "singer" | "country" | "genre" | "mood";

type Word = {
  facet: Facet;
  /** Stable key within its facet, used to find a page's one-tag parents. */
  key: string;
  match: (tags: DiscoverTags) => boolean;
};

const SINGERS = [
  { gender: "woman", slug: "female-singers", noun: "female singers" },
  { gender: "man", slug: "male-singers", noun: "male singers" },
  { gender: "non-binary", slug: "non-binary-singers", noun: "non-binary singers" },
].map((item) => ({
  ...item,
  word: {
    facet: "singer",
    key: item.gender,
    match: (tags) => tags.gender === item.gender && tags.language !== "instrumental",
  } satisfies Word,
}));

const NORDIC = ["DK", "SE", "NO", "FI", "IS"];

const COUNTRIES = [
  { key: "DK", codes: ["DK"], adjective: "Danish" },
  { key: "SE", codes: ["SE"], adjective: "Swedish" },
  { key: "NO", codes: ["NO"], adjective: "Norwegian" },
  { key: "FI", codes: ["FI"], adjective: "Finnish" },
  { key: "IS", codes: ["IS"], adjective: "Icelandic" },
  { key: "nordic", codes: NORDIC, adjective: "Nordic" },
  { key: "GB", codes: ["GB"], adjective: "British" },
  { key: "IE", codes: ["IE"], adjective: "Irish" },
  { key: "US", codes: ["US"], adjective: "American" },
  { key: "CA", codes: ["CA"], adjective: "Canadian" },
  { key: "AU", codes: ["AU"], adjective: "Australian" },
  { key: "DE", codes: ["DE"], adjective: "German" },
  { key: "NL", codes: ["NL"], adjective: "Dutch" },
  { key: "BE", codes: ["BE"], adjective: "Belgian" },
  { key: "FR", codes: ["FR"], adjective: "French" },
  { key: "ES", codes: ["ES"], adjective: "Spanish" },
  { key: "IT", codes: ["IT"], adjective: "Italian" },
  { key: "PL", codes: ["PL"], adjective: "Polish" },
  { key: "AT", codes: ["AT"], adjective: "Austrian" },
  { key: "CH", codes: ["CH"], adjective: "Swiss" },
].map((item) => ({
  ...item,
  slug: item.adjective.toLowerCase(),
  word: {
    facet: "country",
    key: item.key,
    match: (tags) => tags.country !== null && item.codes.includes(tags.country),
  } satisfies Word,
}));

/** Short forms of the taxonomy's genre labels, to read well mid-sentence. */
const GENRES = [
  ["pop", "pop"],
  ["indie", "indie"],
  ["electronic", "electronic"],
  ["hip-hop", "hip-hop"],
  ["rnb", "R&B"],
  ["rock", "rock"],
  ["folk", "folk"],
  ["jazz", "jazz"],
  ["classical", "classical"],
  ["metal", "metal"],
  ["punk", "punk"],
  ["country", "country"],
  ["reggae", "reggae"],
  ["latin", "Latin"],
  ["experimental", "experimental"],
].map(([value, name]) => ({
  value,
  name,
  word: {
    facet: "genre",
    key: value,
    match: (tags) => tags.genre.includes(value),
  } satisfies Word,
}));

const MOODS = [
  "upbeat",
  "melancholic",
  "chill",
  "driving",
  "dreamy",
  "dark",
  "romantic",
  "energetic",
  "stripped-back",
  "anthemic",
].map((value) => ({
  value,
  word: {
    facet: "mood",
    key: value,
    match: (tags) => tags.mood.includes(value),
  } satisfies Word,
}));

export type DiscoverGroup = "Singers" | "Countries" | "Genres" | "Moods" | "Mixes";

export type DiscoverPage = {
  slug: string;
  title: string;
  /** The short form, for chips. */
  label: string;
  /** How it reads mid-sentence, after "More": "More Danish female singers". */
  phrase: string;
  group: DiscoverGroup;
  words: Word[];
  /** Pages this one needs more than one country for (Nordic). */
  needsCountries?: number;
  /** A hand-written intro for the pages that matter most; the rest get a template. */
  intro?: string;
};

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function buildPages(): DiscoverPage[] {
  const pages: DiscoverPage[] = [];
  const nordic = (key: string) => (key === "nordic" ? 2 : undefined);

  for (const singer of SINGERS) {
    pages.push({
      slug: singer.slug,
      title: `Songs by ${singer.noun}`,
      label: capitalise(singer.noun),
      phrase: singer.noun,
      group: "Singers",
      words: [singer.word],
    });
  }
  for (const country of COUNTRIES) {
    pages.push({
      slug: `${country.slug}-music`,
      title: `New ${country.adjective} music`,
      label: `${country.adjective} music`,
      phrase: `${country.adjective} music`,
      group: "Countries",
      words: [country.word],
      needsCountries: nordic(country.key),
    });
  }
  for (const genre of GENRES) {
    pages.push({
      slug: `${genre.value}-music`,
      title: `New ${genre.name} music`,
      label: capitalise(genre.name),
      phrase: genre.name,
      group: "Genres",
      words: [genre.word],
    });
  }
  for (const mood of MOODS) {
    pages.push({
      slug: `${mood.value}-music`,
      title: `${capitalise(mood.value)} music`,
      label: capitalise(mood.value),
      phrase: `${mood.value} music`,
      group: "Moods",
      words: [mood.word],
    });
  }

  for (const country of COUNTRIES) {
    for (const singer of SINGERS) {
      pages.push({
        slug: `${country.slug}-${singer.slug}`,
        title: `Songs by ${country.adjective} ${singer.noun}`,
        label: `${country.adjective} ${singer.noun}`,
        phrase: `${country.adjective} ${singer.noun}`,
        group: "Mixes",
        words: [country.word, singer.word],
        needsCountries: nordic(country.key),
      });
    }
    for (const genre of GENRES) {
      pages.push({
        slug: `${country.slug}-${genre.value}-music`,
        title: `${country.adjective} ${genre.name} music`,
        label: `${country.adjective} ${genre.name}`,
        phrase: `${country.adjective} ${genre.name}`,
        group: "Mixes",
        words: [country.word, genre.word],
        needsCountries: nordic(country.key),
      });
    }
  }
  for (const genre of GENRES) {
    for (const singer of SINGERS) {
      pages.push({
        slug: `${genre.value}-${singer.slug}`,
        title: `${capitalise(genre.name)} songs by ${singer.noun}`,
        label: `${capitalise(genre.name)} by ${singer.noun}`,
        phrase: `${genre.name} by ${singer.noun}`,
        group: "Mixes",
        words: [genre.word, singer.word],
      });
    }
    for (const mood of MOODS) {
      pages.push({
        slug: `${mood.value}-${genre.value}-music`,
        title: `${capitalise(mood.value)} ${genre.name} music`,
        label: `${capitalise(mood.value)} ${genre.name}`,
        phrase: `${mood.value} ${genre.name}`,
        group: "Mixes",
        words: [mood.word, genre.word],
      });
    }
  }

  const intros: Record<string, string> = {
    "female-singers":
      "Songs by female singers, each one picked and written up by a musician for Trenodo Spotlight. Pop, indie, folk and whatever refuses a label. Newest first, so the fresh stuff sits on top 🎤",
    "danish-female-singers":
      "Denmark punches well above its weight in female singers. Here's every one we've put in the Spotlight, newest first. Each piece is written by a musician who listened properly, twice.",
    "danish-music":
      "New music from Denmark, one release at a time. Each piece is written by a musician, not an algorithm. Small country, big sound 🇩🇰",
  };
  return pages.map((page) => ({ ...page, intro: intros[page.slug] }));
}

export const DISCOVER_PAGES: readonly DiscoverPage[] = buildPages();

const BY_SLUG = new Map(DISCOVER_PAGES.map((page) => [page.slug, page]));

export function getDiscoverPage(slug: string) {
  return BY_SLUG.get(slug) ?? null;
}

export type DiscoverArticle = { id: string; tags: DiscoverTags };

export type DiscoverStatus = {
  page: DiscoverPage;
  /** Matching article ids, in the order they were given (newest first). */
  ids: string[];
  live: boolean;
  /** Why a page with matches isn't live, for the admin view. */
  reason: "live" | "too-few" | "same-as-parent" | "one-country";
};

const wordId = (word: Word) => `${word.facet}:${word.key}`;

/**
 * Every page with at least one match, and whether it's live. `wentLive` is
 * the set of slugs that have crossed GO_LIVE_AT before (the discover_page
 * table); pages newly over the line are returned in `newlyLive` for the
 * caller to record.
 */
export function evaluateDiscover(
  articles: DiscoverArticle[],
  wentLive: ReadonlySet<string>,
) {
  const matches = new Map<DiscoverPage, DiscoverArticle[]>();
  for (const page of DISCOVER_PAGES) {
    const found = articles.filter((article) =>
      page.words.every((word) => word.match(article.tags)),
    );
    if (found.length > 0) matches.set(page, found);
  }

  // The one-tag page for each word, to check that a mix narrows it down.
  const singleCounts = new Map<string, number>();
  for (const [page, found] of matches) {
    if (page.words.length === 1) singleCounts.set(wordId(page.words[0]), found.length);
  }

  const statuses: DiscoverStatus[] = [];
  const newlyLive: string[] = [];

  for (const [page, found] of matches) {
    const count = found.length;
    const countries = new Set(found.map((article) => article.tags.country));
    let reason: DiscoverStatus["reason"] = "live";

    if (page.needsCountries && countries.size < page.needsCountries) {
      reason = "one-country";
    } else if (
      page.words.length > 1 &&
      page.words.some((word) => count >= (singleCounts.get(wordId(word)) ?? 0))
    ) {
      reason = "same-as-parent";
    } else if (count < (wentLive.has(page.slug) ? STAY_LIVE_AT : GO_LIVE_AT)) {
      reason = "too-few";
    }

    const live = reason === "live";
    if (live && !wentLive.has(page.slug)) newlyLive.push(page.slug);
    statuses.push({ page, ids: found.map((article) => article.id), live, reason });
  }

  return { statuses, newlyLive };
}
