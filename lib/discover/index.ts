import "server-only";
import { cache } from "react";
import {
  listDiscoverArticles,
  listDiscoverWentLive,
  recordDiscoverLive,
  type DiscoverArticleRow,
} from "@/lib/dal/spotlight";
import { GENRES, parseTagList } from "@/lib/press/taxonomy";
import { evaluateDiscover, type DiscoverStatus } from "./pages";

/**
 * Every Discover page with matches, worked out fresh from the live
 * Spotlights. Cached per request, so an article page, the sitemap and the
 * Discover page itself each run the two queries once.
 */
export const getDiscover = cache(async () => {
  const [rows, wentLive] = await Promise.all([
    listDiscoverArticles(),
    listDiscoverWentLive(),
  ]);

  const { statuses, newlyLive } = evaluateDiscover(
    rows.map((row) => ({
      id: row.id,
      tags: {
        genre: parseTagList(row.genre),
        mood: parseTagList(row.mood),
        country: row.country,
        language: row.language,
        gender: row.gender,
      },
    })),
    wentLive,
  );

  // Bookkeeping only: a failed write means the page goes live on the next
  // request instead, which is no reason to fail this one.
  try {
    await recordDiscoverLive(newlyLive);
  } catch (error) {
    console.error("discover: couldn't record live pages", error);
  }

  return { statuses, articles: new Map(rows.map((row) => [row.id, row])) };
});

/** Specific pages first (two tags), then the biggest. */
function byRelevance(a: DiscoverStatus, b: DiscoverStatus) {
  return b.page.words.length - a.page.words.length || b.ids.length - a.ids.length;
}

export async function getLiveDiscoverPages() {
  const { statuses } = await getDiscover();
  return statuses.filter((status) => status.live).sort(byRelevance);
}

/** The live pages an article is on, for its "More like this" row. */
export async function getDiscoverPagesForArticle(articleId: string, limit = 4) {
  const live = await getLiveDiscoverPages();
  return live.filter((status) => status.ids.includes(articleId)).slice(0, limit);
}

const GENRE_LABELS = new Map(GENRES.map((genre) => [genre.value, genre.label]));

/** Facts worked out from a page's own Spotlights, so no two pages read alike. */
export function discoverStats(rows: DiscoverArticleRow[], ownGenres: string[]) {
  const averageRating = rows.reduce((sum, row) => sum + row.rating, 0) / rows.length;

  const genreCounts = new Map<string, number>();
  for (const row of rows) {
    for (const genre of parseTagList(row.genre)) {
      if (ownGenres.includes(genre)) continue;
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }
  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([genre]) => GENRE_LABELS.get(genre) ?? genre);

  const newestDate = rows.find((row) => row.releaseDate)?.releaseDate ?? null;
  const newest = newestDate
    ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
        new Date(`${newestDate}T12:00:00Z`),
      )
    : null;

  return { averageRating, topGenres, newest };
}
