import {
  CHORD_QUALITIES,
  CHORD_ROOTS,
  voicingsFor,
  type ChordQuality,
  type ChordRoot,
} from "@/lib/chord-diagrams/chord-variants";
import type { Song } from "./types";

/**
 * Reading the chord symbols in a song chart, and moving them for a capo.
 * Every symbol resolves to a key and variant from chord-variants.ts, so a
 * song's diagrams are the same checked shapes as the chord pages.
 */

const NATURAL_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export type ParsedChord = { root: ChordRoot; quality: ChordQuality; symbol: string };

export function parseChord(symbol: string): ParsedChord | null {
  const match = symbol.match(/^([A-G])([#b]?)(.*)$/);
  if (!match) return null;
  const pc = (NATURAL_PC[match[1]] + (match[2] === "#" ? 1 : match[2] === "b" ? 11 : 0)) % 12;
  const root = CHORD_ROOTS.find((r) => r.pc === pc);
  const quality = CHORD_QUALITIES.find((q) => q.suffix === match[3]);
  return root && quality ? { root, quality, symbol } : null;
}

/** The symbol a chord has after moving it down `semitones` (what you play under a capo). */
export function shiftChord(symbol: string, semitones: number) {
  const chord = parseChord(symbol);
  if (!chord) return symbol;
  const root = CHORD_ROOTS.find((r) => r.pc === (chord.root.pc - semitones + 12) % 12)!;
  return `${root.symbol}${chord.quality.suffix}`;
}

/** The first shape on the chord pages: the open one where there is one. */
export function diagramFor(symbol: string) {
  const chord = parseChord(symbol);
  if (!chord) return null;
  const voicing = voicingsFor(chord.root, chord.quality)[0];
  return voicing
    ? {
        slug: voicing.slug,
        name: voicing.name,
        open: voicing.slug.endsWith("-open"),
        href: `/knowledge/guitar/chords/${chord.root.slug}#${chord.quality.key}`,
      }
    : null;
}

/** Each chord once, in the order it first appears. */
export function chordsIn(song: Song) {
  const seen = new Set<string>();
  for (const section of song.sections) {
    for (const bar of section.bars) for (const chord of bar) seen.add(chord);
  }
  return [...seen];
}

/**
 * The capo position that turns the most chords into open shapes, if any
 * beats playing it as written. Ties go to the lower fret.
 */
export function bestCapo(song: Song) {
  const chords = chordsIn(song);
  const openCount = (shift: number) =>
    chords.filter((chord) => diagramFor(shiftChord(chord, shift))?.open).length;

  let best = { fret: 0, open: openCount(0) };
  for (let fret = 1; fret <= 7; fret++) {
    const open = openCount(fret);
    if (open > best.open) best = { fret, open };
  }
  return best.fret > 0 ? best : null;
}
