/**
 * Renders all five Spotlight badges to local PNGs with a sample release, so
 * the layout in lib/press/spotlight-badge.tsx can be tuned without a deploy.
 * The route calls the exact same functions.
 *
 * Usage: npx tsx scripts/preview-spotlight-badges.ts [cover.jpg] [out-dir] [title]
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadBadgeFonts } from "../lib/press/badge-font";
import {
  BADGE_VARIANTS,
  badgeImageSize,
  badgeText,
  buildBadgeJsx,
  type BadgeData,
} from "../lib/press/spotlight-badge";

async function main() {
  const [coverPath, outDir = "/tmp", title = "Paper Lanterns"] = process.argv.slice(2);

  const coverUrl = coverPath
    ? `data:image/jpeg;base64,${(await readFile(coverPath)).toString("base64")}`
    : null;

  const data: BadgeData = {
    title,
    coverUrl,
    rating: 5,
    maxRating: 6,
    month: "Sep 2026",
  };
  const fonts = await loadBadgeFonts(badgeText(data));
  console.log(`Fonts loaded: ${fonts.map((font) => font.weight).join(", ") || "none"}`);

  for (const variant of BADGE_VARIANTS) {
    const image = new ImageResponse(buildBadgeJsx(variant, data), {
      ...badgeImageSize(variant),
      fonts,
    });
    const out = join(outDir, `badge-${variant}.png`);
    await writeFile(out, Buffer.from(await image.arrayBuffer()));
    console.log(`Written to ${out}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
