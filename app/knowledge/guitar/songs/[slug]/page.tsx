import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideFaq, GuideLayout } from "../../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";
import { bestCapo, chordsIn, diagramFor, shiftChord } from "@/lib/songs/chords";
import { getSong } from "@/lib/songs/songs";
import { METERS, type Meter, type Song, type Strum } from "@/lib/songs/types";
import { SongChart, type ChartChord } from "./_components/song-chart";

// OpenNext on Workers has no cache for prerendered param pages, so these
// render per request. The data is static, so that's cheap.
export const dynamic = "force-dynamic";

/** "A, B and C": a list of names the way a sentence reads. */
const WRITERS = new Intl.ListFormat("en-GB", { type: "conjunction" });

const traditional = (song: Song) => song.writers.length === 1 && song.writers[0] === "Traditional";

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

function faqsFor(song: Song, chords: string[], capo: ReturnType<typeof bestCapo>) {
  return [
    {
      q: `What key is ${song.title} in?`,
      a: `${song.artist} recorded it in ${song.key}. It uses ${chords.length} chords: ${chords.join(", ")}.`,
    },
    {
      q: `Is ${song.title} hard to play on guitar?`,
      a: capo
        ? `It's a ${song.level.toLowerCase()} song in the original key, because of the barre chords. With a capo on the ${ORDINAL[capo.fret]} fret, ${capo.open} of the ${chords.length} chords become open shapes, and it gets a lot easier.`
        : `It's a ${song.level.toLowerCase()} song. Learn the chord changes slowly first, then add the strumming.`,
    },
  ];
}

type Cell = { label: string; aria: string; kind: "strong" | "light" | "rest" };

/** A strum as a cell. In 6/8 the 1 and the 4 lead, the rest stay light. */
function strumCell(strum: Strum, index: number, meter: Meter): Cell {
  if (strum === "-") return { label: "·", aria: "Miss", kind: "rest" };
  const leads = meter === "6/8" ? METERS["6/8"].groups.includes(index) : strum === "D";
  return { label: strum === "D" ? "↓" : "↑", aria: strum === "D" ? "Down" : "Up", kind: leads ? "strong" : "light" };
}

/** One bar of rhythm, a cell per eighth note, counted the way the meter counts. */
function RhythmGrid({ cells, meter }: { cells: Cell[]; meter: Meter }) {
  const count = (i: number) => (meter === "6/8" ? String(i + 1) : i % 2 === 0 ? String(i / 2 + 1) : "and");
  return (
    <ol className={`mt-3 grid max-w-md gap-1.5 ${meter === "6/8" ? "grid-cols-6" : "grid-cols-8"}`}>
      {cells.map((cell, i) => (
        <li key={i} className="text-center">
          <span
            aria-label={cell.aria}
            className={`grid h-11 place-items-center rounded-xl text-sm font-semibold ${
              cell.kind === "strong"
                ? "bg-brand-600 text-white"
                : cell.kind === "light"
                  ? "bg-brand-500/12 text-brand-700"
                  : "border border-dashed border-line text-faint"
            }`}
          >
            {cell.label}
          </span>
          <span className="mt-1 block text-xs text-faint">{count(i)}</span>
        </li>
      ))}
    </ol>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/guitar/songs/[slug]">): Promise<Metadata> {
  const song = getSong((await params).slug);
  if (!song) return {};
  const chords = chordsIn(song);
  const title = `${song.title} Chords: ${song.artist}`;
  const description = `Play ${song.title} by ${song.artist} on guitar: ${chords.length} chords with diagrams, how to strum it, and a play-along through the whole song, bar by bar.${
    bestCapo(song) ? " Plus an easier capo version." : ""
  }`;
  const url = `/knowledge/guitar/songs/${song.slug}`;
  return {
    title: `${title} | Trenodo`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Trenodo", type: "article" },
  };
}

export default async function SongPage({ params }: PageProps<"/knowledge/guitar/songs/[slug]">) {
  const song = getSong((await params).slug);
  if (!song) notFound();

  const chords = chordsIn(song);
  const capo = bestCapo(song);
  const meter: Meter = song.meter ?? "4/4";
  const chart = (symbol: string): ChartChord => ({ symbol, diagram: diagramFor(symbol) });
  const original = chords.map(chart);
  const capoChords = capo ? chords.map((chord) => chart(shiftChord(chord, capo.fret))) : null;
  const faqs = faqsFor(song, chords, capo);
  const searchTerm = encodeURIComponent(`${song.title} ${song.artist}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicComposition",
        name: song.title,
        ...(traditional(song) ? {} : { composer: song.writers.map((name) => ({ "@type": "Person", name })) }),
        musicalKey: song.key,
        recordedAs: {
          "@type": "MusicRecording",
          name: song.title,
          byArtist: { "@type": "Person", name: song.artist },
          datePublished: String(song.year),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  const pill = "rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted";
  const listen = `inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:text-brand-700 ${focusable}`;

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
        title={`${song.title} Chords`}
        intro={song.intro}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{song.artist}</span> · {song.year} ·{" "}
            {traditional(song) ? "Traditional" : `Written by ${WRITERS.format(song.writers)}`}
          </p>
          <ul className="flex flex-wrap gap-2">
            <li className={pill}>Key: {song.key}</li>
            {song.meter && song.meter !== "4/4" && <li className={pill}>{song.meter}</li>}
            <li className={pill}>{song.feel}</li>
            <li className={pill}>{chords.length} chords</li>
            <li className={pill}>{song.level}</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://open.spotify.com/search/${searchTerm}`}
              target="_blank"
              rel="noopener"
              className={listen}
            >
              ▶ Listen on Spotify
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${searchTerm}`}
              target="_blank"
              rel="noopener"
              className={listen}
            >
              ▶ Watch on YouTube
            </a>
          </div>
        </div>

        <SongChart
          songKey={song.key}
          bpm={song.bpm}
          meter={song.meter}
          sections={song.sections}
          original={original}
          capo={capo && capoChords ? { fret: capo.fret, chords: capoChords } : null}
        />

        <section aria-labelledby="strum-heading">
          <h2 id="strum-heading" className="text-2xl font-semibold tracking-tight">
            {song.strumming.picking ? "How to play it" : "How to strum it"}
          </h2>
          {song.strumming.pattern && (
            <div className="mt-4">
              {song.strumming.picking && <h3 className="text-sm font-semibold text-foreground">Strum</h3>}
              <RhythmGrid meter={meter} cells={song.strumming.pattern.map((strum, i) => strumCell(strum, i, meter))} />
            </div>
          )}
          {song.strumming.picking && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Or pick it</h3>
              <RhythmGrid
                meter={meter}
                cells={song.strumming.picking.map((step) => ({
                  label: step,
                  aria: step === "Bass" ? "Bass note" : `String ${step}`,
                  kind: step === "Bass" ? "strong" : "light",
                }))}
              />
              <p className="mt-3 text-sm text-muted">
                Strings count from the thinnest: 1 is the high E. Bass is the chord&rsquo;s lowest note.
              </p>
            </div>
          )}
          <p className="mt-4 text-base text-muted">{song.strumming.tip}</p>
        </section>

        <section className="border-t border-line pt-8">
          <p className="text-sm text-muted">
            Want more?{" "}
            <Link href="/knowledge/guitar/songs" className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}>
              All songs with chords
            </Link>{" "}
            or{" "}
            <Link href="/knowledge/guitar/chords" className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}>
              learn more chords
            </Link>
            .
          </p>
        </section>

        <GuideFaq items={faqs} />
      </GuideLayout>
    </>
  );
}
