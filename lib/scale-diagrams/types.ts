/**
 * A scale, described by its interval formula and a root — not by hand-drawn
 * dot positions. The diagram is derived from real note math (see render.ts),
 * so a new root or a new scale formula never needs new fret data, only a
 * new entry here.
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
  /** Inclusive fret window to draw. Defaults to open position, frets 0-4. */
  fretRange?: { start: number; end: number };
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
