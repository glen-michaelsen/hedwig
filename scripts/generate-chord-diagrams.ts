/**
 * Renders every chord in lib/chord-diagrams to a standalone SVG file under
 * public/images/knowledge/guitar/chords/ — real files with real URLs, so
 * they're eligible for Google Images (an inline <svg> in the page markup
 * isn't). Re-run this whenever a chord shape changes or a new one is added;
 * the output is checked into git like any other static asset.
 *
 * Usage: npx tsx scripts/generate-chord-diagrams.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ALL_GUITAR_CHORDS } from "../lib/chord-diagrams/guitar-chords";
import { renderChordSvg } from "../lib/chord-diagrams/render";

const OUT_DIR = path.join(
  process.cwd(),
  "public/images/knowledge/guitar/chords",
);

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const chord of ALL_GUITAR_CHORDS) {
    const svg = renderChordSvg(chord);
    const outPath = path.join(OUT_DIR, `${chord.slug}.svg`);
    await writeFile(outPath, svg, "utf8");
    console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  }

  console.log(`\n${ALL_GUITAR_CHORDS.length} chord diagrams generated.`);
}

main();
