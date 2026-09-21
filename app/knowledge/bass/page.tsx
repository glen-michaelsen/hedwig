import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The bass's job in a band, the parts of the instrument, and the three scales every bassist reaches for first.";

export const metadata: Metadata = {
  title: "Learn Bass Guitar: Guides for Beginners — Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/bass" },
  openGraph: {
    title: "Learn Bass Guitar: Guides for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/bass",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/bass/anatomy",
    title: "Bass Anatomy",
    body: "Every part of the bass guitar, and what each one actually does.",
  },
  {
    href: "/knowledge/bass/scales",
    title: "Scales",
    body: "Major, minor, and minor pentatonic — the three shapes to learn first.",
  },
] as const;

export default function BassKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Learn an instrument
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Bass
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

          <section className="mt-14">
            <Link
              href="/knowledge/bass/getting-started"
              className={`block rounded-4xl border-2 border-brand-500/40 bg-brand-500/[0.06] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8 ${focusable}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600 dark:text-brand-300">
                Start here
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                What a Bassist Actually Does — And How to Start
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted text-pretty">
                The bass&rsquo;s real job in a band, and the two habits worth
                building from day one.
              </p>
            </Link>
          </section>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Reference
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
