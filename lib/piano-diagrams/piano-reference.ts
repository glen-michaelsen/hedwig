import type { PianoChordShape } from "./types";

/**
 * Non-chord diagrams that reuse the same keyboard renderer — right now
 * just the "find C" landmark used on the Anatomy page. Same shape/type as
 * a chord (name, slug, notes) even though a single note isn't a chord;
 * the renderer only cares about the notes array.
 */
export const PIANO_REFERENCE_DIAGRAMS: PianoChordShape[] = [
  {
    name: "Finding C on the keyboard",
    shortName: "C",
    slug: "find-c",
    notes: [{ name: "C", octave: 4 }],
  },
];
