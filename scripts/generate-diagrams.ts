/**
 * Renders every chord and scale in lib/chord-diagrams, lib/scale-diagrams
 * and lib/piano-diagrams to standalone SVG files under
 * public/images/knowledge/<instrument>/ — real files with real URLs, so
 * they're eligible for Google Images (an inline <svg> in the page markup
 * isn't). Re-run this whenever a shape changes or a new one is added; the
 * output is checked into git like any other static asset.
 *
 * Usage: npx tsx scripts/generate-diagrams.ts
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
import { ALL_PIANO_CHORDS } from "../lib/piano-diagrams/piano-chords";
import { PIANO_REFERENCE_DIAGRAMS } from "../lib/piano-diagrams/piano-reference";
import { renderPianoChordSvg } from "../lib/piano-diagrams/render";
import { CIRCLE_OF_FIFTHS } from "../lib/theory-diagrams/circle-of-fifths";
import { renderCircleOfFifthsSvg } from "../lib/theory-diagrams/render";

const KNOWLEDGE_DIR = path.join(process.cwd(), "public/images/knowledge");

async function writeAll<T extends { slug: string }>(
  dir: string,
  items: T[],
  render: (item: T) => string,
) {
  await mkdir(dir, { recursive: true });
  for (const item of items) {
    const outPath = path.join(dir, `${item.slug}.svg`);
    await writeFile(outPath, render(item), "utf8");
    console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  }
}

async function main() {
  const guitarChords = [...ALL_GUITAR_CHORDS, ...CAPO_TRANSPOSE_EXAMPLE];
  await writeAll(
    path.join(KNOWLEDGE_DIR, "guitar/chords"),
    guitarChords,
    renderChordSvg,
  );
  await writeAll(
    path.join(KNOWLEDGE_DIR, "guitar/scales"),
    GUITAR_SCALES,
    renderScaleSvg,
  );
  await writeAll(
    path.join(KNOWLEDGE_DIR, "piano/chords"),
    ALL_PIANO_CHORDS,
    renderPianoChordSvg,
  );
  await writeAll(
    path.join(KNOWLEDGE_DIR, "piano/reference"),
    PIANO_REFERENCE_DIAGRAMS,
    renderPianoChordSvg,
  );

  const theoryDir = path.join(KNOWLEDGE_DIR, "theory");
  await mkdir(theoryDir, { recursive: true });
  const circleOfFifthsPath = path.join(theoryDir, "circle-of-fifths.svg");
  await writeFile(circleOfFifthsPath, renderCircleOfFifthsSvg(CIRCLE_OF_FIFTHS), "utf8");
  console.log(`wrote ${path.relative(process.cwd(), circleOfFifthsPath)}`);

  console.log(
    `\n${guitarChords.length} guitar chord diagrams, ${GUITAR_SCALES.length} guitar scale diagrams, ${ALL_PIANO_CHORDS.length} piano chord diagrams generated.`,
  );
}

main();
