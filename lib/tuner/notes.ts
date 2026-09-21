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

const A4_FREQUENCY = 440;

export type DetectedNote = {
  name: string;
  octave: number;
  /** How far the input frequency is from this note, in cents (roughly -50 to +50). */
  cents: number;
};

/** The nearest equal-temperament note (A4 = 440Hz) to a frequency, and how many cents off it is. */
export function frequencyToNote(frequency: number): DetectedNote {
  const semitonesFromA4 = 12 * Math.log2(frequency / A4_FREQUENCY);
  const nearestSemitone = Math.round(semitonesFromA4);
  const cents = Math.round((semitonesFromA4 - nearestSemitone) * 100);

  // MIDI-style numbering: A4 is note 69, and note 60 (C4) is exactly
  // divisible by 12 — that anchor is what makes octave and name both fall
  // out of one number.
  const midi = 69 + nearestSemitone;
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;

  return { name, octave, cents };
}

export type TunerString = {
  /** e.g. "E2" — matched against a DetectedNote's name+octave. */
  label: string;
  note: string;
  octave: number;
  frequency: number;
};

/** Standard tuning, low string to high — the reference frequencies every guitar tuner is built around. */
export const STANDARD_TUNING: TunerString[] = [
  { label: "E2", note: "E", octave: 2, frequency: 82.41 },
  { label: "A2", note: "A", octave: 2, frequency: 110.0 },
  { label: "D3", note: "D", octave: 3, frequency: 146.83 },
  { label: "G3", note: "G", octave: 3, frequency: 196.0 },
  { label: "B3", note: "B", octave: 3, frequency: 246.94 },
  { label: "E4", note: "E", octave: 4, frequency: 329.63 },
];
