import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import { focusable } from "@/app/_components/ui";
import type { SpotlightRow } from "@/lib/dal/spotlight";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export function MoreSpotlights({ articles }: { articles: SpotlightRow[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-16 border-t border-line pt-8">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        More from Spotlight
      </p>
      <div className="grid gap-8 sm:grid-cols-3">
        {articles.map((article) => (
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
              {article.artistName} · {KIND_LABELS[article.releaseKind]}
            </p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
              {article.headline}
            </h2>
            <span className="mt-2.5 inline-flex">
              <Hearts rating={article.rating} className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
