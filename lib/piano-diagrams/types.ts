export type PianoNote = { name: string; octave: number };

/**
 * A chord as the exact keys to press — not just note names, since which
 * octave each one falls in is what actually distinguishes a root-position
 * triad from an inversion. Explicit here for the same reason the guitar
 * chord shapes are explicit: verified against a real voicing, not derived.
 */
export type PianoChordShape = {
  /** Full name, e.g. "C major". */
  name: string;
  /** Short chord symbol, e.g. "C", "Dm", "Bdim". */
  shortName: string;
  /** Filename-safe id, e.g. "c-major". */
  slug: string;
  notes: PianoNote[];
};
