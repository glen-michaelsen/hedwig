import type { Song } from "./types";

/**
 * Every song with a chord page, at /knowledge/guitar/songs/<slug>.
 *
 * Chords only, never lyrics. Write each chart from the recording itself,
 * not from another site's chart, and play it through against the record
 * before it ships. Every symbol must be one chord-variants.ts can draw:
 * run `npx tsx scripts/check-songs.ts` after any change.
 */
export const SONGS: Song[] = [
  {
    slug: "what-a-wonderful-world",
    title: "What a Wonderful World",
    artist: "Louis Armstrong",
    year: 1967,
    writers: ["Bob Thiele", "George David Weiss"],
    key: "F",
    feel: "Slow and swung",
    bpm: 72,
    level: "Intermediate",
    intro:
      "A slow ballad that lives on its chord changes. Take it easy, let every chord ring, and leave space. The capo version keeps the original sound with friendlier shapes.",
    strumming: {
      pattern: ["D", "-", "D", "U", "-", "U", "D", "U"],
      tip: "Swing it: long, short. And play it softer than you think.",
    },
    sections: [
      {
        name: "Verse",
        repeat: 2,
        bars: [["F", "Am"], ["Bb", "Am"], ["Gm", "F"], ["A7", "Dm"], ["Db"], ["Gm7", "C7"], ["F", "Bb"], ["F"]],
      },
      {
        name: "Bridge",
        bars: [["C"], ["F"], ["C"], ["F"], ["Dm", "C"], ["Dm", "C"], ["Dm", "C"], ["Gm7", "C7"]],
      },
      {
        name: "Verse",
        bars: [["F", "Am"], ["Bb", "Am"], ["Gm", "F"], ["A7", "Dm"], ["Db"], ["Gm7", "C7"], ["F", "Bb"], ["F"]],
      },
      {
        name: "Ending",
        bars: [["Gm7", "C7"], ["F", "Bb"], ["F"]],
      },
    ],
  },
];

export function getSong(slug: string) {
  return SONGS.find((song) => song.slug === slug) ?? null;
}
