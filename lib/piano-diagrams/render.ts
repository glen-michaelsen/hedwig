import type { PianoChordShape, PianoNote } from "./types";

/**
 * Renders a PianoChordShape to a standalone SVG string — same reasoning as
 * the guitar diagrams: no CSS variables, hand-matched hex colors, a
 * self-contained file that works wherever it's opened, brand-purple dots
 * so the whole Knowledge section reads as one family regardless of
 * instrument.
 *
 * The keyboard is a fixed range (C4 to F5, an octave and a fourth) — wide
 * enough that every one of the 12 major and 12 minor triads (root always
 * in octave 4, third and fifth built up from it) fits in root position
 * without needing a different window per chord, the same "one consistent
 * canvas" approach as the guitar chord grid. The frame then crops halfway
 * into the next white key, so the highest black key (F#5, needed by B
 * major/minor) reads as "the keyboard keeps going" rather than a lone
 * black key stranded with empty space after it.
 */
const COLOR = {
  background: "#ffffff",
  whiteKey: "#ffffff",
  blackKey: "#3d372c",
  keyStroke: "#c7bda8",
  dot: "#825abe",
  dotText: "#ffffff",
};

const WHITE_KEY_WIDTH = 40;
const WHITE_KEY_HEIGHT = 150;
const BLACK_KEY_WIDTH = 24;
const BLACK_KEY_HEIGHT = 92;
const MARGIN = 16;
const DOT_RADIUS = 14;

/** The white keys shown, left to right — C4 through F5. */
const WHITE_KEYS: PianoNote[] = [
  { name: "C", octave: 4 },
  { name: "D", octave: 4 },
  { name: "E", octave: 4 },
  { name: "F", octave: 4 },
  { name: "G", octave: 4 },
  { name: "A", octave: 4 },
  { name: "B", octave: 4 },
  { name: "C", octave: 5 },
  { name: "D", octave: 5 },
  { name: "E", octave: 5 },
  { name: "F", octave: 5 },
];

/** Each black key sits on the boundary right after this white key's index — there's never one between E/F or B/C. */
const BLACK_KEYS: (PianoNote & { afterIndex: number })[] = [
  { name: "C#", octave: 4, afterIndex: 0 },
  { name: "D#", octave: 4, afterIndex: 1 },
  { name: "F#", octave: 4, afterIndex: 3 },
  { name: "G#", octave: 4, afterIndex: 4 },
  { name: "A#", octave: 4, afterIndex: 5 },
  { name: "C#", octave: 5, afterIndex: 7 },
  { name: "D#", octave: 5, afterIndex: 8 },
  { name: "F#", octave: 5, afterIndex: 10 },
];

/** How much of one more white key to show, cropped, past the last full one. */
const CROPPED_KEY_WIDTH = WHITE_KEY_WIDTH / 2;

const WIDTH =
  MARGIN * 2 + WHITE_KEYS.length * WHITE_KEY_WIDTH + CROPPED_KEY_WIDTH;
const HEIGHT = MARGIN * 2 + WHITE_KEY_HEIGHT;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sameNote(a: PianoNote, b: PianoNote) {
  return a.name === b.name && a.octave === b.octave;
}

export function renderPianoChordSvg(chord: PianoChordShape): string {
  const name = escapeXml(chord.name);
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="16" fill="${COLOR.background}" />`,
  );

  // White keys.
  WHITE_KEYS.forEach((_, i) => {
    const x = MARGIN + i * WHITE_KEY_WIDTH;
    parts.push(
      `<rect x="${x}" y="${MARGIN}" width="${WHITE_KEY_WIDTH}" height="${WHITE_KEY_HEIGHT}" fill="${COLOR.whiteKey}" stroke="${COLOR.keyStroke}" stroke-width="1.5" rx="4" />`,
    );
  });

  // A sliver of one more white key, cropped by the frame at half-width —
  // reads as "the keyboard keeps going" rather than ending cleanly right
  // where the last black key (F#5) would otherwise look stranded, with
  // empty space after it and nothing to its right.
  const croppedKeyX = MARGIN + WHITE_KEYS.length * WHITE_KEY_WIDTH;
  parts.push(
    `<rect x="${croppedKeyX}" y="${MARGIN}" width="${CROPPED_KEY_WIDTH}" height="${WHITE_KEY_HEIGHT}" fill="${COLOR.whiteKey}" stroke="${COLOR.keyStroke}" stroke-width="1.5" rx="4" />`,
  );

  // Black keys, drawn on top of the white-key seams they sit across.
  for (const key of BLACK_KEYS) {
    const centerX = MARGIN + (key.afterIndex + 1) * WHITE_KEY_WIDTH;
    const x = round(centerX - BLACK_KEY_WIDTH / 2);
    parts.push(
      `<rect x="${x}" y="${MARGIN}" width="${BLACK_KEY_WIDTH}" height="${BLACK_KEY_HEIGHT}" rx="3" fill="${COLOR.blackKey}" />`,
    );
  }

  // One dot per note in the chord, labelled with the note name — the
  // keyboard has no frets to say "where", so the name does that job here.
  for (const note of chord.notes) {
    const whiteIndex = WHITE_KEYS.findIndex((key) => sameNote(key, note));
    let x: number;
    let y: number;

    if (whiteIndex !== -1) {
      x = round(MARGIN + whiteIndex * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH / 2);
      y = round(MARGIN + WHITE_KEY_HEIGHT - 32);
    } else {
      const blackKey = BLACK_KEYS.find((key) => sameNote(key, note));
      if (!blackKey) continue;
      x = round(MARGIN + (blackKey.afterIndex + 1) * WHITE_KEY_WIDTH);
      y = round(MARGIN + BLACK_KEY_HEIGHT - 26);
    }

    parts.push(`<circle cx="${x}" cy="${y}" r="${DOT_RADIUS}" fill="${COLOR.dot}" />`);
    parts.push(
      `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${COLOR.dotText}">${escapeXml(note.name)}</text>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="${name} piano chord diagram">
  <title>${name} piano chord diagram</title>
  ${parts.join("\n  ")}
</svg>
`;
}
