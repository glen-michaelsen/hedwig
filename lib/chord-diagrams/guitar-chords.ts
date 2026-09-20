import type { ChordShape } from "./types";

/**
 * The standard open and barre chords covered on the Guitar Chords guide.
 * Each shape is the common beginner fingering — the same ones taught
 * everywhere, not an original voicing — so a returning reader's teacher or
 * a video lesson won't contradict what's shown here.
 */
export const OPEN_CHORDS: ChordShape[] = [
  {
    name: "A major",
    shortName: "A",
    slug: "a-major",
    frets: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
  },
  {
    name: "A minor",
    shortName: "Am",
    slug: "a-minor",
    frets: [null, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
  },
  {
    name: "C major",
    shortName: "C",
    slug: "c-major",
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
  },
  {
    name: "D major",
    shortName: "D",
    slug: "d-major",
    frets: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
  },
  {
    name: "D minor",
    shortName: "Dm",
    slug: "d-minor",
    frets: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
  },
  {
    name: "E major",
    shortName: "E",
    slug: "e-major",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
  },
  {
    name: "E minor",
    shortName: "Em",
    slug: "e-minor",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
  },
  {
    name: "F major",
    shortName: "F",
    slug: "f-major",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5 },
  },
  {
    name: "G major",
    shortName: "G",
    slug: "g-major",
    frets: [3, 2, 0, 0, 3, 3],
    fingers: [2, 1, null, null, 3, 4],
  },
];

/**
 * Movable "CAGED" shapes — the E-shape and A-shape barre chords, each shown
 * at the position that gives the chord named. Move the same shape to any
 * fret and the chord name moves with it; see Transposing.
 */
export const BARRE_CHORDS: ChordShape[] = [
  {
    name: "B minor",
    shortName: "Bm",
    slug: "b-minor",
    frets: [null, 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    baseFret: 2,
    barre: { fret: 2, fromString: 1, toString: 5 },
  },
  {
    name: "B major",
    shortName: "B",
    slug: "b-major",
    frets: [null, 2, 4, 4, 4, 2],
    fingers: [null, 1, 3, 3, 3, 1],
    baseFret: 2,
    barre: { fret: 2, fromString: 1, toString: 5 },
  },
  {
    name: "D major (barre)",
    shortName: "D",
    slug: "d-major-barre",
    frets: [null, 5, 7, 7, 7, 5],
    fingers: [null, 1, 3, 3, 3, 1],
    baseFret: 5,
    barre: { fret: 5, fromString: 1, toString: 5 },
  },
  {
    name: "F# major",
    shortName: "F#",
    slug: "f-sharp-major",
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 2,
    barre: { fret: 2, fromString: 0, toString: 5 },
  },
  {
    name: "F# minor",
    shortName: "F#m",
    slug: "f-sharp-minor",
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 2,
    barre: { fret: 2, fromString: 0, toString: 5 },
  },
];

export const ALL_GUITAR_CHORDS = [...OPEN_CHORDS, ...BARRE_CHORDS];
