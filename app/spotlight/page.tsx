import type { Metadata } from "next";
import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";

const PAGE_DESCRIPTION =
  "New music, written up one release at a time — no algorithm, just one musician telling another musician's story.";

export const metadata: Metadata = {
  title: "Spotlight — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/spotlight",
  },
  openGraph: {
    title: "Spotlight — Trenodo",
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

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default async function SpotlightIndexPage() {
  const articles = await listPublishedSpotlights();
  const [lead, ...rest] = articles;

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
        </div>

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
                  <Link
                    key={article.id}
                    href={`/spotlight/${article.slug}`}
                    className={`group block ${focusable}`}
                  >
                    <div className="aspect-4/3 w-full overflow-hidden rounded-3xl bg-surface-muted">
                      {(article.headerAssetId ?? article.coverAssetId) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/spotlight/image/${article.headerAssetId ?? article.coverAssetId}?size=md`}
                          alt=""
                          style={{
                            objectPosition: article.headerAssetId
                              ? `${article.headerFocusX}% ${article.headerFocusY}%`
                              : "50% 50%",
                          }}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {article.artistName}
                    </p>
                    <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
                      {article.headline}
                    </h2>
                    <div className="mt-2.5 flex items-center gap-3">
                      <Hearts rating={article.rating} className="h-3.5 w-3.5" />
                      {formatDate(article.releaseDate) && (
                        <span className="text-xs text-faint">
                          {formatDate(article.releaseDate)}
                        </span>
                      )}
                    </div>
                  </Link>
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
