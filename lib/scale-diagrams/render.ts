import type { ScaleShape } from "./types";

/**
 * Renders a ScaleShape to a standalone SVG string, same reasoning as
 * lib/chord-diagrams/render.ts: no CSS variables, hand-matched hex colors,
 * a self-contained file that works wherever it's opened. Same visual
 * language as the chord diagrams too — a thick nut, brand-purple dots —
 * so the two diagram types read as one family.
 *
 * The grid always starts at the real nut (fret 0), same as looking at the
 * guitar itself, and extends a little past the highest marked fret so the
 * pattern doesn't feel cropped tight against the edge.
 */
const COLOR = {
  background: "#ffffff",
  grid: "#c7bda8",
  nut: "#3d372c",
  dot: "#825abe",
};

const STRING_COUNT = 6;
const GRID_LEFT = 30;
const GRID_TOP = 30;
const FRET_WIDTH = 46;
const STRING_GAP = 32;
const GRID_BOTTOM = GRID_TOP + (STRING_COUNT - 1) * STRING_GAP;
const DOT_RADIUS = 12;
const TRAILING_FRETS = 3;

function round(value: number) {
  return Math.round(value * 100) / 100;
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

export function renderScaleSvg(scale: ScaleShape): string {
  const highestFret = Math.max(0, ...scale.dots.flat());
  const endFret = scale.fretCount
    ? scale.fretCount - 1
    : highestFret + TRAILING_FRETS;

  const name = escapeXml(scale.name);
  // The position of fret wire N (N=0 is the nut).
  const fretX = (fret: number) => round(GRID_LEFT + fret * FRET_WIDTH);
  // A note at fret N is played in the space between wire N-1 and wire N,
  // not on the wire itself — same as pressing a real string down.
  const dotX = (fret: number) => round(fretX(fret) - FRET_WIDTH / 2);
  const gridRight = fretX(endFret);
  const width = gridRight + 24;
  const height = GRID_BOTTOM + 24;
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${COLOR.background}" />`,
  );

  // Strings.
  for (let i = 0; i < STRING_COUNT; i++) {
    const y = stringY(i);
    parts.push(
      `<line x1="${GRID_LEFT}" y1="${y}" x2="${gridRight}" y2="${y}" stroke="${COLOR.grid}" stroke-width="1.5" />`,
    );
  }

  // Frets, starting at the real nut — drawn thicker, exactly like the chord diagrams.
  for (let fret = 0; fret <= endFret; fret++) {
    const x = fretX(fret);
    const isNut = fret === 0;
    parts.push(
      `<line x1="${x}" y1="${GRID_TOP}" x2="${x}" y2="${GRID_BOTTOM}" stroke="${isNut ? COLOR.nut : COLOR.grid}" stroke-width="${isNut ? 4 : 1.5}" />`,
    );
  }

  // Notes — the curated position, exactly as given.
  for (let i = 0; i < STRING_COUNT; i++) {
    const y = stringY(i);
    for (const fret of scale.dots[i] ?? []) {
      const x = dotX(fret);
      parts.push(`<circle cx="${x}" cy="${y}" r="${DOT_RADIUS}" fill="${COLOR.dot}" />`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${name} guitar scale diagram">
  <title>${name} guitar scale diagram</title>
  ${parts.join("\n  ")}
</svg>
`;
}
