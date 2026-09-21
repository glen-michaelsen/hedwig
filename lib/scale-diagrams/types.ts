/**
 * A scale, as one playable position on the fretboard. `dots` is the exact
 * pattern to draw — curated the same way a chord shape is, not derived
 * from "every occurrence of every scale tone" (which for a 7-note scale
 * produces a dense scatter nobody actually practices as a shape).
 * `intervals`/`root` are kept alongside it as the scale's real theory —
 * not used by the renderer, but there for whatever uses this data next
 * (a different position, a different root, a detection tool).
 */
export type ScaleShape = {
  /** Full name, e.g. "Major scale". */
  name: string;
  /** Short label, e.g. "Major". */
  shortName: string;
  /** Filename-safe id, e.g. "major". */
  slug: string;
  /** Semitone offsets from the root that belong to the scale (0-11). */
  intervals: number[];
  /** Root note as a pitch class: C=0, C#=1 … B=11. */
  root: number;
  /** One array per string (low E to high E, 6 total) — the exact frets to mark. An empty array means no dots on that string. */
  dots: number[][];
  /** How many fret columns to draw, starting from the nut. Defaults to the highest marked fret plus a few empty columns. */
  fretCount?: number;
};

/** Standard tuning, low string to high, as pitch classes (C=0): E A D G B E. */
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4];

export const PITCH_CLASS_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
