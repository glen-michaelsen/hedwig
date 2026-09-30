import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { SpotlightCard } from "@/app/spotlight/_components/spotlight-card";
import { discoverStats, getDiscover } from "@/lib/discover";
import { getDiscoverPage, type DiscoverStatus } from "@/lib/discover/pages";

// Counts change with every Spotlight, and there's no cache in front of this
// Worker, so a prerendered copy would freeze on the day it was built.
export const dynamic = "force-dynamic";

async function load(slug: string) {
  const page = getDiscoverPage(slug);
  if (!page) return null;
  const { statuses, articles } = await getDiscover();
  const status = statuses.find((item) => item.page.slug === slug);
  if (!status) return null;
  return {
    status,
    statuses,
    rows: status.ids.flatMap((id) => articles.get(id) ?? []),
  };
}

function describe(status: DiscoverStatus) {
  const count = status.ids.length;
  return `${status.page.title}: ${count} ${count === 1 ? "release" : "releases"} picked and reviewed by musicians on Trenodo Spotlight. Newest first.`;
}

export async function generateMetadata({
  params,
}: PageProps<"/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await load(slug);
  if (!loaded) return {};
  const { status } = loaded;
  const title = `${status.page.title} | Trenodo Spotlight`;

  return {
    title,
    description: describe(status),
    alternates: { canonical: `/discover/${slug}` },
    // Under the line, the page still works for anyone with the link, but
    // search engines are told to wait until there's enough on it.
    robots: status.live ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description: describe(status),
      url: `/discover/${slug}`,
      siteName: "Trenodo",
      type: "website",
    },
  };
}

export default async function DiscoverPage({ params }: PageProps<"/discover/[slug]">) {
  const { slug } = await params;
  const loaded = await load(slug);
  if (!loaded) notFound();
  const { status, statuses, rows } = loaded;
  const { page } = status;

  const ownGenres = page.words.filter((word) => word.facet === "genre").map((word) => word.key);
  const stats = discoverStats(rows, ownGenres);
  const count = rows.length;

  // Other live pages sharing a tag with this one: the broader page, the
  // sibling mixes. Never this page, never a page that isn't live.
  const keys = new Set(page.words.map((word) => `${word.facet}:${word.key}`));
  const related = statuses
    .filter(
      (item) =>
        item.live &&
        item.page.slug !== slug &&
        item.page.words.some((word) => keys.has(`${word.facet}:${word.key}`)),
    )
    .sort((a, b) => b.ids.length - a.ids.length)
    .slice(0, 6);

  const intro =
    page.intro ??
    `Every release here was picked and written up by a musician for Trenodo Spotlight. No algorithm, no playlist politics. Just good music, newest first.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url: `https://trenodo.com/discover/${slug}`,
    description: describe(status),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: count,
      itemListElement: rows.map((row, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://trenodo.com/spotlight/${row.slug}`,
        name: `${row.releaseTitle} by ${row.artistName}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from published article data and the page list in code.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1 pb-20">
        <div className={`${container} pt-14 sm:pt-20`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            <Link href="/spotlight" className={`rounded hover:underline ${focusable}`}>
              Spotlight
            </Link>
            {" · "}
            <Link href="/discover" className={`rounded hover:underline ${focusable}`}>
              Discover
            </Link>
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted text-pretty">
            {intro}
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li>
              <span className="font-semibold tabular-nums text-foreground">{count}</span>{" "}
              {count === 1 ? "release" : "releases"}
            </li>
            <li>
              Average{" "}
              <span className="font-semibold tabular-nums text-foreground">
                ♥ {stats.averageRating.toFixed(1)}
              </span>
            </li>
            {stats.topGenres.length > 0 && (
              <li>
                Mostly{" "}
                <span className="font-semibold text-foreground">
                  {stats.topGenres.join(" and ").toLowerCase()}
                </span>
              </li>
            )}
            {stats.newest && (
              <li>
                Newest{" "}
                <span className="font-semibold text-foreground">{stats.newest}</span>
              </li>
            )}
          </ul>
        </div>

        <div className={`${container} mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3`}>
          {rows.map((row) => (
            <SpotlightCard key={row.id} article={row} />
          ))}
        </div>

        {related.length > 0 && (
          <nav aria-label="More to discover" className={`${container} mt-16 border-t border-line pt-8`}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Keep digging
            </p>
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.page.slug}>
                  <Link
                    href={`/discover/${item.page.slug}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium transition-colors hover:border-line-strong ${focusable}`}
                  >
                    {item.page.label}
                    <span className="tabular-nums text-faint">{item.ids.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className={`${container} mt-12`}>
          <p className="text-sm text-muted">
            Made something that belongs here?{" "}
            <Link
              href="/spotlight/get-featured"
              className={`rounded font-medium text-brand-600 hover:underline ${focusable}`}
            >
              See how to get featured →
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
