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
    image: "/images/knowledge/instruments/guitar.jpg",
  },
  {
    href: "/knowledge/piano",
    title: "Piano",
    body: "Keyboard layout and every major and minor chord — a companion to piano lessons.",
    image: "/images/knowledge/instruments/piano.jpg",
  },
  {
    href: "/knowledge/drums",
    title: "Drums",
    body: "Kit anatomy, stick technique and the rhythms every drummer starts with.",
    image: "/images/knowledge/instruments/drum.jpg",
  },
  {
    href: "/knowledge/bass",
    title: "Bass",
    body: "Get to know the instrument, then build up your scales and technique.",
    image: "/images/knowledge/instruments/bass.jpg",
  },
  {
    href: "/knowledge/vocals",
    title: "Vocals",
    body: "Breath support, vocal registers and effects once the basics are solid.",
    image: "/images/knowledge/instruments/vocal.jpg",
  },
  {
    href: "/knowledge/theory",
    title: "Music Theory",
    body: "The shared vocabulary every instrument draws on — scales, notation, the circle of fifths.",
    image: "/images/knowledge/instruments/theory.jpg",
  },
] as const;

const JOURNEY = [
  {
    href: "/knowledge/songwriting",
    title: "Songwriting",
    body: "Finding a subject, structuring a song, and turning a draft into a finished lyric.",
  },
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

/**
 * A photo-backed instrument card — the photo desaturated and tinted in
 * brand purple (a duotone) rather than shown raw, so a stock-feeling photo
 * reads as part of Trenodo's own palette instead of a generic product
 * shot. `alt=""`: the photo is decorative here, the title already names
 * the instrument.
 */
function PhotoCard({
  href,
  title,
  body,
  image,
}: {
  href: string;
  title: string;
  body: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-4xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="aspect-4/3 w-full object-cover grayscale contrast-[1.08] brightness-95 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/60 to-brand-900/85 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-lg font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/85 text-pretty">
          {body}
        </p>
      </div>
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
