import { Card } from "@/app/_components/ui";
import type { DownloadRow, KitEventKind } from "@/lib/dal/kit-stats";

const LABELS: Record<KitEventKind, string> = {
  view: "Visits",
  play: "Plays",
  download: "Downloads",
  photo: "Photos opened",
  link: "Listen clicks",
};

const ORDER: KitEventKind[] = ["view", "play", "download", "photo", "link"];

/**
 * What press did with the kit. Counters are daily totals, so these are
 * complete for the whole life of the link rather than a sampled window.
 */
export function KitStatsPanel({
  totals,
  daily,
  downloads,
  published,
}: {
  totals: Record<KitEventKind, number>;
  daily: { day: string; count: number }[];
  downloads: DownloadRow[];
  published: boolean;
}) {
  const busiest = Math.max(1, ...daily.map((entry) => entry.count));
  const nothingYet = ORDER.every((kind) => totals[kind] === 0);

  return (
    <Card>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {ORDER.map((kind) => (
          <div key={kind}>
            <p className="text-2xl font-semibold tabular-nums">
              {totals[kind]}
            </p>
            <p className="mt-0.5 text-xs text-muted">{LABELS[kind]}</p>
          </div>
        ))}
      </div>

      {nothingYet && (
        <p className="mt-5 text-sm text-muted">
          {published
            ? "Nothing yet — numbers appear once someone opens the link."
            : "This kit isn't published, so there's nothing to count."}
        </p>
      )}

      {daily.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Visits, last 30 days
          </p>
          <div className="mt-3 flex h-20 items-end gap-1">
            {daily.map((entry) => (
              <div
                key={entry.day}
                title={`${entry.day}: ${entry.count}`}
                className="min-w-1 flex-1 rounded-t bg-brand-500/70"
                style={{ height: `${(entry.count / busiest) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {downloads.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Most downloaded
          </p>
          <ul className="mt-3">
            {downloads.map((row) => (
              <li
                key={row.assetId}
                className="flex items-center justify-between gap-4 border-b border-line py-2 last:border-b-0"
              >
                <span className="min-w-0 truncate text-sm">{row.filename}</span>
                <span className="shrink-0 text-sm tabular-nums text-muted">
                  {row.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
