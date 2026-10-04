import type { ChordShape } from "./types";

/**
 * Every common variant of a chord, for each of the twelve keys: the
 * /knowledge/guitar/chords/<root> pages.
 *
 * Shapes come from two places. Open chords are the standard beginner
 * fingerings, written out by hand. Everything else is a movable barre
 * shape (the E shape with the root on the 6th string, the A shape with the
 * root on the 5th) slid to the fret that gives the chord named. Both are
 * checked note for note by scripts/check-chord-variants.ts; run it after
 * any change here.
 */

/** Pitch classes: C = 0 … B = 11. */
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];

/** Open-string pitch classes, low E to high E. */
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4];

export type ChordRoot = {
  /** URL slug: "a", "b-flat", "c-sharp". */
  slug: string;
  /** How it's written: "A", "Bb", "C#". Plain b and #: the site font has no ♭ or ♯. */
  label: string;
  /** The same key under its other name, if it has one: "A#" for Bb. */
  alias?: string;
  /** ASCII symbol for chord names and alt text: "A", "Bb", "C#". */
  symbol: string;
  pc: number;
};

export const CHORD_ROOTS: ChordRoot[] = [
  { slug: "a", label: "A", symbol: "A", pc: 9 },
  { slug: "b-flat", label: "Bb", alias: "A#", symbol: "Bb", pc: 10 },
  { slug: "b", label: "B", symbol: "B", pc: 11 },
  { slug: "c", label: "C", symbol: "C", pc: 0 },
  { slug: "c-sharp", label: "C#", alias: "Db", symbol: "C#", pc: 1 },
  { slug: "d", label: "D", symbol: "D", pc: 2 },
  { slug: "e-flat", label: "Eb", alias: "D#", symbol: "Eb", pc: 3 },
  { slug: "e", label: "E", symbol: "E", pc: 4 },
  { slug: "f", label: "F", symbol: "F", pc: 5 },
  { slug: "f-sharp", label: "F#", alias: "Gb", symbol: "F#", pc: 6 },
  { slug: "g", label: "G", symbol: "G", pc: 7 },
  { slug: "a-flat", label: "Ab", alias: "G#", symbol: "Ab", pc: 8 },
];

/** A movable shape, as frets above the barre (null = don't play). */
type Template = {
  offsets: (number | null)[];
  fingers: (number | null)[];
  /** Strings the index finger lays across, if it's a barre. */
  barre?: [number, number];
};

export type ChordQuality = {
  /** Anchor on the page and part of the image slug: "major", "m7". */
  key: string;
  /** Appended to the root for the symbol: "", "m", "7", "maj7". */
  suffix: string;
  /** Appended to the root for the full name: "major", "minor seventh". */
  name: string;
  /** Semitones above the root, with the degree each one is written as. */
  intervals: { semitones: number; degree: number }[];
  /** The chord formula as musicians write it: "1 b3 5". */
  formula: string;
  /** One line on how it sounds. */
  feel: string;
  eShape?: Template;
  aShape?: Template;
};

const i = (semitones: number, degree: number) => ({ semitones, degree });

