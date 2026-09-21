import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "A companion to piano lessons, not a replacement for them — the keyboard layout, and every major and minor chord with a diagram.";

export const metadata: Metadata = {
  title: "Learn Piano: Keyboard Layout and Chords — Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/piano" },
  openGraph: {
    title: "Learn Piano: Keyboard Layout and Chords",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/piano",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/piano/anatomy",
    title: "Piano Keyboard Layout",
    body: "White keys, black keys, and how to find any note without counting from the end.",
  },
  {
    href: "/knowledge/piano/chords",
    title: "Chords",
    body: "All 12 major and minor chords, with a diagram for each.",
  },
] as const;

export default function PianoKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Learn an instrument
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Piano
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

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
