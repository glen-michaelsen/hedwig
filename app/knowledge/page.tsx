import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { PhotoCard } from "./_components/photo-card";

const PAGE_DESCRIPTION =
  "Guides for your whole journey as a musician. Learn an instrument, write your own songs, record them, play them live and teach others.";

export const metadata: Metadata = {
  title: "Knowledge: Guides for Musicians | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: {
    title: "Knowledge: Guides for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/knowledge",
    siteName: "Trenodo",
    type: "website",
  },
};

const INSTRUMENTS = [
  {
    href: "/knowledge/guitar",
    title: "Guitar",
    body: "From your first chord to your first song. Plus chords, scales and a tuner.",
    image: "/images/knowledge/instruments/guitar.jpg",
  },
  {
    href: "/knowledge/piano",
    title: "Piano",
    body: "How the keyboard works, and every major and minor chord with a diagram.",
    image: "/images/knowledge/instruments/piano.jpg",
  },
  {
    href: "/knowledge/drums",
    title: "Drums",
    body: "What a drummer does, and every part of the drum kit explained.",
    image: "/images/knowledge/instruments/drum.jpg",
  },
  {
    href: "/knowledge/bass",
    title: "Bass",
    body: "Get to know the instrument. Then build your scales and your groove.",
    image: "/images/knowledge/instruments/bass.jpg",
  },
  {
    href: "/knowledge/vocals",
    title: "Vocals",
    body: "Breath support, vocal registers and the effects singers love to use.",
    image: "/images/knowledge/instruments/vocal.jpg",
  },
  {
    href: "/knowledge/theory",
    title: "Music Theory",
    body: "The language all instruments share. Scales, chords and the circle of fifths.",
    image: "/images/knowledge/instruments/theory.jpg",
  },
] as const;

const JOURNEY = [
  {
    href: "/knowledge/songwriting",
    title: "Songwriting",
    body: "Find your subject, build the song and turn a rough draft into a finished lyric.",
    image: "/images/knowledge/journey/songwriting.jpg",
  },
  {
    href: "/knowledge/record",
    title: "Recording",
    body: "Set up a home studio, pick your software and get a take you are proud of.",
    image: "/images/knowledge/journey/recording.jpg",
  },
  {
    href: "/knowledge/perform",
    title: "Performing",
    body: "From busking to your first paid gig. Everything about playing live.",
    image: "/images/knowledge/journey/performing.jpg",
  },
  {
    href: "/knowledge/promote",
    title: "Promoting Your Music",
    body: "Release your music, build a press kit and get heard by the right people.",
    image: "/images/knowledge/journey/promoting.jpg",
  },
  {
    href: "/knowledge/teach",
    title: "Teaching Music",
    body: "Share what you know. Turn your playing into lessons other musicians can book.",
    image: "/images/knowledge/journey/teaching.jpg",
  },
] as const;

export default function KnowledgeIndexPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Knowledge
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Everything a musician needs to know.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Learn an instrument
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INSTRUMENTS.map((item) => (
                <PhotoCard key={item.href} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              The rest of the journey
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {JOURNEY.map((item) => (
                <PhotoCard key={item.href} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
