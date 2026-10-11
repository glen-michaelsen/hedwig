import type { PianoScale } from "./piano-scales";
import type { PianoNote } from "./types";

/**
 * A piano scale as a standalone SVG: the same keys and brand dots as the
 * chord diagrams (render.ts), on a two-octave keyboard (C4 to B5) so every
 * scale fits its full octave, the highest being B major. Each dot carries
 * the right-hand finger number, which is what a scale diagram is for; the
 * note names sit under the keyboard, spelled the scale's way.
 */
const COLOR = {
  background: "#ffffff",
  whiteKey: "#ffffff",
  blackKey: "#3d372c",
  keyStroke: "#c7bda8",
  dot: "#825abe",
  dotText: "#ffffff",
  label: "#6b6153",
};

const WHITE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_AFTER: Record<string, number> = { "C#": 0, "D#": 1, "F#": 3, "G#": 4, "A#": 5 };

const WHITE_KEY_WIDTH = 34;
const WHITE_KEY_HEIGHT = 130;
const BLACK_KEY_WIDTH = 21;
const BLACK_KEY_HEIGHT = 80;
const MARGIN = 14;
const DOT_RADIUS = 11;
const OCTAVES = [4, 5];
const WHITE_COUNT = OCTAVES.length * 7;
const CROPPED = WHITE_KEY_WIDTH / 2;
// Two rows of note names: white keys, then black keys a little lower, so a
// black key's name never crowds the white key's beside it.
const LABEL_SPACE = 40;

const WIDTH = MARGIN * 2 + WHITE_COUNT * WHITE_KEY_WIDTH + CROPPED;
const HEIGHT = MARGIN * 2 + WHITE_KEY_HEIGHT + LABEL_SPACE;

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/** Where a key's dot sits: the centre of a white key, or of a black key. */
function keyPosition(note: PianoNote) {
  const octaveOffset = (note.octave - OCTAVES[0]) * 7;
  const white = WHITE_NAMES.indexOf(note.name);
  if (white !== -1) {
    return {
      x: MARGIN + (octaveOffset + white) * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH / 2,
      y: MARGIN + WHITE_KEY_HEIGHT - 26,
      black: false,
    };
  }
  return {
    x: MARGIN + (octaveOffset + BLACK_AFTER[note.name] + 1) * WHITE_KEY_WIDTH,
    y: MARGIN + BLACK_KEY_HEIGHT - 20,
    black: true,
  };
}

export function renderPianoScaleSvg(scale: PianoScale): string {
  const parts: string[] = [];
  parts.push(`<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="16" fill="${COLOR.background}" />`);

  for (let i = 0; i <= WHITE_COUNT; i++) {
    const width = i === WHITE_COUNT ? CROPPED : WHITE_KEY_WIDTH;
    parts.push(
      `<rect x="${MARGIN + i * WHITE_KEY_WIDTH}" y="${MARGIN}" width="${width}" height="${WHITE_KEY_HEIGHT}" fill="${COLOR.whiteKey}" stroke="${COLOR.keyStroke}" stroke-width="1.5" rx="4" />`,
    );
  }
  for (const octave of OCTAVES) {
    for (const [name, after] of Object.entries(BLACK_AFTER)) {
      const centre = MARGIN + ((octave - OCTAVES[0]) * 7 + after + 1) * WHITE_KEY_WIDTH;
      parts.push(
        `<rect x="${centre - BLACK_KEY_WIDTH / 2}" y="${MARGIN}" width="${BLACK_KEY_WIDTH}" height="${BLACK_KEY_HEIGHT}" rx="3" fill="${COLOR.blackKey}" data-note="${name}${octave}" />`,
      );
    }
  }

  scale.keys.forEach((note, i) => {
    const { x, y, black } = keyPosition(note);
    parts.push(`<circle cx="${x}" cy="${y}" r="${DOT_RADIUS}" fill="${COLOR.dot}" />`);
    parts.push(
      `<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${COLOR.dotText}">${scale.fingers[i]}</text>`,
    );
    parts.push(
      `<text x="${x}" y="${MARGIN + WHITE_KEY_HEIGHT + (black ? 33 : 17)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${COLOR.label}">${escapeXml(scale.spelled[i])}</text>`,
    );
  });

  const name = escapeXml(scale.name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="${name} scale on piano, with right-hand fingering">
  <title>${name} scale on piano, with right-hand fingering</title>
  ${parts.join("\n  ")}
</svg>
`;
}
