/**
 * Renders every Spotlight story layout to local PNGs, with sample images
 * and text in place of a real article: no D1, no R2, no deploy. For tuning
 * lib/press/spotlight-story.tsx; the story route calls the same function.
 *
 * Usage: npx tsx scripts/preview-spotlight-stories.ts [header.jpg] [cover.jpg] [out-dir] [header-grey.jpg]
 *
 * The quote series tints a greyscale photo (the route asks Cloudflare
 * Images for one); pass a greyscale copy as the fourth argument, e.g.
 * sips -m "/System/Library/ColorSync/Profiles/Generic Gray Profile.icc" in.jpg --out grey.jpg
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  buildSpotlightStoryJsx,
  STORY_FONTS,
  STORY_HEIGHT,
  STORY_WIDTH,
  type StoryInput,
  type StoryKind,
} from "../lib/press/spotlight-story";

const FONTS = "public/fonts/stories";

async function toDataUrl(path: string): Promise<string> {
  const bytes = await readFile(path);
  const mime = path.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

const font = async (file: string) => {
  const bytes = await readFile(join(FONTS, file));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

async function main() {
  const [headerPath, coverPath, outDir = "/tmp/spotlight-stories", greyPath] = process.argv.slice(2);
  const headerUrl = headerPath ? await toDataUrl(headerPath) : null;
  const greyUrl = greyPath ? await toDataUrl(greyPath) : headerUrl;
  const coverUrl = coverPath ? await toDataUrl(coverPath) : null;
  const fonts = [
    { name: STORY_FONTS.sans, data: await font("geist-sans-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
    { name: STORY_FONTS.sans, data: await font("geist-sans-latin-600-normal.woff"), weight: 600 as const, style: "normal" as const },
  ];

  const quotes = [
    "Some of her falsettos give me almost goosebump vibes.",
    "You can hear it’s an ANKAH track within seconds.",
    "The songs circle the same characteristic universe, but within it, there’s a lot of variety from track to track.",
  ];
  const base: Omit<StoryInput, "kind"> = {
    headerUrl,
    coverUrl,
    headerFocusX: 50,
    headerFocusY: 35,
    headline: "Dreamy, distinctive and full of goosebump moments",
    rating: 5,
    maxRating: 6,
    artistName: "ANKAH",
    releaseTitle: "Under dine lukkede øjne",
    releaseKind: "Album",
    releaseDate: "2026-10-09",
    quoteCount: quotes.length,
    tags: ["R&B / Soul", "Pop", "Dreamy"],
  };

  const stories: [string, StoryKind, number?][] = [
    ["01-post", "post"],
    ["03-quote-card", "quote-card", 1],
    ["03-quote-card-long", "quote-card", 2],
    ["10-quote-series-1", "quote-series", 0],
    ["06-out-now", "out-now"],
    ["07-coming-soon", "coming-soon"],
    ["09-if-you-like", "if-you-like"],
    ["10-quote-series-2", "quote-series", 1],
    ["11-read-review", "read-review"],
  ];

  await mkdir(outDir, { recursive: true });
  for (const [name, kind, quoteIndex] of stories) {
    const input: StoryInput = {
      ...base,
      headerUrl: kind === "quote-series" ? greyUrl : headerUrl,
      kind,
      quote: quoteIndex === undefined ? undefined : quotes[quoteIndex],
      quoteNumber: quoteIndex === undefined ? undefined : quoteIndex + 1,
    };
    const image = new ImageResponse(buildSpotlightStoryJsx(input), { width: STORY_WIDTH, height: STORY_HEIGHT, fonts });
    await writeFile(join(outDir, `${name}.png`), Buffer.from(await image.arrayBuffer()));
    console.log(`${name}.png`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
