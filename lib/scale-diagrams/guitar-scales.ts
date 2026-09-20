import type { ScaleShape } from "./types";

const C = 0;

/**
 * The four scales covered on the Guitar Scales guide, all rooted on C —
 * matching what's described in the guide's text. The dot pattern for each
 * is computed from the interval formula, not hand-placed, so a different
 * root or a fifth scale is just a new entry here.
 */
export const GUITAR_SCALES: ScaleShape[] = [
  {
    name: "C major scale",
    shortName: "Major",
    slug: "major",
    root: C,
    intervals: [0, 2, 4, 5, 7, 9, 11],
  },
  {
    name: "C minor scale",
    shortName: "Minor",
    slug: "minor",
    root: C,
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  {
    name: "C major pentatonic scale",
    shortName: "Major pentatonic",
    slug: "major-pentatonic",
    root: C,
    intervals: [0, 2, 4, 7, 9],
    // Major pentatonic shares its five notes with the relative minor
    // pentatonic a minor third (3 semitones) below — anchoring the box
    // there reproduces that same well-known, clean shape instead of a
    // sparser, less standard one rooted directly on C.
    boxAnchorOffset: -3,
  },
  {
    name: "C minor pentatonic scale",
    shortName: "Minor pentatonic",
    slug: "minor-pentatonic",
    root: C,
    intervals: [0, 3, 5, 7, 10],
  },
];
