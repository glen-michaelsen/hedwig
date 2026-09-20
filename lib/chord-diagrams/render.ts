import type { ChordShape } from "./types";

/**
 * Renders a ChordShape to a standalone SVG string — no CSS variables, no
 * external references, so the output is a self-contained file that works
 * wherever it's opened (a browser, an image crawler, a chat client).
 * Colors are hand-matched hex for the same reason lib/email.ts uses a fixed
 * palette instead of the app's OKLCH tokens: nothing outside the file can
 * hand it a value to resolve.
 */
const COLOR = {
  background: "#ffffff",
  grid: "#c7bda8",
  nut: "#3d372c",
  dot: "#825abe",
  dotText: "#ffffff",
  marker: "#6b6153",
  label: "#6b6153",
};

const FRET_ROWS = 4;
const WIDTH = 200;
const GRID_LEFT = 34;
const GRID_RIGHT = 176;
const GRID_TOP = 50;
const FRET_HEIGHT = 34;
const GRID_BOTTOM = GRID_TOP + FRET_ROWS * FRET_HEIGHT;
const HEIGHT = GRID_BOTTOM + 24;
const DOT_RADIUS = 12;

/** Keeps generated coordinates readable — SVG doesn't need float precision beyond this. */
function round(value: number) {
  return Math.round(value * 100) / 100;
}

function stringX(index: number, stringCount: number) {
  const gap = (GRID_RIGHT - GRID_LEFT) / (stringCount - 1);
  return round(GRID_LEFT + index * gap);
}

/** Vertical center of the fret space a note at `fret` sits in, given what fret the diagram starts on. */
function fretCenterY(fret: number, baseFret: number) {
  const row = fret - baseFret; // 0-indexed fret space from the top
  return round(GRID_TOP + row * FRET_HEIGHT + FRET_HEIGHT / 2);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderChordSvg(chord: ChordShape): string {
  const stringCount = chord.frets.length;
  const baseFret = chord.baseFret ?? 1;
  const name = escapeXml(chord.name);
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="16" fill="${COLOR.background}" />`,
  );

  // Strings.
  for (let i = 0; i < stringCount; i++) {
    const x = stringX(i, stringCount);
    parts.push(
      `<line x1="${x}" y1="${GRID_TOP}" x2="${x}" y2="${GRID_BOTTOM}" stroke="${COLOR.grid}" stroke-width="1.5" />`,
    );
  }

  // Frets (the top line is the nut, drawn thicker, only in open position).
  for (let row = 0; row <= FRET_ROWS; row++) {
    const y = GRID_TOP + row * FRET_HEIGHT;
    const isNut = row === 0 && baseFret === 1;
    parts.push(
      `<line x1="${GRID_LEFT}" y1="${y}" x2="${GRID_RIGHT}" y2="${y}" stroke="${isNut ? COLOR.nut : COLOR.grid}" stroke-width="${isNut ? 4 : 1.5}" />`,
    );
  }

  // A fret-number label when the diagram doesn't start at the nut.
  if (baseFret > 1) {
    parts.push(
      `<text x="${GRID_LEFT - 10}" y="${GRID_TOP + FRET_HEIGHT / 2 + 4}" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" fill="${COLOR.label}">${baseFret}fr</text>`,
    );
  }

  // Open/muted markers above the nut.
  for (let i = 0; i < stringCount; i++) {
    const fret = chord.frets[i];
    const x = stringX(i, stringCount);
    const y = GRID_TOP - 16;
    if (fret === null) {
      parts.push(
        `<path d="M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}" stroke="${COLOR.marker}" stroke-width="1.8" stroke-linecap="round" />`,
      );
    } else if (fret === 0) {
      parts.push(
        `<circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="${COLOR.marker}" stroke-width="1.8" />`,
      );
    }
  }

  // The barre bar, drawn under the finger dots so they read as sitting on top of it.
  if (chord.barre) {
    const { fret, fromString, toString } = chord.barre;
    const y = fretCenterY(fret, baseFret);
    const x1 = stringX(fromString, stringCount);
    const x2 = stringX(toString, stringCount);
    parts.push(
      `<rect x="${x1 - DOT_RADIUS}" y="${y - DOT_RADIUS}" width="${x2 - x1 + DOT_RADIUS * 2}" height="${DOT_RADIUS * 2}" rx="${DOT_RADIUS}" fill="${COLOR.dot}" />`,
    );
  }

  // Fretted notes.
  for (let i = 0; i < stringCount; i++) {
    const fret = chord.frets[i];
    if (!fret) continue;
    const x = stringX(i, stringCount);
    const y = fretCenterY(fret, baseFret);
    parts.push(`<circle cx="${x}" cy="${y}" r="${DOT_RADIUS}" fill="${COLOR.dot}" />`);
    const finger = chord.fingers?.[i];
    if (finger) {
      parts.push(
        `<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${COLOR.dotText}">${finger}</text>`,
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="${name} chord diagram">
  <title>${name} chord diagram</title>
  ${parts.join("\n  ")}
</svg>
`;
}
