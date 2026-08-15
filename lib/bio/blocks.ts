import { z } from "zod";

/**
 * Block configs are stored as JSON, so every read and write goes through
 * these. Anything that fails to parse is dropped rather than rendered —
 * a malformed block should not take a public page down.
 */

export const BLOCK_KINDS = ["link", "text", "player", "video"] as const;
export type BlockKind = (typeof BLOCK_KINDS)[number];

export const linkConfig = z.object({
  label: z.string().min(1).max(120),
  url: z.url(),
  description: z.string().max(200).nullish(),
});

export const textConfig = z.object({
  variant: z.enum(["heading", "paragraph", "divider"]),
  value: z.string().max(2000).nullish(),
});

export const playerConfig = z.object({
  url: z.url(),
  provider: z.string().nullish(),
});

export const videoConfig = z.object({
  url: z.url(),
  provider: z.string().nullish(),
});

const CONFIG_BY_KIND = {
  link: linkConfig,
  text: textConfig,
  player: playerConfig,
  video: videoConfig,
} as const;

export type LinkConfig = z.infer<typeof linkConfig>;
export type TextConfig = z.infer<typeof textConfig>;
export type PlayerConfig = z.infer<typeof playerConfig>;
export type VideoConfig = z.infer<typeof videoConfig>;

export type ParsedBlock =
  | { id: string; kind: "link"; visible: boolean; config: LinkConfig }
  | { id: string; kind: "text"; visible: boolean; config: TextConfig }
  | { id: string; kind: "player"; visible: boolean; config: PlayerConfig }
  | { id: string; kind: "video"; visible: boolean; config: VideoConfig };

export function parseBlockConfig(kind: string, raw: unknown) {
  const schema = CONFIG_BY_KIND[kind as BlockKind];
  if (!schema) return null;
  const result = schema.safeParse(raw);
  return result.success ? result.data : null;
}

/** Rows straight from the database → blocks safe to render. */
export function parseBlocks(
  rows: { id: string; kind: string; visible: boolean; config: string }[],
): ParsedBlock[] {
  const out: ParsedBlock[] = [];

  for (const row of rows) {
    let raw: unknown;
    try {
      raw = JSON.parse(row.config);
    } catch {
      continue;
    }
    const config = parseBlockConfig(row.kind, raw);
    if (!config) continue;

    out.push({
      id: row.id,
      kind: row.kind as BlockKind,
      visible: row.visible,
      config,
    } as ParsedBlock);
  }

  return out;
}

export const BLOCK_LABELS: Record<BlockKind, { title: string; hint: string }> = {
  link: { title: "Link", hint: "Anywhere you want to send people" },
  text: { title: "Text", hint: "A heading, a note, or a divider" },
  player: { title: "Music", hint: "Spotify, Apple Music or SoundCloud" },
  video: { title: "Video", hint: "YouTube or Vimeo" },
};
