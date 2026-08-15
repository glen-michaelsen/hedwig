/** The platforms offered in the editor, in the order they render. */
export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "spotify", label: "Spotify" },
  { id: "applemusic", label: "Apple Music" },
  { id: "soundcloud", label: "SoundCloud" },
  { id: "bandcamp", label: "Bandcamp" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "website", label: "Website" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["id"];

export function socialLabel(id: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.id === id)?.label ?? id;
}