export const CHORD_QUALITIES: ChordQuality[] = [
  {
    key: "major",
    suffix: "",
    name: "major",
    intervals: [i(0, 1), i(4, 3), i(7, 5)],
    formula: "1 3 5",
    feel: "Bright and settled. Most songs start and end here.",
    eShape: { offsets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1], barre: [0, 5] },
    aShape: { offsets: [null, 0, 2, 2, 2, 0], fingers: [null, 1, 3, 3, 3, 1], barre: [1, 5] },
  },
  {
    key: "minor",
    suffix: "m",
    name: "minor",
    intervals: [i(0, 1), i(3, 3), i(7, 5)],
    formula: "1 b3 5",
    feel: "Lower the 3rd by one fret, and the mood turns.",
    eShape: { offsets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1], barre: [0, 5] },
    aShape: { offsets: [null, 0, 2, 2, 1, 0], fingers: [null, 1, 3, 4, 2, 1], barre: [1, 5] },
  },
  {
    key: "7",
    suffix: "7",
    name: "seventh",
    intervals: [i(0, 1), i(4, 3), i(7, 5), i(10, 7)],
    formula: "1 3 5 b7",
    feel: "Bluesy and a little restless. It wants to move on.",
    eShape: { offsets: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1], barre: [0, 5] },
    aShape: { offsets: [null, 0, 2, 0, 2, 0], fingers: [null, 1, 3, 1, 4, 1], barre: [1, 5] },
  },
  {
    key: "maj7",
    suffix: "maj7",
    name: "major seventh",
    intervals: [i(0, 1), i(4, 3), i(7, 5), i(11, 7)],
    formula: "1 3 5 7",
    feel: "Soft and dreamy. Late-night soul in one chord.",
    eShape: { offsets: [0, null, 1, 1, 0, null], fingers: [1, null, 3, 4, 2, null] },
    aShape: { offsets: [null, 0, 2, 1, 2, 0], fingers: [null, 1, 3, 2, 4, 1], barre: [1, 5] },
  },
  {
    key: "m7",
    suffix: "m7",
    name: "minor seventh",
    intervals: [i(0, 1), i(3, 3), i(7, 5), i(10, 7)],
    formula: "1 b3 5 b7",
    feel: "Mellow and smooth. A minor chord with its shoulders down.",
    eShape: { offsets: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 1, 1, 1, 1], barre: [0, 5] },
    aShape: { offsets: [null, 0, 2, 0, 1, 0], fingers: [null, 1, 3, 1, 2, 1], barre: [1, 5] },
  },
  {
    key: "sus2",
    suffix: "sus2",
    name: "suspended second",
    intervals: [i(0, 1), i(2, 2), i(7, 5)],
    formula: "1 2 5",
    feel: "Open and airy. Neither happy nor sad.",
    aShape: { offsets: [null, 0, 2, 2, 0, 0], fingers: [null, 1, 3, 4, 1, 1], barre: [1, 5] },
  },
  {
    key: "sus4",
    suffix: "sus4",
    name: "suspended fourth",
    intervals: [i(0, 1), i(5, 4), i(7, 5)],
    formula: "1 4 5",
    feel: "Tense, until it falls back to the major chord.",
    eShape: { offsets: [0, 2, 2, 2, 0, 0], fingers: [1, 2, 3, 4, 1, 1], barre: [0, 5] },
    aShape: { offsets: [null, 0, 2, 2, 3, 0], fingers: [null, 1, 2, 3, 4, 1], barre: [1, 5] },
  },
  {
    key: "dim",
    suffix: "dim",
    name: "diminished",
    intervals: [i(0, 1), i(3, 3), i(6, 5)],
    formula: "1 b3 b5",
    feel: "Dark and dramatic. Best as a quick step between two chords.",
    aShape: { offsets: [null, 0, 1, 2, 1, null], fingers: [null, 1, 2, 4, 3, null] },
  },
];

type OpenShape = {
  frets: (number | null)[];
  fingers: (number | null)[];
  barre?: [number, number, number];
};

