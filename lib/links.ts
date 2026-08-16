import "server-only";
import { detectProvider } from "./embed";

export type LinkMeta = {
  title: string | null;
  provider: string | null;
};

/**
 * Best-effort title lookup so the library isn't a wall of raw URLs.
 * Failure is fine — the tutor can always type a title.
 *
 * The pure helpers (detectProvider, embedUrl) live in lib/embed.ts so the
 * client can use them; this module makes network calls and stays on the
 * server.
 */
/**
 * oEmbed endpoints for the providers whose pages are too big to scrape.
 *
 * A YouTube watch page is ~1.3 MB and puts its `og:title` about 690 KB in —
 * past any sane read limit. Its oEmbed response is under a kilobyte and
 * carries the exact title, so for these we ask properly instead of scraping.
 */
const OEMBED_ENDPOINTS: Record<string, (url: string) => string> = {
  youtube: (url) =>
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
  vimeo: (url) =>
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
};

async function fetchOEmbedTitle(
  url: string,
  provider: string,
): Promise<string | null> {
  const endpoint = OEMBED_ENDPOINTS[provider];
  if (!endpoint) return null;

  try {
    const res = await fetch(endpoint(url), {
      headers: { "user-agent": "trenodo-linkbot/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { title?: unknown };
    return typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : null;
  } catch {
    return null;
  }
}

export async function fetchLinkMeta(url: string): Promise<LinkMeta> {
  const provider = detectProvider(url);

  if (provider) {
    const title = await fetchOEmbedTitle(url, provider);
    if (title) return { title, provider };
  }

  try {
    const res = await fetch(url, {
      headers: { "user-agent": "trenodo-linkbot/1.0" },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    if (!res.ok) return { title: null, provider };

    // Enough for any normal page — og tags live in <head>. The providers
    // that bury theirs a megabyte down are handled by oEmbed above.
    const html = (await res.text()).slice(0, 200_000);

    // Match the whole meta tag first, then pull `content` out of it, so
    // attribute order doesn't matter — plenty of sites write content first.
    const ogTag = html.match(/<meta[^>]+og:title[^>]*>/i)?.[0];
    const og = ogTag?.match(/content=["']([^"']*)["']/i)?.[1];

    const title = og || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    return { title: title ? decodeEntities(title.trim()) : null, provider };
  } catch {
    return { title: null, provider };
  }
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
