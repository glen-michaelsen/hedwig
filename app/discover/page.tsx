import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { getDiscover, getLiveDiscoverPages } from "@/lib/discover";
import type { DiscoverGroup } from "@/lib/discover/pages";
import { DiscoverBlock } from "./_components/discover-block";

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

const GROUPS: { group: DiscoverGroup; heading: string }[] = [
  { group: "Singers", heading: "By who sings" },
  { group: "Countries", heading: "By where they're from" },
  { group: "Genres", heading: "By genre" },
  { group: "Moods", heading: "By mood" },
  { group: "Mixes", heading: "Narrower picks" },
];

export default async function DiscoverIndexPage() {
  const [live, { articles }] = await Promise.all([getLiveDiscoverPages(), getDiscover()]);

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
            <div className="mt-14 space-y-14">
              {GROUPS.map(({ group, heading }) => {
                const pages = live
                  .filter((status) => status.page.group === group)
                  .sort((a, b) => b.ids.length - a.ids.length);
                if (pages.length === 0) return null;
                return (
                  <section key={group}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                      {heading}
                    </h2>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {pages.map((status) => {
                        const rows = status.ids.flatMap((id) => articles.get(id) ?? []);
                        return (
                          <DiscoverBlock
                            key={status.page.slug}
                            href={`/discover/${status.page.slug}`}
                            title={status.page.title}
                            count={rows.length}
                            averageRating={
                              rows.reduce((sum, row) => sum + row.rating, 0) / Math.max(rows.length, 1)
                            }
                            covers={rows
                              .flatMap((row) => (row.coverAssetId ? [row.coverAssetId] : []))
                              .slice(0, 3)
                              .map((id) => `/spotlight/image/${id}?size=md`)}
                          />
                        );
                      })}
                    </div>
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
