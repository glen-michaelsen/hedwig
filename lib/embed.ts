/**
 * Pure URL helpers, safe on both sides of the wire.
 *
 * Deliberately NOT marked server-only: the student portal renders embeds
 * inside a client component. Anything here that needs network access or a
 * binding belongs in lib/links.ts instead.
 */

export function detectProvider(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com")
      return "youtube";
    if (host === "vimeo.com" || host === "player.vimeo.com") return "vimeo";
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------- music -------------------------------- */

export type MusicProvider = "spotify" | "apple" | "soundcloud" | "bandcamp";

export function detectMusicProvider(url: string): MusicProvider | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.endsWith("spotify.com")) return "spotify";
    if (host.endsWith("music.apple.com")) return "apple";
    if (host.endsWith("soundcloud.com")) return "soundcloud";
    if (host.endsWith("bandcamp.com")) return "bandcamp";
    return null;
  } catch {
    return null;
  }
}

/**
 * Player URL for a music link, or null when we can't build one — Bandcamp
 * embeds need an album id that isn't derivable from the page URL, so those
 * fall back to rendering as a plain link.
 */
export function musicEmbedUrl(url: string): {
  src: string;
  height: number;
} | null {
  const provider = detectMusicProvider(url);
  if (!provider) return null;

  try {
    const parsed = new URL(url);

    if (provider === "spotify") {
      // /track/ID → /embed/track/ID
      const path = parsed.pathname.replace(/^\/(embed\/)?/, "");
      if (!/^(track|album|playlist|artist|episode|show)\//.test(path)) {
        return null;
      }
      return {
        src: `https://open.spotify.com/embed/${path}`,
        height: path.startsWith("track/") ? 152 : 352,
      };
    }

    if (provider === "apple") {
      return {
        src: `https://embed.music.apple.com${parsed.pathname}${parsed.search}`,
        height: parsed.pathname.includes("?i=") ? 175 : 450,
      };
    }

    if (provider === "soundcloud") {
      // SoundCloud's player takes the track URL directly — no API needed.
      return {
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url,
        )}&color=%23825abe&hide_related=true&show_comments=false&show_teaser=false`,
        height: 166,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/** Returns the embeddable player URL for a known provider, else null. */
export function embedUrl(url: string, provider: string | null): string | null {
  try {
    const parsed = new URL(url);
    if (provider === "youtube") {
      const id =
        parsed.hostname === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (provider === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}