/** The standard open fingerings, by root slug and quality key. */
const OPEN: Record<string, Record<string, OpenShape>> = {
  a: {
    major: { frets: [null, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
    minor: { frets: [null, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
    "7": { frets: [null, 0, 2, 0, 2, 0], fingers: [null, null, 2, null, 3, null] },
    maj7: { frets: [null, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] },
    m7: { frets: [null, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] },
    sus2: { frets: [null, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },
    sus4: { frets: [null, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 3, null] },
    dim: { frets: [null, 0, 1, 2, 1, null], fingers: [null, null, 1, 3, 2, null] },
  },
  b: {
    "7": { frets: [null, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4] },
  },
  c: {
    major: { frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
    "7": { frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] },
    maj7: { frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, null, null, null] },
    sus2: { frets: [null, 3, 0, 0, 1, 3], fingers: [null, 3, null, null, 1, 4] },
    sus4: { frets: [null, 3, 3, 0, 1, 1], fingers: [null, 3, 4, null, 1, 1], barre: [1, 4, 5] },
  },
  d: {
    major: { frets: [null, null, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
    minor: { frets: [null, null, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
    "7": { frets: [null, null, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
    maj7: { frets: [null, null, 0, 2, 2, 2], fingers: [null, null, null, 1, 2, 3] },
    m7: { frets: [null, null, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1], barre: [1, 4, 5] },
    sus2: { frets: [null, null, 0, 2, 3, 0], fingers: [null, null, null, 1, 3, null] },
    sus4: { frets: [null, null, 0, 2, 3, 3], fingers: [null, null, null, 1, 3, 4] },
  },
  e: {
    major: { frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
    minor: { frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
    "7": { frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
    maj7: { frets: [0, 2, 1, 1, 0, 0], fingers: [null, 3, 1, 2, null, null] },
    m7: { frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },
    sus4: { frets: [0, 2, 2, 2, 0, 0], fingers: [null, 2, 3, 4, null, null] },
  },
  f: {
    major: { frets: [null, null, 3, 2, 1, 1], fingers: [null, null, 3, 2, 1, 1], barre: [1, 4, 5] },
    maj7: { frets: [null, null, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null] },
  },
  g: {
    major: { frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, null, null, 3, 4] },
    "7": { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1] },
    maj7: { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, null, null, null, 1] },
  },
};

export type ChordVoicing = ChordShape & {
  /** How to describe where it sits: "Open", "Root on the 6th string, 5th fret". */
  position: string;
};

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th"];

function symbolFor(root: ChordRoot, quality: ChordQuality) {
  return `${root.symbol}${quality.suffix}`;
}

function nameFor(root: ChordRoot, quality: ChordQuality) {
  return `${root.label} ${quality.name}`;
}

function fromTemplate(
  root: ChordRoot,
  quality: ChordQuality,
  template: Template,
  rootString: 0 | 1,
): ChordVoicing | null {
  const fret = (root.pc - STANDARD_TUNING[rootString] + 12) % 12;
  // Fret 0 is the open chord, which has its own hand-written shape.
  if (fret === 0) return null;
  const shape = rootString === 0 ? "e-shape" : "a-shape";
  return {
    name: `${nameFor(root, quality)} (${rootString === 0 ? "E" : "A"} shape, ${ORDINAL[fret]} fret)`,
    shortName: symbolFor(root, quality),
    slug: `${root.slug}-${quality.key}-${shape}`,
    frets: template.offsets.map((offset) => (offset === null ? null : fret + offset)),
    fingers: template.fingers,
    baseFret: fret,
    barre: template.barre ? { fret, fromString: template.barre[0], toString: template.barre[1] } : undefined,
    position: `Root on the ${rootString === 0 ? "6th" : "5th"} string, ${ORDINAL[fret]} fret`,
  };
}

/** Every shape for one chord, open first, then up the neck. */
export function voicingsFor(root: ChordRoot, quality: ChordQuality): ChordVoicing[] {
  const voicings: ChordVoicing[] = [];
  const open = OPEN[root.slug]?.[quality.key];
  if (open) {
    voicings.push({
      name: `${nameFor(root, quality)} (open)`,
      shortName: symbolFor(root, quality),
      slug: `${root.slug}-${quality.key}-open`,
      frets: open.frets,
      fingers: open.fingers,
      barre: open.barre ? { fret: open.barre[0], fromString: open.barre[1], toString: open.barre[2] } : undefined,
      position: "Open position",
    });
  }
  const movable = [
    quality.eShape && fromTemplate(root, quality, quality.eShape, 0),
    quality.aShape && fromTemplate(root, quality, quality.aShape, 1),
  ]
    .filter((voicing): voicing is ChordVoicing => Boolean(voicing))
    .sort((a, b) => (a.baseFret ?? 0) - (b.baseFret ?? 0));
  return [...voicings, ...movable];
}

/** The chord's notes, spelled the way a chord chart writes them. */
export function chordNotes(root: ChordRoot, quality: ChordQuality): string[] {
  const rootLetter = LETTERS.indexOf(root.symbol[0] as (typeof LETTERS)[number]);
  return quality.intervals.map(({ semitones, degree }) => {
    const letter = (rootLetter + degree - 1) % 7;
    const pc = (root.pc + semitones) % 12;
    let shift = (pc - LETTER_PC[letter] + 12) % 12;
    if (shift > 6) shift -= 12;
    // A double flat or sharp is correct but reads as a typo to most
    // players: write the plain note it sounds as instead.
    if (Math.abs(shift) > 1) {
      const plain = LETTER_PC.indexOf(pc);
      if (plain !== -1) return LETTERS[plain];
    }
    return LETTERS[letter] + (shift === 1 ? "#" : shift === -1 ? "b" : "");
  });
}

export function getChordRoot(slug: string) {
  return CHORD_ROOTS.find((root) => root.slug === slug) ?? null;
}

/** Every variant diagram, for scripts/generate-diagrams.ts. */
export const ALL_CHORD_VARIANTS: ChordVoicing[] = CHORD_ROOTS.flatMap((root) =>
  CHORD_QUALITIES.flatMap((quality) => voicingsFor(root, quality)),
);

/**
 * Where a chord on the main Guitar Chords page leads: its key's page,
 * at the right variant. Keyed by the main page's diagram slugs.
 */
export function variantHref(slug: string) {
  const match = slug.match(/^([a-g](?:-sharp|-flat)?)-(major|minor)/);
  if (!match || !getChordRoot(match[1])) return null;
  return `/knowledge/guitar/chords/${match[1]}#${match[2]}`;
}
