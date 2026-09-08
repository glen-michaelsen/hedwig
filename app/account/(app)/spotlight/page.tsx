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
import { todayIso } from "@/lib/clock";
import { listSpotlights } from "@/lib/dal/spotlight";
import { computeSpotlightStatus } from "@/lib/spotlight/slug";
import { SpotlightStatusBadge } from "./_components/status-badge";

export const metadata = { title: "Spotlight" };

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default async function AdminSpotlightPage() {
  await requireAdmin("/account/spotlight");
  const [articles, today] = await Promise.all([listSpotlights(), todayIso()]);
  const live = articles.filter(
    (article) =>
      computeSpotlightStatus(article.published, article.releaseDate, today) ===
      "published",
  ).length;

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
            {articles.map((article) => {
              const status = computeSpotlightStatus(
                article.published,
                article.releaseDate,
                today,
              );
              return (
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

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <SpotlightStatusBadge status={status} />
                    <span className="text-xs text-muted">
                      {formatDate(article.releaseDate) ?? "No date"}
                    </span>
                  </div>
                </Link>
              </li>
              );
            })}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
