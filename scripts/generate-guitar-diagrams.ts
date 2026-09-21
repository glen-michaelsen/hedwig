/**
 * Renders every chord and scale in lib/chord-diagrams and lib/scale-diagrams
 * to standalone SVG files under public/images/knowledge/guitar/ — real
 * files with real URLs, so they're eligible for Google Images (an inline
 * <svg> in the page markup isn't). Re-run this whenever a shape changes or
 * a new one is added; the output is checked into git like any other
 * static asset.
 *
 * Usage: npx tsx scripts/generate-chord-diagrams.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ALL_GUITAR_CHORDS,
  CAPO_TRANSPOSE_EXAMPLE,
} from "../lib/chord-diagrams/guitar-chords";
import { renderChordSvg } from "../lib/chord-diagrams/render";
import { GUITAR_SCALES } from "../lib/scale-diagrams/guitar-scales";
import { renderScaleSvg } from "../lib/scale-diagrams/render";

const GUITAR_DIR = path.join(process.cwd(), "public/images/knowledge/guitar");

async function main() {
  const chordDir = path.join(GUITAR_DIR, "chords");
  await mkdir(chordDir, { recursive: true });
  const allChords = [...ALL_GUITAR_CHORDS, ...CAPO_TRANSPOSE_EXAMPLE];
  for (const chord of allChords) {
    const outPath = path.join(chordDir, `${chord.slug}.svg`);
    await writeFile(outPath, renderChordSvg(chord), "utf8");
    console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  }

  const scaleDir = path.join(GUITAR_DIR, "scales");
  await mkdir(scaleDir, { recursive: true });
  for (const scale of GUITAR_SCALES) {
    const outPath = path.join(scaleDir, `${scale.slug}.svg`);
    await writeFile(outPath, renderScaleSvg(scale), "utf8");
    console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  }

  console.log(
    `\n${allChords.length} chord diagrams, ${GUITAR_SCALES.length} scale diagrams generated.`,
  );
}

main();
