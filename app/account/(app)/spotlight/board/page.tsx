import Link from "next/link";
import {
  PageHeader,
  actionPill,
  actionPillBrand,
  buttonQuiet,
  focusable,
} from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { listReleasesForBoard, type BoardRelease } from "@/lib/dal/spotlight";
import { parseTagList } from "@/lib/press/taxonomy";
import { readinessHref, readinessOf, type ReadinessItem } from "@/lib/spotlight/readiness";
import { planReleaseAction, skipReleaseAction, unplanReleaseAction } from "../actions";

export const metadata = { title: "Spotlight board" };

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

type Column = "needs-info" | "ready" | "planned";

const COLUMNS: { key: Column; title: string; body: string; dot: string }[] = [
  { key: "needs-info", title: "Needs info", body: "The press kit is missing something.", dot: "bg-amber-400" },
  { key: "ready", title: "Ready", body: "Everything's there. Plan it, or skip it.", dot: "bg-emerald-500" },
  { key: "planned", title: "Planned to write", body: "Your own list. The owner can't see it.", dot: "bg-brand-500" },
];

type Card = { release: BoardRelease; items: ReadinessItem[]; missing: ReadinessItem[]; column: Column };

function toCard(release: BoardRelease): Card {
  const items = readinessOf({
    hasCover: Boolean(release.coverAssetId),
    photoCount: release.photoCount,
    url: release.url,
    genre: parseTagList(release.genre),
    mood: parseTagList(release.mood),
    country: release.country,
    language: release.language,
    labelStatus: release.labelStatus,
    gender: release.gender,
  });
  const missing = items.filter((item) => !item.done);
  const column: Column = release.planned ? "planned" : missing.length > 0 ? "needs-info" : "ready";
  return { release, items, missing, column };
}

/** Days from `today` to `date`, both plain YYYY-MM-DD, without a timezone in sight. */
function daysUntil(date: string, today: string) {
  const day = (value: string) => Date.UTC(...(value.split("-").map(Number) as [number, number, number]));
  return Math.round((day(date) - day(today)) / 86_400_000);
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(year, month - 1, day),
  );
}

/** Coming soonest first, then the undated, then the ones already out (newest first). */
function byDate(today: string) {
  const rank = (date: string | null) => (date === null ? 1 : date >= today ? 0 : 2);
  return (a: Card, b: Card) => {
    const ra = rank(a.release.releaseDate);
    const rb = rank(b.release.releaseDate);
    if (ra !== rb) return ra - rb;
    const da = a.release.releaseDate ?? "";
    const db = b.release.releaseDate ?? "";
    return ra === 2 ? db.localeCompare(da) : da.localeCompare(db);
  };
}

function DateChip({ date, today }: { date: string | null; today: string }) {
  if (!date) return <span className="text-xs text-faint">No release date</span>;
  const days = daysUntil(date, today);
  const label =
    days === 0 ? "Out today" : days > 0 ? `Out ${formatDate(date)} · in ${days} day${days === 1 ? "" : "s"}` : `Out since ${formatDate(date)}`;
  const urgent = days >= 0 && days <= 14;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        urgent ? "bg-rose-500/12 text-rose-700" : days < 0 ? "bg-surface-muted text-muted" : "bg-brand-500/10 text-brand-700"
      }`}
    >
      {label}
    </span>
  );
}

function BoardCard({ card, today }: { card: Card; today: string }) {
  const { release, items, missing, column } = card;
  const done = items.length - missing.length;

  return (
    <li className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-start gap-3">
        {release.coverAssetId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/spotlight/image/${release.coverAssetId}?size=sm`}
            alt=""
            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-dashed border-line text-[10px] text-faint">
            No art
          </span>
        )}
        <div className="min-w-0 flex-1">
          <Link
            href={`/press/${release.id}`}
            className={`block truncate rounded text-sm font-semibold text-foreground hover:text-brand-700 ${focusable}`}
          >
            {release.title}
          </Link>
          <p className="truncate text-xs text-muted">
            {release.artistName} · {KIND_LABELS[release.kind]}
          </p>
          <p className="truncate text-[11px] text-faint">{release.ownerEmail}</p>
        </div>
      </div>

      <div className="mt-3">
        <DateChip date={release.releaseDate} today={today} />
      </div>

      {missing.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${(done / items.length) * 100}%` }} />
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-muted">
              {done}/{items.length}
            </span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-1" aria-label="Missing">
            {missing.map((item) => (
              <li key={item.key}>
                <Link
                  href={readinessHref(release.id, item)}
                  className={`inline-flex rounded-full border border-dashed border-line px-2 py-0.5 text-[11px] text-muted hover:border-line-strong hover:text-foreground ${focusable}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {column === "planned" ? (
          <>
            <Link href={`/account/spotlight/new?release=${release.id}`} className={actionPillBrand}>
              Write
            </Link>
            <form action={unplanReleaseAction}>
              <input type="hidden" name="releaseId" value={release.id} />
              <button className={actionPill}>Unplan</button>
            </form>
          </>
        ) : (
          <form action={planReleaseAction}>
            <input type="hidden" name="releaseId" value={release.id} />
            <button className={column === "ready" ? actionPillBrand : actionPill}>Plan</button>
          </form>
        )}
        <form action={skipReleaseAction} className="ml-auto">
          <input type="hidden" name="releaseId" value={release.id} />
          <button className={actionPill}>Skip</button>
        </form>
      </div>
    </li>
  );
}

/**
 * Every press kit still waiting for a Spotlight decision, as a board. The
 * first two columns follow the kit's own data; Planned is the admin's tag.
 * A card leaves the board when an article is written or it's skipped.
 */
export default async function SpotlightBoardPage() {
  await requireAdmin("/account/spotlight/board");
  const [releases, today] = await Promise.all([listReleasesForBoard(), todayIso()]);
  const cards = releases.map(toCard).sort(byDate(today));

  return (
    <>
      <PageHeader
        title="Spotlight board"
        subtitle={`${cards.length} press kit${cards.length === 1 ? "" : "s"} waiting. A kit leaves the board once it's written or skipped.`}
        action={
          <Link className={buttonQuiet} href="/account/spotlight">
            ← Spotlight
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const inColumn = cards.filter((card) => card.column === column.key);
          return (
            <section key={column.key} aria-labelledby={`col-${column.key}`} className="rounded-4xl bg-surface-muted/60 p-3">
              <div className="px-2 pb-3 pt-1">
                <h2 id={`col-${column.key}`} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                  {column.title}
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs tabular-nums text-muted">{inColumn.length}</span>
                </h2>
                <p className="mt-1 text-xs text-muted">{column.body}</p>
              </div>
              {inColumn.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-line px-4 py-8 text-center text-xs text-faint">Nothing here</p>
              ) : (
                <ul className="space-y-3">
                  {inColumn.map((card) => (
                    <BoardCard key={card.release.id} card={card} today={today} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
