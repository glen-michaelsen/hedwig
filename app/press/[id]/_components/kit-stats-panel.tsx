import { Card } from "@/app/_components/ui";
import type { DailyRow, KitEventKind, TopAssetRow } from "@/lib/dal/kit-stats";


type IconProps = { className?: string };

function EyeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M1.8 10S4.7 5 10 5s8.2 5 8.2 5-2.9 5-8.2 5-8.2-5-8.2-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlayIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M7 4.8v10.4L16 10 7 4.8Z" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M3.5 15.5h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkOutIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M11 4h5v5M16 4l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12v3.5A1.5 1.5 0 0 1 13.5 17h-9A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Photo opens are recorded but not shown: knowing someone enlarged a picture
 * says nothing about whether the release travelled. Visits, plays, downloads
 * and outbound clicks are the ones worth a musician's attention.
 */
const TILES: {
  kind: KitEventKind;
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
}[] = [
  { kind: "view", label: "Visits", Icon: EyeIcon },
  { kind: "play", label: "Plays", Icon: PlayIcon },
  { kind: "download", label: "Downloads", Icon: DownloadIcon },
  { kind: "link", label: "Listen clicks", Icon: LinkOutIcon },
];

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

function TopTable({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: TopAssetRow[];
  empty: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3">
          {rows.map((row) => (
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
      )}
    </div>
  );
}

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
  const nothingYet = TILES.every((tile) => totals[tile.kind] === 0);

  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TILES.map((tile) => (
          <div
            key={tile.kind}
            className="rounded-3xl border border-line bg-surface-muted/40 px-4 py-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500/12 text-brand-700 dark:text-brand-300">
              <tile.Icon />
            </span>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {totals[tile.kind]}
            </p>
            <p className="mt-0.5 text-xs text-muted">{tile.label}</p>
          </div>
        ))}
      </div>

      {nothingYet && (
        <p className="mt-5 text-sm text-muted">
          {published ? "No activity yet." : "Not published yet."}
        </p>
      )}

      {/* Bled past the card's padding so the rules meet its edges and the
          chart reads as a band rather than another block in a stack. */}
      <div className="-mx-7 mt-8 border-y border-line px-7 py-7 sm:-mx-8 sm:px-8">
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

      <div className="mt-7 grid gap-8 sm:grid-cols-2">
        <TopTable
          title="Most downloaded"
          rows={downloads}
          empty="Nothing downloaded yet."
        />
        <TopTable
          title="Most listened"
          rows={plays}
          empty="No tracks played yet."
        />
      </div>
    </Card>
  );
}
