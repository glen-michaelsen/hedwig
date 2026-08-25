import type { MetadataRoute } from "next";

/**
 * The signed-in dashboard is a dead end for a crawler anyway — it just hits
 * a login redirect — so there's no point spending crawl budget on it. The
 * signup and login pages sit under /account too but are the public front
 * doors, so they're allowed back in explicitly (the more specific rule
 * wins over the broader disallow). A musician's own public pages
 * (/@handle, /kit/*, /spotlight/*) are left open on purpose: getting
 * indexed there is a reason to use Trenodo, not just tolerated.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/account/signup", "/account/login"],
      disallow: [
        "/account",
        "/tutor",
        "/bio",
        "/press",
        "/setlists",
        "/s",
        "/api",
      ],
    },
    sitemap: "https://trenodo.com/sitemap.xml",
  };
}
