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
  {
    slug: "knockin-on-heavens-door",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    year: 1973,
    writers: ["Bob Dylan"],
    key: "G",
    feel: "Laid back",
    bpm: 69,
    level: "Beginner",
    intro:
      "Four chords, one pattern, start to finish. One of the best first songs there is: easy to play, and it sounds like the record from day one.",
    strumming: {
      pattern: ["D", "-", "D", "U", "-", "U", "D", "U"],
      tip: "Easy and steady. Let the G ring out before you move on.",
    },
    sections: [
      { name: "Verse", bars: [["G"], ["D"], ["Am"], ["Am"], ["G"], ["D"], ["C"], ["C"]] },
      { name: "Chorus", repeat: 2, bars: [["G"], ["D"], ["Am"], ["Am"], ["G"], ["D"], ["C"], ["C"]] },
      { name: "Verse", bars: [["G"], ["D"], ["Am"], ["Am"], ["G"], ["D"], ["C"], ["C"]] },
      { name: "Chorus", repeat: 2, bars: [["G"], ["D"], ["Am"], ["Am"], ["G"], ["D"], ["C"], ["C"]] },
    ],
  },
  {
    slug: "hallelujah",
    title: "Hallelujah",
    artist: "Jeff Buckley",
    year: 1994,
    writers: ["Leonard Cohen"],
    key: "C",
    feel: "Slow",
    bpm: 60,
    meter: "6/8",
    level: "Beginner",
    intro:
      "A song people ask for at every campfire. The chords are friendly; the challenge is the feel: slow, patient and in 6/8.",
    strumming: {
      pattern: ["D", "D", "D", "D", "D", "D"],
      picking: ["Bass", "3", "2", "1", "2", "3"],
      tip: "Lean into 1 and 4, and keep the rest light.",
    },
    sections: [
      {
        name: "Verse",
        bars: [["C"], ["Am"], ["C"], ["Am"], ["F"], ["G"], ["C"], ["G"], ["C"], ["F", "G"], ["Am"], ["F"], ["G"], ["E7"], ["Am"], ["Am"]],
      },
      { name: "Chorus", bars: [["F"], ["F"], ["Am"], ["Am"], ["F"], ["F"], ["C"], ["G"], ["C"], ["G"]] },
      {
        name: "Verse",
        bars: [["C"], ["Am"], ["C"], ["Am"], ["F"], ["G"], ["C"], ["G"], ["C"], ["F", "G"], ["Am"], ["F"], ["G"], ["E7"], ["Am"], ["Am"]],
      },
      { name: "Chorus", bars: [["F"], ["F"], ["Am"], ["Am"], ["F"], ["F"], ["C"], ["G"], ["C"], ["G"]] },
    ],
  },
  {
    slug: "the-scientist",
    title: "The Scientist",
    artist: "Coldplay",
    year: 2002,
    writers: ["Guy Berryman", "Jonny Buckland", "Will Champion", "Chris Martin"],
    key: "F",
    feel: "Slow piano ballad",
    bpm: 74,
    level: "Intermediate",
    intro:
      "Written on piano, and it moves like one: slow, even and soft. On guitar it's three chords for the verse, one more for the chorus.",
    strumming: {
      pattern: ["D", "-", "D", "-", "D", "-", "D", "U"],
      tip: "Play it like the piano: steady, even, and quieter than you think.",
    },
    sections: [
      { name: "Verse", repeat: 2, bars: [["Dm"], ["Bb"], ["F"], ["F"], ["Dm"], ["Bb"], ["F"], ["F"]] },
      { name: "Chorus", bars: [["Bb"], ["F"], ["F"], ["C"], ["Bb"], ["F"], ["F"], ["C"]] },
      { name: "Verse", bars: [["Dm"], ["Bb"], ["F"], ["F"], ["Dm"], ["Bb"], ["F"], ["F"]] },
      { name: "Chorus", bars: [["Bb"], ["F"], ["F"], ["C"], ["Bb"], ["F"], ["F"], ["C"]] },
    ],
  },
  {
    slug: "save-tonight",
    title: "Save Tonight",
    artist: "Eagle-Eye Cherry",
    year: 1997,
    writers: ["Eagle-Eye Cherry"],
    key: "Am",
    feel: "Driving",
    bpm: 120,
    level: "Beginner",
    intro:
      "The same four chords from start to finish, which makes it perfect for getting your changes fast. Lock in, and drive it.",
    strumming: {
      pattern: ["D", "-", "D", "U", "-", "U", "D", "U"],
      tip: "Driving and steady, with a bit of muscle on the down strums.",
    },
    sections: [
      { name: "Verse", repeat: 2, bars: [["Am"], ["F"], ["C"], ["G"], ["Am"], ["F"], ["C"], ["G"]] },
      { name: "Chorus", repeat: 2, bars: [["Am"], ["F"], ["C"], ["G"], ["Am"], ["F"], ["C"], ["G"]] },
      { name: "Verse", bars: [["Am"], ["F"], ["C"], ["G"], ["Am"], ["F"], ["C"], ["G"]] },
      { name: "Chorus", repeat: 2, bars: [["Am"], ["F"], ["C"], ["G"], ["Am"], ["F"], ["C"], ["G"]] },
    ],
  },
  {
    slug: "when-you-say-nothing-at-all",
    title: "When You Say Nothing at All",
    artist: "Ronan Keating",
    year: 1999,
    writers: ["Paul Overstreet", "Don Schlitz"],
    key: "D",
    feel: "Gentle",
    bpm: 88,
    level: "Beginner",
    intro:
      "Three open chords and a lot of heart. A lovely one for weddings, and for anyone who just learned D, A and G.",
    strumming: {
      pattern: ["D", "-", "D", "U", "-", "U", "D", "U"],
      tip: "Gentle. Let the up strums whisper.",
    },
    sections: [
      { name: "Verse", repeat: 2, bars: [["D"], ["A"], ["G"], ["A"], ["D"], ["A"], ["G"], ["A"]] },
      { name: "Chorus", bars: [["G"], ["A"], ["D"], ["G"], ["G"], ["A"], ["D"], ["D"]] },
      { name: "Verse", bars: [["D"], ["A"], ["G"], ["A"], ["D"], ["A"], ["G"], ["A"]] },
      { name: "Chorus", bars: [["G"], ["A"], ["D"], ["G"], ["G"], ["A"], ["D"], ["D"]] },
    ],
  },
  {
    slug: "house-of-the-rising-sun",
    title: "House of the Rising Sun",
    artist: "The Animals",
    year: 1964,
    writers: ["Traditional"],
    key: "Am",
    feel: "Rolling",
    bpm: 76,
    meter: "6/8",
    level: "Intermediate",
    intro:
      "The classic picking song. Five chords that roll around and around, with a full F barre to earn your stripes.",
    strumming: {
      pattern: ["D", "D", "D", "D", "D", "D"],
      picking: ["Bass", "3", "2", "1", "2", "3"],
      tip: "Picking is the classic way to play it. Let every note ring into the next.",
    },
    sections: [
      {
        name: "Verse",
        repeat: 4,
        bars: [["Am"], ["C"], ["D"], ["F"], ["Am"], ["C"], ["E"], ["E"], ["Am"], ["C"], ["D"], ["F"], ["Am"], ["E"], ["Am"], ["E"]],
      },
    ],
  },
];

export function getSong(slug: string) {
  return SONGS.find((song) => song.slug === slug) ?? null;
}
