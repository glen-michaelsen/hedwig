import type { MetadataRoute } from "next";

/**
 * The static marketing pages only. A musician's own pages (/@handle,
 * /kit/*, /spotlight/*) aren't listed here — whether those belong in a
 * sitemap is a separate call (there could be thousands of them, and not
 * every one may want the exposure), not something to fold into this quietly.
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
  { path: "/spotlight", priority: 0.6, changeFrequency: "weekly" },
  { path: "/ideas", priority: 0.5, changeFrequency: "weekly" },
  { path: "/account/signup", priority: 0.7, changeFrequency: "monthly" },
  { path: "/account/login", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map((page) => ({
    url: `https://trenodo.com${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
