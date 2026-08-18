import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  button,
  focusable,
} from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { listSpotlights } from "@/lib/dal/spotlight";

export default async function AdminSpotlightPage() {
  await requireAdmin();
  const articles = await listSpotlights();
  const live = articles.filter((article) => article.published).length;

  return (
    <>
      <PageHeader
        title="Spotlight"
        subtitle={
          articles.length === 0
            ? "Editorial posts about releases, built from their press kits."
            : `${articles.length} article${articles.length === 1 ? "" : "s"}, ${live} published.`
        }
        action={
          <Link className={button} href="/account/spotlight/new">
            Write one
          </Link>
        }
      />

      {articles.length === 0 ? (
        <Empty>Nothing written yet. Pick a release and start.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/account/spotlight/${article.id}`}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted ${focusable}`}
                >
                  {article.coverAssetId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/spotlight/image/${article.coverAssetId}?size=sm`}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-dashed border-line text-[10px] text-faint">
                      No art
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {article.headline}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {article.artistName} — {article.releaseTitle}
                    </p>
                    <span className="mt-1.5 inline-flex">
                      <Hearts rating={article.rating} className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                      article.published
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-surface-muted text-muted"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
