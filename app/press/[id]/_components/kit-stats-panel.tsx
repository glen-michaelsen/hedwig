import { Card } from "@/app/_components/ui";
import { StatTiles } from "./stat-tiles";
import { displayName } from "@/lib/press/naming";
import type { DailyRow, KitEventKind, TopAssetRow } from "@/lib/dal/kit-stats";


/** The three series on the chart, in stacking order. */
const SERIES: { kind: KitEventKind; label: string; bar: string; dot: string }[] =
  [
    { kind: "view", label: "Visits", bar: "bg-brand-600", dot: "bg-brand-600" },
    { kind: "play", label: "Plays", bar: "bg-brand-400", dot: "bg-brand-400" },
    {
      kind: "download",
      label: "Downloads",
      bar: "bg-brand-200",
      dot: "bg-brand-200",
    },
  ];

/**
 * What press did with the kit. Counters are daily totals, so these cover the
 * whole life of the link rather than a sampled window.
 */
export function KitStatsPanel({
  totals,
  daily,
  days,
  downloads,
  plays,
  published,
}: {
  totals: Record<KitEventKind, number>;
  /** Only the days that saw something; the rest of the window is filled here. */
  daily: DailyRow[];
  /** Every date in the window, oldest first, as YYYY-MM-DD. */
  days: string[];
  downloads: TopAssetRow[];
  plays: TopAssetRow[];
  published: boolean;
}) {
  const byDay = new Map<string, Partial<Record<KitEventKind, number>>>();
  for (const row of daily) {
    const entry = byDay.get(row.day) ?? {};
    entry[row.kind] = row.count;
    byDay.set(row.day, entry);
  }

  const series = days.map((day) => {
    const counts = byDay.get(day) ?? {};
    const parts = SERIES.map((entry) => ({
      ...entry,
      count: counts[entry.kind] ?? 0,
    }));
    return {
      day,
      parts,
      total: parts.reduce((sum, part) => sum + part.count, 0),
      label: new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
      }).format(
        new Date(
          Number(day.slice(0, 4)),
          Number(day.slice(5, 7)) - 1,
          Number(day.slice(8, 10)),
        ),
      ),
    };
  });

  const busiest = Math.max(1, ...series.map((entry) => entry.total));
  const nothingYet = (["view", "play", "download", "link"] as const).every(
    (kind) => totals[kind] === 0,
  );

  return (
    <Card>
      <StatTiles
        totals={totals}
        lists={{
          play: plays.map((row) => ({ id: row.assetId, name: displayName(row), total: row.total })),
          download: downloads.map((row) => ({
            id: row.assetId,
            name: displayName(row),
            total: row.total,
          })),
        }}
      />

      {nothingYet && (
        <p className="mt-5 text-sm text-muted">
          {published ? "No activity yet." : "Not published yet."}
        </p>
      )}

      {/* Bled past the card's padding so the rules meet its edges and the
          chart reads as a band rather than another block in a stack. */}
      <div className="-mx-7 -mb-7 mt-8 border-t border-line px-7 pt-7 pb-7 sm:-mx-8 sm:-mb-8 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Last 30 days
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {SERIES.map((entry) => (
              <span
                key={entry.kind}
                className="flex items-center gap-1.5 text-xs text-muted"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${entry.dot}`} />
                {entry.label}
              </span>
            ))}
          </div>
        </div>

        {/*
          Every day in the window gets a column, including the empty ones.
          Drawing only the days that saw something made a single visit fill
          the whole width, which looks like a wall of traffic and says
          nothing about when it happened.

          The three series stack rather than sitting side by side: at thirty
          days, three bars per day are two pixels each and unreadable, while
          a stack answers "how busy was that day, and with what".
        */}
        <div className="mt-4 flex h-28 items-end gap-[3px]">
          {series.map((entry) => (
            <div
              key={entry.day}
              className="group flex h-full flex-1 flex-col justify-end"
              title={
                entry.total === 0
                  ? `${entry.label}: nothing`
                  : `${entry.label}: ${entry.parts
                      .filter((part) => part.count > 0)
                      .map((part) => `${part.count} ${part.label.toLowerCase()}`)
                      .join(", ")}`
              }
            >
              {entry.total === 0 ? (
                // A quiet day still shows a hairline, so the row reads as a
                // month rather than as blank space.
                <div className="h-[3px] w-full rounded-full bg-line transition-colors group-hover:bg-line-strong" />
              ) : (
                entry.parts
                  .filter((part) => part.count > 0)
                  .map((part, index, visible) => (
                    <div
                      key={part.kind}
                      className={`w-full ${part.bar} ${
                        index === 0 ? "rounded-t" : ""
                      } ${index === visible.length - 1 ? "rounded-b-[2px]" : ""}`}
                      style={{
                        height: `max(5px, ${(part.count / busiest) * 100}%)`,
                      }}
                    />
                  ))
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-faint">
          <span>{series[0]?.label}</span>
          <span>Today</span>
        </div>
      </div>

    </Card>
  );
}
