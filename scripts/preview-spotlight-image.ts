/**
 * Renders the Spotlight share-image layout straight to a local PNG, with
 * sample images and headline in place of a real article — no D1, no R2, no
 * deploy. For tuning the layout in lib/press/spotlight-image.tsx quickly;
 * the route itself calls the exact same function, so what's previewed here
 * is what ships.
 *
 * Usage: npx tsx scripts/preview-spotlight-image.ts [header.jpg] [cover.jpg] [out.png]
 */
import { readFile, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import {
  buildSpotlightImageJsx,
  SPOTLIGHT_IMAGE_HEIGHT,
  SPOTLIGHT_IMAGE_WIDTH,
} from "../lib/press/spotlight-image";

async function toDataUrl(path: string, mime: string): Promise<string> {
  const bytes = await readFile(path);
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function main() {
  const [headerPath, coverPath, outPath] = process.argv.slice(2);

  const headerUrl = headerPath
    ? await toDataUrl(headerPath, "image/jpeg")
    : null;
  const coverUrl = coverPath ? await toDataUrl(coverPath, "image/jpeg") : null;

  const image = new ImageResponse(
    buildSpotlightImageJsx({
      headerUrl,
      coverUrl,
      headline: "Raw and Emotional",
      rating: 4,
      maxRating: 6,
      headerFocusX: 50,
      headerFocusY: 35,
    }),
    { width: SPOTLIGHT_IMAGE_WIDTH, height: SPOTLIGHT_IMAGE_HEIGHT },
  );

  const buffer = Buffer.from(await image.arrayBuffer());
  const out = outPath ?? "/tmp/spotlight-preview.png";
  await writeFile(out, buffer);
  console.log(`Written to ${out}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
