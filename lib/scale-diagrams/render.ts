import { STANDARD_TUNING, type ScaleShape } from "./types";

/**
 * Renders a ScaleShape to a standalone SVG string, same reasoning as
 * lib/chord-diagrams/render.ts: no CSS variables, hand-matched hex colors,
 * a self-contained file that works wherever it's opened.
 *
 * This draws one practiced position, not every occurrence of every scale
 * tone on the neck — a diatonic scale repeats constantly, and marking
 * every repeat produces a dense scatter nobody actually plays from. The
 * window is instead anchored on the low E string (at the scale's root, or
 * at `boxAnchorOffset` semitones from it) and kept to a few frets, which is
 * what a "position" or "box" pattern actually means on a fretboard.
 */
const COLOR = {
  background: "#ffffff",
  grid: "#c7bda8",
  root: "#825abe",
  tone: "#efe9dd",
  toneStroke: "#825abe",
  label: "#6b6153",
};

const STRING_COUNT = 6;
const GRID_TOP = 30;
const FRET_WIDTH = 52;
const STRING_GAP = 32;
const GRID_BOTTOM = GRID_TOP + (STRING_COUNT - 1) * STRING_GAP;
const DOT_RADIUS = 11;
const TONE_RADIUS = 8;
/** Room for a "5fr" label to the left of the grid, when the box isn't at the nut. */
const LABEL_WIDTH = 32;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function pitchClass(value: number) {
  return ((value % 12) + 12) % 12;
}

function stringY(index: number) {
  return round(GRID_TOP + index * STRING_GAP);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** The lowest fret on the low E string where the given pitch class falls. */
function findStartFret(targetPitchClass: number): number {
  return pitchClass(targetPitchClass - STANDARD_TUNING[0]);
}

export function renderScaleSvg(scale: ScaleShape): string {
  const fretWidth = scale.fretWidth ?? 4;
  const anchorPitch = pitchClass(scale.root + (scale.boxAnchorOffset ?? 0));
  const startFret = findStartFret(anchorPitch);
  const endFret = startFret + fretWidth - 1;

  const name = escapeXml(scale.name);
  const gridLeft = 10 + (startFret > 0 ? LABEL_WIDTH : 0);
  const fretX = (fret: number) => round(gridLeft + (fret - startFret) * FRET_WIDTH);
  const gridRight = fretX(endFret);
  const width = gridRight + 24;
  const height = GRID_BOTTOM + 34;
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${COLOR.background}" />`,
  );

  // Strings.
  for (let i = 0; i < STRING_COUNT; i++) {
    const y = stringY(i);
    parts.push(
      `<line x1="${gridLeft}" y1="${y}" x2="${gridRight}" y2="${y}" stroke="${COLOR.grid}" stroke-width="1.5" />`,
    );
  }

  // Frets.
  for (let fret = startFret; fret <= endFret; fret++) {
    const x = fretX(fret);
    parts.push(
      `<line x1="${x}" y1="${GRID_TOP}" x2="${x}" y2="${GRID_BOTTOM}" stroke="${COLOR.grid}" stroke-width="1.5" />`,
    );
  }

  // A fret-number label, since a single-position box almost never starts at the nut.
  if (startFret > 0) {
    parts.push(
      `<text x="${gridLeft - 16}" y="${GRID_TOP + 5}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="${COLOR.label}">${startFret}fr</text>`,
    );
  }

  // Notes — only within this one position, so the pattern is the one a
  // player would actually practice, not every repeat of every scale tone.
  for (let i = 0; i < STRING_COUNT; i++) {
    const openPitch = STANDARD_TUNING[i];
    for (let fret = startFret; fret <= endFret; fret++) {
      const relative = pitchClass(openPitch + fret - scale.root);
      if (!scale.intervals.includes(relative)) continue;

      const x = fretX(fret);
      const y = stringY(i);
      if (relative === 0) {
        parts.push(
          `<circle cx="${x}" cy="${y}" r="${DOT_RADIUS}" fill="${COLOR.root}" />`,
        );
      } else {
        parts.push(
          `<circle cx="${x}" cy="${y}" r="${TONE_RADIUS}" fill="${COLOR.tone}" stroke="${COLOR.toneStroke}" stroke-width="1.5" />`,
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${name} guitar scale diagram">
  <title>${name} guitar scale diagram</title>
  ${parts.join("\n  ")}
</svg>
`;
}
