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
  days,
}: {
  totals: Record<KitEventKind, number>;
  /** Only the days that had visits; the rest of the window is filled in here. */
  daily: { day: string; count: number }[];
  downloads: DownloadRow[];
  published: boolean;
  /** Every date in the window, oldest first, as YYYY-MM-DD. */
  days: string[];
}) {
  const counts = new Map(daily.map((entry) => [entry.day, entry.count]));
  const series = days.map((day) => {
    const [, month, dayOfMonth] = day.split("-").map(Number);
    return {
      day,
      count: counts.get(day) ?? 0,
      label: new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
      }).format(new Date(2000, month - 1, dayOfMonth)),
    };
  });

  const busiest = Math.max(0, ...series.map((entry) => entry.count));
  const windowTotal = series.reduce((sum, entry) => sum + entry.count, 0);
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
          {published ? "No activity yet." : "Not published yet."}
        </p>
      )}

      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Visits, last 30 days
          </p>
          <p className="text-xs text-faint tabular-nums">
            {windowTotal} in total
            {busiest > 0 && ` · busiest day ${busiest}`}
          </p>
        </div>

        {/*
          Every day in the window gets a column, including the empty ones.
          Drawing only the days that have data made a single visit fill the
          whole width, which looks like a wall of traffic and says nothing
          about when it happened — the common case early on is one or two
          days with anything in them at all.
        */}
        <div className="mt-3 flex h-24 items-end gap-[3px]">
          {series.map((entry) => {
            const height = busiest > 0 ? (entry.count / busiest) * 100 : 0;
            return (
              <div
                key={entry.day}
                className="group relative flex h-full flex-1 items-end"
                title={`${entry.label}: ${entry.count} ${entry.count === 1 ? "visit" : "visits"}`}
              >
                {/* A day with nothing still shows a hairline, so the axis
                    reads as a month rather than as blank space. */}
                <div
                  className={`w-full rounded-t transition-colors ${
                    entry.count > 0
                      ? "bg-brand-500 group-hover:bg-brand-600"
                      : "bg-line group-hover:bg-line-strong"
                  }`}
                  style={{
                    height: entry.count > 0 ? `max(6px, ${height}%)` : "3px",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-faint">
          <span>{series[0]?.label}</span>
          <span>Today</span>
        </div>
      </div>

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
