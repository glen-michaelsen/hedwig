import type { ScaleShape } from "./types";

const C = 0;

/**
 * The four scales covered on the Guitar Scales guide, all rooted on C —
 * matching what's described in the guide's text. Each `dots` pattern is
 * confirmed against a reference: a compact 3-string (A, D, G) position,
 * same shape family as Major — low E, B and high E stay empty throughout.
 */
export const GUITAR_SCALES: ScaleShape[] = [
  {
    name: "C major scale",
    shortName: "Major",
    slug: "major",
    root: C,
    intervals: [0, 2, 4, 5, 7, 9, 11],
    dots: [[], [3, 5], [2, 3, 5], [2, 4, 5], [], []],
  },
  {
    name: "C minor scale",
    shortName: "Minor",
    slug: "minor",
    root: C,
    intervals: [0, 2, 3, 5, 7, 8, 10],
    dots: [[], [3, 5, 6], [3, 5, 6], [3, 5], [], []],
  },
  {
    name: "C major pentatonic scale",
    shortName: "Major pentatonic",
    slug: "major-pentatonic",
    root: C,
    intervals: [0, 2, 4, 7, 9],
    dots: [[], [3, 5], [2, 5], [2, 5], [], []],
  },
  {
    name: "C minor pentatonic scale",
    shortName: "Minor pentatonic",
    slug: "minor-pentatonic",
    root: C,
    intervals: [0, 3, 5, 7, 10],
    dots: [[], [3, 6], [3, 5], [3, 5], [], []],
  },
];
