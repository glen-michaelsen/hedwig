import "server-only";
import { ImageResponse } from "next/og";
import { getEnv } from "@/lib/db";
import { getAnySpotlightImage, type getSpotlight } from "@/lib/dal/spotlight";
import { resolveOgImageDataUrl } from "@/lib/press/og-image";
import {
  buildSpotlightStoryJsx,
  SPOTLIGHT_STORY_VERSION,
  STORY_FONTS,
  STORY_HEIGHT,
  STORY_WIDTH,
  type StoryInput,
  type StoryKind,
} from "@/lib/press/spotlight-story";
import { GENRES, MOODS, parseTagList } from "@/lib/press/taxonomy";
import { parseQuotes } from "@/lib/spotlight/quotes";
import { MAX_RATING } from "@/lib/spotlight/slug";
import type { ShareImage } from "./share-image";

/**
 * The Spotlight's Instagram stories: which ones an article has, and each
 * one drawn once and kept in R2, like the post (share-image.ts). Each
 * story has its own slot ("post", "quote-card-2"), and a stored copy is
 * named after a fingerprint of everything it shows, so editing the
 * article redraws only the stories it changes.
 */

type Article = NonNullable<Awaited<ReturnType<typeof getSpotlight>>>;

const PREFIX = "spotlight-stories";
const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export type StorySlot = { slot: string; label: string };

const QUOTE_KINDS = ["quote-card", "quote-series"] as const;
const QUOTE_LABELS: Record<(typeof QUOTE_KINDS)[number], string> = {
  "quote-card": "Quote card",
  "quote-series": "Quote series",
};

function labelsFor(values: string[], options: readonly { value: string; label: string }[]) {
  const byValue = new Map(options.map((option) => [option.value, option.label]));
  return values.map((value) => byValue.get(value) ?? value);
}

/** "If you like" chips: genres, then moods. */
function tagsOf(article: Article) {
  return [
    ...labelsFor(parseTagList(article.releaseGenre), GENRES),
    ...labelsFor(parseTagList(article.releaseMood), MOODS),
  ];
}

/** Every story this article can make, in the order the admin sees them. */
export function storySlots(article: Article): StorySlot[] {
  const quotes = parseQuotes(article.quotes);
  const slots: StorySlot[] = [
    { slot: "post", label: "The post" },
    { slot: "read-review", label: "Read the review" },
    { slot: "out-now", label: "Out now" },
  ];
  if (article.releaseDate) slots.push({ slot: "coming-soon", label: "Coming soon" });
  if (tagsOf(article).length > 0) slots.push({ slot: "if-you-like", label: "If you like" });
  for (const kind of QUOTE_KINDS) {
    // A series of one is just a quote with a full bar.
    if (kind === "quote-series" && quotes.length < 2) continue;
    quotes.forEach((_, index) => {
      slots.push({ slot: `${kind}-${index + 1}`, label: `${QUOTE_LABELS[kind]} ${index + 1}` });
    });
  }
  return slots;
}

/** What a slot asks for, or null if this article doesn't have it. */
function resolveSlot(article: Article, slot: string): { kind: StoryKind; quoteIndex?: number } | null {
  if (!storySlots(article).some((candidate) => candidate.slot === slot)) return null;
  const match = slot.match(/^(quote-card|quote-series)-(\d+)$/);
  if (match) return { kind: match[1] as StoryKind, quoteIndex: Number(match[2]) - 1 };
  return { kind: slot as StoryKind };
}

/* ---------------------------------- fonts --------------------------------- */

