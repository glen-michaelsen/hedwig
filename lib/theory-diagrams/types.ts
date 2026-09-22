/**
 * One of the 12 positions around the circle of fifths. `major`/`minor` are
 * each 1 or 2 chord names — 2 only at the tritone position (F#/Gb), the
 * one spot on the circle that's genuinely ambiguous between sharp and
 * flat spelling; every other position has a single conventional name.
 */
export type CircleOfFifthsSegment = {
  major: string[];
  minor: string[];
};
