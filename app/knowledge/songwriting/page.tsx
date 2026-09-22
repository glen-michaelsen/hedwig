import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How to find a subject, structure a song, generate lines, rhyme well and revise a draft — the full craft of writing your own songs.";

export const metadata: Metadata = {
  title: "Learn Songwriting: Guides for Writing Your Own Songs — Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting" },
  openGraph: {
    title: "Learn Songwriting: Guides for Writing Your Own Songs",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/songwriting/anatomy-of-a-song",
    title: "Anatomy of a Song",
    body: "What a verse, chorus, bridge, intro and outro each actually do.",
  },
  {
    href: "/knowledge/songwriting/methods",
    title: "Songwriting Methods",
    body: "History to Song, improvisation, and writing straight from a metaphor.",
  },
  {
    href: "/knowledge/songwriting/metaphors",
    title: "Using Metaphors",
    body: "How to turn a plainly stated feeling into a line people remember.",
  },
  {
    href: "/knowledge/songwriting/rhyme-patterns",
    title: "Rhyme Patterns",
    body: "AABB, ABAB, ABCB, and why rhyme matters at all.",
  },
  {
    href: "/knowledge/songwriting/refining-your-lyrics",
    title: "Refining Your Lyrics",
    body: "Flow, simplicity, and how to actually revise a draft.",
  },
  {
    href: "/knowledge/songwriting/titles-and-hooks",
    title: "Titles and Hooks",
    body: "Why your title is probably already written, and where it belongs.",
  },
  {
    href: "/knowledge/songwriting/common-mistakes",
    title: "Common Songwriting Mistakes",
    body: "Forced rhymes, vague lines, and the other habits worth catching early.",
  },
] as const;

export default function SongwritingKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Write your own music
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Songwriting
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

          <section className="mt-14">
            <Link
              href="/knowledge/songwriting/finding-your-subject"
              className={`block rounded-4xl border-2 border-brand-500/40 bg-brand-500/[0.06] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8 ${focusable}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600 dark:text-brand-300">
                Start here
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                How to Find a Subject for Your Song
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted text-pretty">
                Every other decision gets easier once there&rsquo;s a real
                subject underneath the song.
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
