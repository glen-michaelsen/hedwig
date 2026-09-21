import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Guides for the whole musician's journey — learning an instrument, recording, performing, promoting and teaching.";

export const metadata: Metadata = {
  title: "Knowledge — Guides for Musicians — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/knowledge",
  },
  openGraph: {
    title: "Knowledge — Guides for Musicians",
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
    body: "Your first chord through your first song, plus a chord, scale and tuning reference.",
  },
  {
    href: "/knowledge/piano",
    title: "Piano",
    body: "Keyboard layout and every major and minor chord — a companion to piano lessons.",
  },
  {
    href: "/knowledge/drums",
    title: "Drums",
    body: "Kit anatomy, stick technique and the rhythms every drummer starts with.",
  },
  {
    href: "/knowledge/bass",
    title: "Bass",
    body: "Get to know the instrument, then build up your scales and technique.",
  },
  {
    href: "/knowledge/vocals",
    title: "Vocals",
    body: "Breath support, vocal registers and effects once the basics are solid.",
  },
  {
    href: "/knowledge/theory",
    title: "Music Theory",
    body: "The shared vocabulary every instrument draws on — scales, notation, the circle of fifths.",
  },
] as const;

const JOURNEY = [
  {
    href: "/knowledge/record",
    title: "Recording",
    body: "Setting up a home studio, choosing software, and getting a take you're happy to send.",
  },
  {
    href: "/knowledge/perform",
    title: "Performing",
    body: "From busking to pricing a gig — everything between writing a song and playing it live.",
  },
  {
    href: "/knowledge/promote",
    title: "Promoting Your Music",
    body: "Releasing to streaming, building a press kit, and getting your music in front of people.",
  },
  {
    href: "/knowledge/teach",
    title: "Teaching Music",
    body: "Taking your playing online and turning it into lessons other musicians can book.",
  },
] as const;

function Card({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="block rounded-4xl border border-line bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        {body}
      </p>
    </Link>
  );
}

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
                <Card key={item.href} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              The rest of the journey
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {JOURNEY.map((item) => (
                <Card key={item.href} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
