import type { PianoChordShape, PianoNote } from "./types";

/**
 * Every root and its third/fifth are computed from plain semitone math
 * (major third = 4 semitones, minor third = 3, perfect fifth = 7 — always
 * from the root) rather than hand-typed, so there's no chance of a typo
 * in one of 24 note lists. Names use sharps only (never flats) — that
 * matches which physical key you press, which is what a beginner reading
 * a keyboard diagram needs, even where a stricter theory spelling would
 * use a flat or a double-sharp instead.
 */
const NOTE_NAMES = [
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
] as const;

const ROOT_OCTAVE = 4;

function noteAt(rootPitchClass: number, semitonesUp: number): PianoNote {
  const total = rootPitchClass + semitonesUp;
  return {
    name: NOTE_NAMES[total % 12],
    octave: ROOT_OCTAVE + Math.floor(total / 12),
  };
}

function triad(rootPitchClass: number, thirdInterval: 3 | 4): PianoNote[] {
  return [
    noteAt(rootPitchClass, 0),
    noteAt(rootPitchClass, thirdInterval),
    noteAt(rootPitchClass, 7),
  ];
}

function slugifyRoot(rootName: string): string {
  return rootName.toLowerCase().replace("#", "-sharp");
}

/** The 12 major triads — root, major third, perfect fifth. A "happy," bright sound. */
export const PIANO_MAJOR_CHORDS: PianoChordShape[] = NOTE_NAMES.map(
  (rootName, pc) => ({
    name: `${rootName} major`,
    shortName: rootName,
    slug: `${slugifyRoot(rootName)}-major`,
    notes: triad(pc, 4),
  }),
);

/** The 12 minor triads — root, minor third, perfect fifth. A darker, more melancholic sound. */
export const PIANO_MINOR_CHORDS: PianoChordShape[] = NOTE_NAMES.map(
  (rootName, pc) => ({
    name: `${rootName} minor`,
    shortName: `${rootName}m`,
    slug: `${slugifyRoot(rootName)}-minor`,
    notes: triad(pc, 3),
  }),
);

export const ALL_PIANO_CHORDS = [...PIANO_MAJOR_CHORDS, ...PIANO_MINOR_CHORDS];
