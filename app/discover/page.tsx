import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { getLiveDiscoverPages } from "@/lib/discover";
import type { DiscoverGroup } from "@/lib/discover/pages";

const PAGE_DESCRIPTION =
  "Browse Trenodo Spotlight by singer, country, genre and mood. Every release picked and reviewed by a musician.";

export const metadata: Metadata = {
  title: "Discover new music | Trenodo Spotlight",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/discover" },
  openGraph: {
    title: "Discover new music | Trenodo Spotlight",
    description: PAGE_DESCRIPTION,
    url: "/discover",
    siteName: "Trenodo",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

const GROUPS: DiscoverGroup[] = ["Singers", "Countries", "Genres", "Moods", "Mixes"];

export default async function DiscoverIndexPage() {
  const live = await getLiveDiscoverPages();

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pb-20">
        <div className={`${container} pt-14 sm:pt-20`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            <Link href="/spotlight" className={`rounded hover:underline ${focusable}`}>
              Spotlight
            </Link>
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Discover new music
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted text-pretty">
            Every Spotlight, sorted by who sings, where they&rsquo;re from, and how it
            sounds. New lists open up as the Spotlight grows. Dig in 🎧
          </p>

          {live.length === 0 ? (
            <p className="mt-12 rounded-4xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
              The first lists are filling up.{" "}
              <Link href="/spotlight" className={`rounded font-medium text-brand-600 hover:underline ${focusable}`}>
                Read the Spotlight →
              </Link>
            </p>
          ) : (
            <div className="mt-12 space-y-10">
              {GROUPS.map((group) => {
                const pages = live
                  .filter((status) => status.page.group === group)
                  .sort((a, b) => b.ids.length - a.ids.length);
                if (pages.length === 0) return null;
                return (
                  <section key={group}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                      {group}
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {pages.map((status) => (
                        <li key={status.page.slug}>
                          <Link
                            href={`/discover/${status.page.slug}`}
                            className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium shadow-soft transition-colors hover:border-line-strong ${focusable}`}
                          >
                            {status.page.title}
                            <span className="tabular-nums text-faint">{status.ids.length}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
