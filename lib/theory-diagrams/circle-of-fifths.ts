import type { CircleOfFifthsSegment } from "./types";

/**
 * The 12 positions, starting at C (12 o'clock) and moving clockwise — each
 * a fifth above the last, paired with its relative minor. Verified against
 * the standard circle: every major here shares a key signature with the
 * minor directly inside it.
 */
export const CIRCLE_OF_FIFTHS: CircleOfFifthsSegment[] = [
  { major: ["C"], minor: ["Am"] },
  { major: ["G"], minor: ["Em"] },
  { major: ["D"], minor: ["Bm"] },
  { major: ["A"], minor: ["F#m"] },
  { major: ["E"], minor: ["C#m"] },
  { major: ["B"], minor: ["G#m"] },
  { major: ["F#", "Gb"], minor: ["D#m", "Ebm"] },
  { major: ["Db"], minor: ["Bbm"] },
  { major: ["Ab"], minor: ["Fm"] },
  { major: ["Eb"], minor: ["Cm"] },
  { major: ["Bb"], minor: ["Gm"] },
  { major: ["F"], minor: ["Dm"] },
];
