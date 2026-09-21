import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The shared vocabulary every instrument draws on — scales, the circle of fifths, chord notation, concert pitch and overtones.";

export const metadata: Metadata = {
  title: "Music Theory Guides for Musicians — Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory" },
  openGraph: {
    title: "Music Theory Guides for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/theory/scales-and-notes",
    title: "Scales and Notes",
    body: "The chromatic scale, sharps and flats, and why some notes have two names.",
  },
  {
    href: "/knowledge/theory/circle-of-fifths",
    title: "The Circle of Fifths",
    body: "Tonic, dominant and subdominant — how chords relate to a key.",
  },
  {
    href: "/knowledge/theory/chord-notation",
    title: "Chord Notation",
    body: "How letter symbols like Cm7 and Dsus4 actually work.",
  },
  {
    href: "/knowledge/theory/concert-pitch",
    title: "Concert Pitch",
    body: "Why A is tuned to 440 Hz, and what it means to play “in tune” with others.",
  },
  {
    href: "/knowledge/theory/overtones",
    title: "Overtones",
    body: "Why a single note sounds full, and how to isolate one as a harmonic.",
  },
] as const;

export default function TheoryKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            The shared language
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Music Theory
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Reference
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REFERENCE.map((item) => (
                <GuideCard key={item.href} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
