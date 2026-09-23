import type { MetadataRoute } from "next";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";

/**
 * The static marketing pages, plus every published Spotlight article below.
 * A musician's own pages (/@handle, /kit/*) aren't listed — whether those
 * belong in a sitemap is a separate call (there could be thousands of them,
 * and not every one may want the exposure), not something to fold into this
 * quietly. Spotlight is different: it's Trenodo's own editorial content,
 * meant to be found.
 */
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/link-in-bio", priority: 0.9, changeFrequency: "monthly" },
  { path: "/press-kit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tutoring", priority: 0.9, changeFrequency: "monthly" },
  { path: "/setlist", priority: 0.8, changeFrequency: "monthly" },
  // Knowledge guide pages are added here once they have real content —
  // the placeholder pillars stay out (and noindex'd) until they do.
  { path: "/knowledge", priority: 0.7, changeFrequency: "weekly" },
  { path: "/knowledge/guitar", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/guitar/getting-started",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/chords",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/scales",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/reading-tabs",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/tuning",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/transposing",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/changing-strings",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/guitar/anatomy",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/piano", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/piano/anatomy",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/piano/chords",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/drums", priority: 0.7, changeFrequency: "monthly" },
  { path: "/knowledge/bass", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/bass/getting-started",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/bass/anatomy",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/bass/scales",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/vocals", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/vocals/getting-started",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/vocals/breath-support",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/vocals/vocal-registers",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/vocals/vocal-effects",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/theory", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/theory/scales-and-notes",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/theory/circle-of-fifths",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/theory/chord-notation",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/theory/concert-pitch",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/theory/overtones",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/songwriting", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/songwriting/finding-your-subject",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/anatomy-of-a-song",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/methods",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/metaphors",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/rhyme-patterns",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/refining-your-lyrics",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/titles-and-hooks",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/songwriting/common-mistakes",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/knowledge/record", priority: 0.7, changeFrequency: "monthly" },
  {
    path: "/knowledge/record/studio-setup",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/knowledge/record/choosing-software",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  { path: "/spotlight", priority: 0.6, changeFrequency: "weekly" },
  {
    path: "/spotlight/get-featured",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  { path: "/ideas", priority: 0.5, changeFrequency: "weekly" },
  { path: "/account/signup", priority: 0.7, changeFrequency: "monthly" },
  { path: "/account/login", priority: 0.3, changeFrequency: "yearly" },
];

// Reads the database, and Cloudflare's build step has no D1 access (only
// requests do) — a prerendered/ISR copy would either fail the build outright
// or freeze on whatever was published at build time. Same reasoning as the
// other D1-backed pages in this app.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticEntries = PAGES.map((page) => ({
    url: `https://trenodo.com${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const articles = await listPublishedSpotlights();
  const articleEntries = articles.map((article) => ({
    url: `https://trenodo.com/spotlight/${article.slug}`,
    lastModified: article.publishedAt ?? article.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries];
}
