import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { bestCapo, chordsIn } from "@/lib/songs/chords";
import { SONGS } from "@/lib/songs/songs";

const PAGE_DESCRIPTION =
  "Songs to play on guitar, chord by chord: diagrams, strumming, the whole song bar by bar, and an easier capo version.";

export const metadata: Metadata = {
  title: "Guitar Songs with Chords | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/songs" },
  openGraph: {
    title: "Guitar Songs with Chords",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/songs",
    siteName: "Trenodo",
    type: "website",
  },
};

export default function GuitarSongsPage() {
  const songs = [...SONGS].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-faint">
            <Link href="/knowledge" className={`rounded transition-colors hover:text-foreground ${focusable}`}>
              Knowledge
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/knowledge/guitar" className={`rounded transition-colors hover:text-foreground ${focusable}`}>
              Guitar
            </Link>
          </nav>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Songs with Chords
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} Pick one, and play along with the record. 🎸
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {songs.map((song) => {
              const chords = chordsIn(song);
              const capo = bestCapo(song);
              return (
                <li key={song.slug}>
                  <Link
                    href={`/knowledge/guitar/songs/${song.slug}`}
                    className={`group flex h-full flex-col rounded-4xl border border-line bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-line-strong hover:shadow-lift ${focusable}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {song.artist} · {song.year}
                    </p>
                    <h2 className="mt-1.5 text-lg font-semibold tracking-tight transition-colors group-hover:text-brand-700">
                      {song.title}
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Chords">
                      {chords.map((chord) => (
                        <li
                          key={chord}
                          className="rounded-lg bg-brand-500/10 px-2 py-0.5 text-xs font-semibold text-brand-700"
                        >
                          {chord}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-auto pt-5 text-xs text-faint">
                      {song.level} · Key of {song.key}
                      {capo && ` · Easier with capo ${capo.fret}`}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