type Font = { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" };

/** Served from public/fonts/stories by the Worker's own assets (OFL fonts, licences beside them). */
const FONT_FILES = [
  { name: STORY_FONTS.sans, file: "geist-sans-latin-400-normal.woff", weight: 400 },
  { name: STORY_FONTS.sans, file: "geist-sans-latin-600-normal.woff", weight: 600 },
] as const;

// Finished buffers only: a promise kept across requests would tie one
// request to another's I/O, which Workers doesn't allow.
let fonts: Font[] | null = null;

async function loadFonts(): Promise<Font[]> {
  if (fonts) return fonts;
  const env = await getEnv();
  const assets = env.ASSETS;
  if (!assets) throw new Error("No ASSETS binding for the story fonts");
  const loaded = await Promise.all(
    FONT_FILES.map(async ({ name, file, weight }) => {
      const response = await assets.fetch(new URL(`/fonts/stories/${file}`, env.APP_URL));
      if (!response.ok) throw new Error(`Story font missing: ${file}`);
      return { name, data: await response.arrayBuffer(), weight, style: "normal" as const };
    }),
  );
  fonts = loaded;
  return loaded;
}

/* --------------------------------- drawing -------------------------------- */

async function fingerprint(parts: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(parts));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function inputFor(article: Article, kind: StoryKind, quoteIndex: number | undefined): Omit<StoryInput, "headerUrl" | "coverUrl"> {
  const quotes = parseQuotes(article.quotes);
  return {
    kind,
    headerFocusX: article.headerFocusX,
    headerFocusY: article.headerFocusY,
    headline: article.headline,
    rating: article.rating,
    maxRating: MAX_RATING,
    artistName: article.artistName,
    releaseTitle: article.releaseTitle,
    releaseKind: KIND_LABELS[article.releaseKind],
    releaseDate: article.releaseDate,
    quote: quoteIndex === undefined ? undefined : quotes[quoteIndex],
    quoteNumber: quoteIndex === undefined ? undefined : quoteIndex + 1,
    quoteCount: quotes.length,
    tags: kind === "if-you-like" ? tagsOf(article) : undefined,
  };
}

async function render(article: Article, input: Omit<StoryInput, "headerUrl" | "coverUrl">): Promise<ShareImage> {
  const [header, cover] = await Promise.all([
    article.headerAssetId ? getAnySpotlightImage(article.headerAssetId) : null,
    article.coverAssetId ? getAnySpotlightImage(article.coverAssetId) : null,
  ]);
  const [headerUrl, coverUrl, loadedFonts] = await Promise.all([
    // Wider than the post's copy: a landscape photo has to fill 1920 high.
    header ? resolveOgImageDataUrl(header.r2Key, header.contentType, 1440) : null,
    cover ? resolveOgImageDataUrl(cover.r2Key, cover.contentType, 720) : null,
    loadFonts(),
  ]);

  const png = await new ImageResponse(buildSpotlightStoryJsx({ ...input, headerUrl, coverUrl }), {
    width: STORY_WIDTH,
    height: STORY_HEIGHT,
    fonts: loadedFonts,
  }).arrayBuffer();

  const env = await getEnv();
  try {
    const jpeg = await env.IMAGES.input(new Response(png).body!).output({ format: "image/jpeg", quality: 90 });
    return { bytes: await jpeg.response().arrayBuffer(), type: "image/jpeg", ext: "jpg" };
  } catch {
    return { bytes: png, type: "image/png", ext: "png" };
  }
}

/** One story as the article is now, drawn and stored if missing. Null if the article has no such story. */
export async function getStoryImage(article: Article, slot: string): Promise<ShareImage | null> {
  const resolved = resolveSlot(article, slot);
  if (!resolved) return null;
  const input = inputFor(article, resolved.kind, resolved.quoteIndex);

  const env = await getEnv();
  const print = await fingerprint([
    SPOTLIGHT_STORY_VERSION,
    input,
    article.headerAssetId,
    article.coverAssetId,
  ]);
  const base = `${PREFIX}/${article.id}/${slot}.`;

  const stored = (await env.MEDIA.get(`${base}${print}.jpg`)) ?? (await env.MEDIA.get(`${base}${print}.png`));
  if (stored) {
    return {
      bytes: await stored.arrayBuffer(),
      type: stored.httpMetadata?.contentType ?? "image/jpeg",
      ext: stored.key.endsWith(".png") ? "png" : "jpg",
    };
  }

  const made = await render(article, input);
  const key = `${base}${print}.${made.ext}`;
  await env.MEDIA.put(key, made.bytes, { httpMetadata: { contentType: made.type } });

  // Out with this slot's copies of content that has since changed.
  const old = await env.MEDIA.list({ prefix: base });
  await Promise.all(old.objects.filter((object) => object.key !== key).map((object) => env.MEDIA.delete(object.key)));
  return made;
}
