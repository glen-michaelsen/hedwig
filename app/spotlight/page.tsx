import type { Metadata } from "next";
import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";
import { getLiveDiscoverPages } from "@/lib/discover";
import { SpotlightCard } from "./_components/spotlight-card";

const PAGE_DESCRIPTION =
  "New music, one release at a time. No algorithm. Just one musician telling another musician's story.";

export const metadata: Metadata = {
  title: "Spotlight | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/spotlight",
  },
  openGraph: {
    title: "Spotlight | Trenodo",
    description: PAGE_DESCRIPTION,
    url: "/spotlight",
    siteName: "Trenodo",
    type: "website",
  },
};

// Reads the database and there's no cache in front of this Worker, so a
// prerendered copy would freeze on whatever was published at build time.
export const dynamic = "force-dynamic";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export default async function SpotlightIndexPage() {
  const [articles, discover] = await Promise.all([
    listPublishedSpotlights(),
    getLiveDiscoverPages(),
  ]);
  const [lead, ...rest] = articles;
  // The biggest pages make the best doorways; the rest are one click on.
  const browse = [...discover].sort((a, b) => b.ids.length - a.ids.length).slice(0, 8);

  // Lists what's actually published, generated fresh from the same query
  // the page renders from — nothing hand-written to fall out of step with
  // the real list.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Trenodo Spotlight",
    url: "https://trenodo.com/spotlight",
    description: PAGE_DESCRIPTION,
    blogPost: articles.map((article) => ({
      "@type": "Review",
      headline: article.headline,
      url: `https://trenodo.com/spotlight/${article.slug}`,
      datePublished: (article.publishedAt ?? article.createdAt).toISOString(),
      itemReviewed: {
        "@type": "MusicRelease",
        name: article.releaseTitle,
        byArtist: { "@type": "MusicGroup", name: article.artistName },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from live, already-published article data — never raw user
        // input reaching this template directly — so this is safe without
        // further escaping.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1 pb-20">
        <div className={`${container} pt-14 sm:pt-20`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Spotlight
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            New music, one release at a time.
          </h1>
          <p className="mt-4 text-sm text-muted">
            Want your music here?{" "}
            <Link
              href="/spotlight/get-featured"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              See how to get featured →
            </Link>
          </p>
        </div>

        {browse.length > 0 && (
          <nav aria-label="Browse Spotlight" className={`${container} mt-8`}>
            <ul className="flex flex-wrap gap-2">
              {browse.map((status) => (
                <li key={status.page.slug}>
                  <Link
                    href={`/discover/${status.page.slug}`}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-line-strong ${focusable}`}
                  >
                    {status.page.label}
                    <span className="tabular-nums text-faint">{status.ids.length}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/discover"
                  className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-medium text-brand-600 hover:underline ${focusable}`}
                >
                  Browse all →
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {articles.length === 0 ? (
          <div className={`${container} mt-14`}>
            <p className="rounded-4xl border border-dashed border-line px-6 py-20 text-center text-sm text-muted">
              The first piece is being written.
            </p>
          </div>
        ) : (
          <div className="mt-8 sm:mt-16">
            {/* The newest piece bleeds to the screen edges on mobile —
                a magazine cover, not another card in a list — then settles
                into the container and gains rounded corners from sm up. */}
            <div className="mx-auto w-full sm:max-w-5xl sm:px-8">
              <Link
                href={`/spotlight/${lead.slug}`}
                className={`group relative block overflow-hidden sm:rounded-[2rem] sm:shadow-lift ${focusable}`}
              >
                <div className="relative aspect-[4/5] w-full bg-surface-muted sm:aspect-[21/9]">
                  {(lead.headerAssetId ?? lead.coverAssetId) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/spotlight/image/${lead.headerAssetId ?? lead.coverAssetId}?size=lg`}
                      alt=""
                      style={{
                        objectPosition: lead.headerAssetId
                          ? `${lead.headerFocusX}% ${lead.headerFocusY}%`
                          : "50% 50%",
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                  <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:left-10 sm:top-10">
                    Latest
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/75">
                      {lead.artistName} · {KIND_LABELS[lead.releaseKind]}
                    </p>
                    <h2 className="mt-2 max-w-3xl text-3xl font-semibold text-white text-balance sm:text-4xl">
                      {lead.headline}
                    </h2>
                    <span className="mt-4 inline-flex">
                      <Hearts rating={lead.rating} className="h-4 w-4" tone="light" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {rest.length > 0 && (
              <div className={`${container} mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3`}>
                {rest.map((article) => (
                  <SpotlightCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
