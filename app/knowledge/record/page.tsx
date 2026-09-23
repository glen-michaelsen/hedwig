import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Set up a home studio that sounds right, and choose your recording software without getting lost in all the options.";

export const metadata: Metadata = {
  title: "Home Recording Guides: Studio Setup and Software | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/record" },
  openGraph: {
    title: "Home Recording Guides: Studio Setup and Software",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/record",
    siteName: "Trenodo",
    type: "website",
  },
};

const REFERENCE = [
  {
    href: "/knowledge/record/studio-setup",
    title: "Studio Setup",
    body: "Where to put your desk and your speakers, and where to treat the room.",
  },
  {
    href: "/knowledge/record/choosing-software",
    title: "Choosing Recording Software",
    body: "Logic, Cubase, Studio One, Pro Tools and more. How to pick the right one.",
  },
] as const;

export default function RecordKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Capture the sound
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Recording
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} No record breaking budget needed. 🎧
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
