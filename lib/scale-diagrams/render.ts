import { STANDARD_TUNING, type ScaleShape } from "./types";

/**
 * Renders a ScaleShape to a standalone SVG string, same reasoning as
 * lib/chord-diagrams/render.ts: no CSS variables, hand-matched hex colors,
 * a self-contained file that works wherever it's opened.
 */
const COLOR = {
  background: "#ffffff",
  grid: "#c7bda8",
  nut: "#3d372c",
  root: "#825abe",
  rootText: "#ffffff",
  tone: "#efe9dd",
  toneStroke: "#825abe",
};

const STRING_COUNT = 6;
const GRID_LEFT = 30;
const GRID_TOP = 30;
const FRET_WIDTH = 52;
const STRING_GAP = 32;
const GRID_BOTTOM = GRID_TOP + (STRING_COUNT - 1) * STRING_GAP;
const DOT_RADIUS = 11;
const TONE_RADIUS = 8;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function fretX(fret: number, startFret: number) {
  return round(GRID_LEFT + (fret - startFret) * FRET_WIDTH);
}

function stringY(index: number) {
  return round(GRID_TOP + index * STRING_GAP);
}

function pitchClass(value: number) {
  return ((value % 12) + 12) % 12;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderScaleSvg(scale: ScaleShape): string {
  const { start, end } = scale.fretRange ?? { start: 0, end: 4 };
  const name = escapeXml(scale.name);
  const width = fretX(end, start) + 34;
  const height = GRID_BOTTOM + 34;
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${COLOR.background}" />`,
  );

  // Strings.
  for (let i = 0; i < STRING_COUNT; i++) {
    const y = stringY(i);
    parts.push(
      `<line x1="${GRID_LEFT}" y1="${y}" x2="${fretX(end, start)}" y2="${y}" stroke="${COLOR.grid}" stroke-width="1.5" />`,
    );
  }

  // Frets — the leftmost is the nut when the window starts at fret 0.
  for (let fret = start; fret <= end; fret++) {
    const x = fretX(fret, start);
    const isNut = fret === 0;
    parts.push(
      `<line x1="${x}" y1="${GRID_TOP}" x2="${x}" y2="${GRID_BOTTOM}" stroke="${isNut ? COLOR.nut : COLOR.grid}" stroke-width="${isNut ? 4 : 1.5}" />`,
    );
  }

  // Notes — every position in the fret window that belongs to the scale,
  // derived from the tuning and the scale's own interval formula.
  for (let i = 0; i < STRING_COUNT; i++) {
    const openPitch = STANDARD_TUNING[i];
    for (let fret = start; fret <= end; fret++) {
      const relative = pitchClass(openPitch + fret - scale.root);
      if (!scale.intervals.includes(relative)) continue;

      const x = fretX(fret, start);
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
