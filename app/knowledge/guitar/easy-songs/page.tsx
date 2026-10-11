import type { Metadata } from "next";
import Link from "next/link";
import { GuideFaq, GuideLayout, GuideStep } from "../../_components/guide-layout";
import { CalendarIcon, ChecklistIcon, PlayIcon, SparkleIcon } from "../../_components/guide-icons";
import { focusable } from "@/app/_components/ui";
import { bestCapo, chordsIn, diagramFor, shiftChord } from "@/lib/songs/chords";
import { SONGS } from "@/lib/songs/songs";
import type { Song } from "@/lib/songs/types";

/*
 * Generated from lib/songs/songs.ts: a song is easy when it has four
 * chords or fewer and you can play every one as an open shape, as written
 * or with the capo the song page suggests. Add a song there, and it
 * appears here in the right group.
 */

const PAGE_DESCRIPTION =
  "Easy guitar songs with 2, 3 and 4 chords: open chords only, with chord diagrams, strumming and a play-along for every song.";

export const metadata: Metadata = {
  title: "Easy Guitar Songs with 2, 3 and 4 Chords | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/easy-songs" },
  openGraph: {
    title: "Easy Guitar Songs with 2, 3 and 4 Chords",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/easy-songs",
    siteName: "Trenodo",
    type: "article",
  },
};

type EasySong = { song: Song; chords: string[]; capo: number | null };

/** The song as a beginner plays it: open shapes, with the capo if one makes them open. */
function asEasy(song: Song): EasySong | null {
  const chords = chordsIn(song);
  if (chords.length > 4) return null;
  if (chords.every((chord) => diagramFor(chord)?.open)) return { song, chords, capo: null };
  const capo = bestCapo(song);
  if (capo && capo.open === chords.length) {
    return { song, chords: chords.map((chord) => shiftChord(chord, capo.fret)), capo: capo.fret };
  }
  return null;
}

const GROUPS = [
  { count: 2, title: "Two chords", body: "The best place to start. Learn one change, and you can play a whole song." },
  { count: 3, title: "Three chords", body: "Three chords cover a huge share of folk, country and pop." },
  { count: 4, title: "Four chords", body: "Four chords, and you've got most of the radio covered." },
];

const FAQS = [
  {
    q: "What is the easiest song to play on guitar?",
    a: "A two-chord song, like Tom Dooley. You only need one chord change, D to A, and you can play the whole thing. Once that feels easy, move up to three and four chords.",
  },
  {
    q: "Which guitar chords should I learn first?",
    a: "G, C, D, Em and Am. With those five open chords, plus F later on, you can play most of the songs on this page and thousands more.",
  },
  {
    q: "What does the capo do on these songs?",
    a: "A capo moves the whole song up the neck, so you can use easy open shapes and still sound in the original key. The songs marked with a capo show you where to put it.",
  },
] as const;

export default function EasySongsPage() {
  const easy = SONGS.map(asEasy).filter((item): item is EasySong => item !== null);
  const groups = GROUPS.map((group) => ({
    ...group,
    songs: easy.filter((item) => item.chords.length === group.count).sort((a, b) => a.song.title.localeCompare(b.song.title)),
  })).filter((group) => group.songs.length > 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Easy guitar songs",
        numberOfItems: easy.length,
        itemListElement: easy.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${item.song.title} by ${item.song.artist}`,
          url: `https://trenodo.com/knowledge/guitar/songs/${item.song.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the song data in code, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songs"
        categoryHref="/knowledge/guitar/songs"
        title="Easy Guitar Songs with 2, 3 and 4 Chords"
        intro="Real songs, open chords only. Each one has its chord diagrams, the strumming, and a play-along that lights up every bar as you go. Pick one, and you're playing music today. 🎸"
      >
        {groups.map((group) => (
          <section key={group.count} id={`${group.count}-chords`} className="scroll-mt-24">
            <h2 className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
              {group.title}
              <span className="text-sm font-medium text-faint">
                {group.songs.length} {group.songs.length === 1 ? "song" : "songs"}
              </span>
            </h2>
            <p className="mt-2 text-base text-muted">{group.body}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {group.songs.map(({ song, chords, capo }) => (
                <li key={song.slug}>
                  <Link
                    href={`/knowledge/guitar/songs/${song.slug}`}
                    className={`group flex h-full flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift ${focusable}`}
                  >
                    <p className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-700">
                      {song.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{song.artist}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Chords">
                      {chords.map((chord) => (
                        <li
                          key={chord}
                          className="min-w-9 rounded-lg bg-brand-500/10 px-2 py-1 text-center text-sm font-semibold text-brand-700"
                        >
                          {chord}
                        </li>
                      ))}
                    </ul>
                    {capo && <p className="mt-auto pt-4 text-xs font-medium text-faint">Capo on fret {capo}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <GuideStep step={1} icon={<ChecklistIcon />} title="Learn the chords on their own">
          <p>
            Before the song, the shapes. Tap a chord on the song page to see every way to play it, and
            practise each one until it rings clean.
          </p>
        </GuideStep>
        <GuideStep step={2} icon={<CalendarIcon />} title="Then just the changes">
          <p>
            Switch between two chords, slowly, without strumming. Every song is mostly the same few
            changes, so this is where the real progress happens.
          </p>
        </GuideStep>
        <GuideStep step={3} icon={<PlayIcon />} title="Play along, slowly">
          <p>
            Press Play along and drop the tempo. The bar you&rsquo;re on lights up, and the next chord is
            always shown. Speed it up a little each day.
          </p>
        </GuideStep>
        <GuideStep step={4} icon={<SparkleIcon />} title="Then play it with the record" rail={false}>
          <p>
            Back at full speed, play along with the real recording. That&rsquo;s the moment it stops
            being practice and starts being music. 🎶
          </p>
        </GuideStep>

        <p className="text-sm text-muted">
          Looking for more?{" "}
          <Link href="/knowledge/guitar/songs" className={`rounded font-medium text-brand-600 hover:underline ${focusable}`}>
            All songs with chords
          </Link>
          .
        </p>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
