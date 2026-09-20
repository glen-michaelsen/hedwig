/**
 * One fretted chord shape for a stringed instrument, low string to high.
 * Deliberately just data — no rendering, no instrument assumed beyond
 * `stringCount` — so the same shape can back an SVG diagram today, a
 * "here's a variation" comparison later, or a chord-detection tool that
 * matches a fingering back to a name.
 */
export type ChordShape = {
  /** Full name, e.g. "A major". */
  name: string;
  /** Short chord symbol, e.g. "A", "Am", "F#m". */
  shortName: string;
  /** Filename-safe id, e.g. "a-major". Used for the generated SVG and its URL. */
  slug: string;
  /**
   * One entry per string, lowest-pitched string first (a standard 6-string
   * guitar reads low E, A, D, G, B, high E). `null` = don't play this
   * string, `0` = open, `N` = fret this string at fret N.
   */
  frets: (number | null)[];
  /** Finger per string (1 = index … 4 = pinky), aligned with `frets`. Omit a string with `null`. */
  fingers?: (number | null)[];
  /**
   * The real-world fret number shown at the top of the diagram. Defaults
   * to 1 (the nut, drawn as a thicker line). A barre chord further up the
   * neck sets this to wherever its lowest fretted note actually is.
   */
  baseFret?: number;
  /** A single finger laid across multiple strings at one fret. */
  barre?: { fret: number; fromString: number; toString: number };
};

/** How many strings the shape assumes — 6 for guitar, 4 for bass or ukulele. */
export const GUITAR_STRING_COUNT = 6;
