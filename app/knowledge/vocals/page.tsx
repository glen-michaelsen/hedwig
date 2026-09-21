import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Breath support, the four vocal registers, and the effects singers reach for once the basics are solid.";

export const metadata: Metadata = {
  title: "Learn Singing: Guides for Beginners — Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals" },
  openGraph: {
    title: "Learn Singing: Guides for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/vocals/breath-support",
    title: "Breath Support",
    body: "The abdominal engagement behind a strong, strain-free voice.",
  },
  {
    href: "/knowledge/vocals/vocal-registers",
    title: "Vocal Registers",
    body: "Neutral, curbing, overdrive and belting — four tools, not four styles.",
  },
  {
    href: "/knowledge/vocals/vocal-effects",
    title: "Vocal Effects",
    body: "Vibrato, distortion, air and growl — what each one does to a sound.",
  },
] as const;

export default function VocalsKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Learn an instrument
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Vocals
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION}
          </p>

          <section className="mt-14">
            <Link
              href="/knowledge/vocals/getting-started"
              className={`block rounded-4xl border-2 border-brand-500/40 bg-brand-500/[0.06] p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8 ${focusable}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600 dark:text-brand-300">
                Start here
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Getting Started with Singing
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted text-pretty">
                Your voice is the instrument — how to get comfortable with it
                before anything else.
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
