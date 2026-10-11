import type { PianoNote } from "./types";

/**
 * Piano scales, one octave up from the root, with the standard right-hand
 * fingering. Notes come from the scale's steps, not typed by hand, so a
 * scale can't contain a wrong key. They're placed on the keyboard by pitch
 * (sharp names, the physical key) and shown to the reader spelled the way
 * the key signature writes them: Bb major has an Eb, not a D#.
 *
 * The fingerings are the ones taught everywhere. Most white-key scales
 * share 1 2 3 1 2 3 4 5 (thumb under after the third note); scales that
 * start on a black key begin on a longer finger, so the thumb lands on
 * white keys.
 */

export type PianoScale = {
  name: string;
  slug: string;
  kind: "major" | "minor";
  /** For placing on the keyboard: sharp names, real octaves. */
  keys: PianoNote[];
  /** For reading: "Bb C D Eb F G A Bb". */
  spelled: string[];
  /** Right-hand finger for each note, thumb = 1. */
  fingers: number[];
};

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];

export const SCALE_STEPS = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
} as const;

const ROOTS: Record<string, number> = { C: 0, "C#": 1, Db: 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };

function build(root: string, kind: "major" | "minor", fingers: number[]): PianoScale {
  const rootPc = ROOTS[root];
  const rootLetter = LETTERS.indexOf(root[0]);
  const keys: PianoNote[] = [];
  const spelled: string[] = [];
  let semitones = 0;
  for (let degree = 0; degree < 8; degree++) {
    const absolute = rootPc + semitones;
    keys.push({ name: SHARP_NAMES[absolute % 12], octave: 4 + Math.floor(absolute / 12) });
    // One letter per degree, then whatever sharp or flat makes it the right pitch.
    const letter = (rootLetter + degree) % 7;
    let shift = ((absolute % 12) - LETTER_PC[letter] + 12) % 12;
    if (shift > 6) shift -= 12;
    spelled.push(LETTERS[letter] + (shift === 1 ? "#" : shift === -1 ? "b" : ""));
    if (degree < 7) semitones += SCALE_STEPS[kind][degree];
  }
  const name = `${root} ${kind}`;
  return {
    name,
    slug: `${root.toLowerCase().replace("#", "-sharp").replace(/^([a-g])b$/, "$1-flat")}-${kind}`,
    kind,
    keys,
    spelled,
    fingers,
  };
}

const WHITE_KEY_FINGERING = [1, 2, 3, 1, 2, 3, 4, 5];

/** In the order of the circle of fifths: each one adds a sharp, then the flat keys come back round. */
export const MAJOR_SCALES: PianoScale[] = [
  build("C", "major", WHITE_KEY_FINGERING),
  build("G", "major", WHITE_KEY_FINGERING),
  build("D", "major", WHITE_KEY_FINGERING),
  build("A", "major", WHITE_KEY_FINGERING),
  build("E", "major", WHITE_KEY_FINGERING),
  build("B", "major", WHITE_KEY_FINGERING),
  build("F#", "major", [2, 3, 4, 1, 2, 3, 1, 2]),
  build("Db", "major", [2, 3, 1, 2, 3, 4, 1, 2]),
  build("Ab", "major", [3, 4, 1, 2, 3, 1, 2, 3]),
  build("Eb", "major", [3, 1, 2, 3, 4, 1, 2, 3]),
  build("Bb", "major", [4, 1, 2, 3, 1, 2, 3, 4]),
  build("F", "major", [1, 2, 3, 4, 1, 2, 3, 4]),
];

/** Natural minor scales on white keys: the ones every beginner meets first. */
export const MINOR_SCALES: PianoScale[] = [
  build("A", "minor", WHITE_KEY_FINGERING),
  build("E", "minor", WHITE_KEY_FINGERING),
  build("D", "minor", WHITE_KEY_FINGERING),
  build("G", "minor", WHITE_KEY_FINGERING),
  build("C", "minor", WHITE_KEY_FINGERING),
];

export const ALL_PIANO_SCALES = [...MAJOR_SCALES, ...MINOR_SCALES];
