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
export async function fetchLinkMeta(url: string): Promise<LinkMeta> {
  const provider = detectProvider(url);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "trenodo-linkbot/1.0" },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    if (!res.ok) return { title: null, provider };

    const html = (await res.text()).slice(0, 200_000);
    const og = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    );
    const title = og?.[1] ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
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
