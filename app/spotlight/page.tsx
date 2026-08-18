import type { Metadata } from "next";
import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";

export const metadata: Metadata = {
  title: "Spotlight — Trenodo",
  description: "New music, written up one release at a time.",
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

  return (
    <>
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
          <div className={`${container} mt-12 sm:mt-16`}>
            {/* The newest piece gets the full width — a magazine cover, not
                another card in a grid. */}
            <Link
              href={`/spotlight/${lead.slug}`}
              className={`group block overflow-hidden rounded-[2rem] ${focusable}`}
            >
              <div className="relative aspect-[16/10] w-full bg-surface-muted sm:aspect-[21/9]">
                {(lead.headerAssetId ?? lead.coverAssetId) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/spotlight/image/${lead.headerAssetId ?? lead.coverAssetId}?size=lg`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/75">
                    {lead.artistName} · {KIND_LABELS[lead.releaseKind]}
                  </p>
                  <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-white text-balance sm:text-4xl">
                    {lead.headline}
                  </h2>
                  <span className="mt-4 inline-flex text-white">
                    <Hearts rating={lead.rating} className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
