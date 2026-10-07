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

/** One strum per eighth note: down, up, or a miss (the hand still moves). */
export type Strum = "D" | "U" | "-";

export type Song = {
  slug: string;
  title: string;
  artist: string;
  year: number;
  /** The songwriters, credited on the page. */
  writers: string[];
  /** The key it's recorded in, as a chord symbol: "F", "Am". */
  key: string;
  /** How it feels to play: "Slow and swung". */
  feel: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  strumming: { pattern: Strum[]; tip: string };
  sections: SongSection[];
  /** A short line about playing it, in the house voice. */
  intro: string;
};
