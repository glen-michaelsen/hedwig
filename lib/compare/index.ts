import { beacons, featureFm, linkfire, linktree, linktreeAlternatives } from "./link-in-bio";
import { bandzoogle, epkBuilders, reverbnation } from "./press-kit";
import { bandhelper, setlistApps, setlistHelper } from "./setlist";
import { myMusicStaff, myMusicStaffAlternatives, opus1, tutorbird } from "./tutor";
import type { Comparison } from "./types";

export * from "./shared";
export * from "./types";

/**
 * Every compare page, in the order the /compare hub lists them within a
 * tool. A new page is a new entry here; the route, the hub and the sitemap
 * all read from this list.
 */
export const COMPARISONS: Comparison[] = [
  linktreeAlternatives,
  linktree,
  beacons,
  featureFm,
  linkfire,
  epkBuilders,
  bandzoogle,
  reverbnation,
  myMusicStaffAlternatives,
  myMusicStaff,
  tutorbird,
  opus1,
  setlistApps,
  bandhelper,
  setlistHelper,
];

/**
 * Old compare URLs and where they live now. The overviews were renamed from
 * "X alternatives" to their category; the old addresses redirect for good,
 * so links and search results keep working. Add a row on every rename.
 */
export const RENAMED_SLUGS: Record<string, string> = {
  "linktree-alternatives": "link-in-bio-tools",
  "my-music-staff-alternatives": "music-teacher-software",
};

export function getComparison(slug: string) {
  return COMPARISONS.find((item) => item.slug === slug) ?? null;
}

export function comparisonTitle(item: Comparison) {
  return item.kind === "versus" ? `Trenodo vs ${item.competitor}` : item.title;
}
