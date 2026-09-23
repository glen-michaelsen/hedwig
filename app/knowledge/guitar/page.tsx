import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Learn guitar from scratch. A five step path for beginners, plus guides to chords, scales, tuning, tabs, transposing and changing strings.";

export const metadata: Metadata = {
  title: "Learn Guitar: Guides for Beginners | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar" },
  openGraph: {
    title: "Learn Guitar: Guides for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/guitar/chords",
    title: "Chords",
    body: "Open chords, barre chords, and how to read a chord diagram.",
  },
  {
    href: "/knowledge/guitar/scales",
    title: "Scales",
    body: "Major, minor and the two pentatonic scales.",
  },
  {
    href: "/knowledge/guitar/tuning",
    title: "Tuning",
    body: "Standard tuning, the string names, and a tuner you can use right here.",
  },
  {
    href: "/knowledge/guitar/reading-tabs",
    title: "Reading Tabs",
    body: "What the six lines, the numbers and the symbols in a tab mean.",
  },
  {
    href: "/knowledge/guitar/transposing",
    title: "Transposing",
    body: "Move a song to a new key. With a capo, or without.",
  },
  {
    href: "/knowledge/guitar/changing-strings",
    title: "Changing Strings",
    body: "Step by step, for acoustic, classical and electric guitars.",
  },
  {
    href: "/knowledge/guitar/anatomy",
    title: "Guitar Anatomy",
    body: "Every part of the guitar, and what it actually does.",
  },
] as const;

export default function GuitarKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Learn an instrument
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Guitar
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} Don&rsquo;t fret, everyone starts somewhere. 🎸
          </p>

          <section className="mt-14">
            <Link
              href="/knowledge/guitar/getting-started"
              className={`block rounded-4xl border-2 border-brand-500/40 bg-brand-500/[0.06] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8 ${focusable}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600 dark:text-brand-300">
                Start here
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                How to Learn Guitar: From Zero to Your First Song
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted text-pretty">
                Five steps, in the right order. From buying a guitar to
                playing a full song on it.
              </p>
            </Link>
          </section>

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
