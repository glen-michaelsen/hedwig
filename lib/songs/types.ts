/**
 * A song as a chord chart: the chords bar by bar, section by section.
 * Never lyrics. They're licensed, and a chart that follows bars instead
 * of words works for playing along anyway.
 */

/** One bar: the chords in it, in order. One chord fills the bar; two split it. */
export type Bar = string[];

export type SongSection = {
  name: string;
  /** "×2" and so on, if the section repeats as written. */
  repeat?: number;
  bars: Bar[];
};

/**
 * How a bar counts. 4/4: four beats. 6/8: six eighth notes in two groups
 * of three, felt as two pulses (on 1 and 4). The play-along clicks every
 * beat in the bar, and `bpm` counts the pulse: the quarter note in 4/4,
 * the dotted quarter in 6/8.
 */
export type Meter = "4/4" | "6/8";

export const METERS: Record<Meter, { beats: number; pulse: number; groups: number[] }> = {
  "4/4": { beats: 4, pulse: 1, groups: [0] },
  "6/8": { beats: 6, pulse: 3, groups: [0, 3] },
};

/** One strum per eighth note: down, up, or a miss (the hand still moves). */
export type Strum = "D" | "U" | "-";

export type Song = {
  slug: string;
  title: string;
  artist: string;
  year: number;
  /** The songwriters, credited on the page. ["Traditional"] for a folk song. */
  writers: string[];
  /** The key it's recorded in, as a chord symbol: "F", "Am". */
  key: string;
  /** How it feels to play: "Slow and swung". */
  feel: string;
  /** The recording's tempo, in pulses per minute (see Meter), where play-along starts. */
  bpm: number;
  /** 4/4 unless set. */
  meter?: Meter;
  level: "Beginner" | "Intermediate" | "Advanced";
  /**
   * How to play the rhythm. `pattern` is one bar of eighth notes in 4/4;
   * leave it out for a song in 6/8 or 12/8, where the tip says it instead.
   */
  strumming: { pattern?: Strum[]; tip: string };
  sections: SongSection[];
  /** A short line about playing it, in the house voice. */
  intro: string;
};
