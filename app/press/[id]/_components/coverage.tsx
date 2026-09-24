"use client";

import { Fragment, useActionState, useState, useTransition } from "react";
import {
  addCoverageAction,
  deleteCoverageAction,
  type CoverageState,
} from "../../actions";
import {
  ErrorText,
  actionPill,
  button,
  focusable,
  inputBase,
} from "@/app/_components/ui";
import type { CoverageRow } from "@/lib/dal/kit-stats";

const KIND_LABELS = {
  review: "Review",
  feature: "Feature",
  interview: "Interview",
  playlist: "Playlist",
  radio: "Radio",
  social: "Social",
  other: "Other",
} as const;

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

/**
 * One line per piece of coverage. A real table, so a release with a dozen
 * reviews stays a compact list instead of a tall stack of cards. Outlet and
 * note drop off on small screens; the title keeps the room and truncates.
 */
function CoverageLine({
  date,
  kind,
  title,
  url,
  outlet,
  note,
  action,
}: {
  date: string | null;
  kind: string;
  title: string;
  url: string;
  outlet: string | null;
  note: string | null;
  action: React.ReactNode;
}) {
  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="py-2.5 pr-3 text-xs tabular-nums text-faint whitespace-nowrap">
        {date ?? "No date"}
      </td>
      <td className="py-2.5 pr-3">
        <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-700">
          {kind}
        </span>
      </td>
      <td className="truncate py-2.5 pr-3 text-sm" title={title}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="transition-colors hover:text-brand-700"
        >
          {title}
        </a>
      </td>
      <td className="hidden truncate py-2.5 pr-3 text-xs font-medium sm:table-cell" title={outlet ?? undefined}>
        {outlet}
      </td>
      <td className="hidden truncate py-2.5 pr-3 text-xs text-muted md:table-cell" title={note ?? undefined}>
        {note}
      </td>
      <td className="py-2.5 text-right">{action}</td>
    </tr>
  );
}

function CoverageItem({
  releaseId,
  item,
}: {
  releaseId: string;
  item: CoverageRow;
}) {
  const [pending, startTransition] = useTransition();

  function remove() {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("coverageId", item.id);
    startTransition(() => deleteCoverageAction(formData));
  }

  const title = item.title ?? item.url;

  return (
    <CoverageLine
      date={formatDate(item.publishedOn)}
      kind={KIND_LABELS[item.kind]}
      title={title}
      url={item.url}
      outlet={item.outlet}
      note={item.note}
      action={
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          aria-label={`Remove ${title}`}
          title="Remove"
          className={`inline-grid h-7 w-7 place-items-center rounded-full text-faint transition-colors hover:bg-rose-500/10 hover:text-rose-700 disabled:opacity-50 ${focusable}`}
        >
          ✕
        </button>
      }
    />
  );
}

export type SpotlightCoverage = {
  url: string;
  headline: string;
  rating: number;
  maxRating: number;
  /** YYYY-MM-DD, the day the article went live. */
  liveOn: string | null;
};

/** Trenodo's own review of the release. Added by us, so no Remove button:
 *  it goes away by itself if the article is ever taken down. */
function SpotlightCoverageItem({ spotlight }: { spotlight: SpotlightCoverage }) {
  return (
    <CoverageLine
      date={formatDate(spotlight.liveOn)}
      kind={KIND_LABELS.review}
      title={spotlight.headline}
      url={spotlight.url}
      outlet="Trenodo Spotlight"
      note={`${spotlight.rating} of ${spotlight.maxRating} hearts`}
      action={
        <span
          title="Added by Trenodo. It updates by itself."
          className="whitespace-nowrap rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-muted"
        >
          By Trenodo
        </span>
      }
    />
  );
}

/**
 * Where a release got written about. Typed in by hand, because nothing
 * reliably discovers a review and the artist usually hears first — a manager
 * forwarding "we got album of the week" is the moment this gets used.
 *
 * The one exception is a live Spotlight, which Trenodo knows about already.
 * It slots in by date, unless the musician logged that article by hand.
 */
export function CoverageSection({
  releaseId,
  items,
  spotlight,
}: {
  releaseId: string;
  items: CoverageRow[];
  spotlight: SpotlightCoverage | null;
}) {
  const [state, formAction, pending] = useActionState<CoverageState, FormData>(
    addCoverageAction,
    {},
  );
  const [open, setOpen] = useState(false);

  const showSpotlight =
    spotlight !== null && !items.some((item) => item.url === spotlight.url);
  // Where the Spotlight goes in the newest-first list: before the first
  // hand-logged item that's older, or undated.
  const spotlightIndex = showSpotlight
    ? (() => {
        const index = items.findIndex(
          (item) => !item.publishedOn || (spotlight.liveOn ?? "") >= item.publishedOn,
        );
        return index === -1 ? items.length : index;
      })()
    : -1;

  return (
    <div>
      {items.length === 0 && !showSpotlight ? (
        <p className="text-sm text-muted">
          Nothing logged yet. Add the first review, playlist or post.
        </p>
      ) : (
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              <th scope="col" className="w-24 pb-2 pr-3 font-semibold">Date</th>
              <th scope="col" className="w-24 pb-2 pr-3 font-semibold">Type</th>
              <th scope="col" className="pb-2 pr-3 font-semibold">Title</th>
              <th scope="col" className="hidden w-36 pb-2 pr-3 font-semibold sm:table-cell">Outlet</th>
              <th scope="col" className="hidden w-32 pb-2 pr-3 font-semibold md:table-cell">Note</th>
              <th scope="col" className="w-20 pb-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {index === spotlightIndex && spotlight && (
                  <SpotlightCoverageItem spotlight={spotlight} />
                )}
                <CoverageItem releaseId={releaseId} item={item} />
              </Fragment>
            ))}
            {spotlightIndex === items.length && spotlight && (
              <SpotlightCoverageItem spotlight={spotlight} />
            )}
          </tbody>
        </table>
      )}

      {open ? (
        <form action={formAction} className="mt-5 space-y-3">
          <input type="hidden" name="releaseId" value={releaseId} />

          <input
            className={`${inputBase} w-full`}
            name="url"
            type="url"
            placeholder="https://… link to the review, post or playlist"
            required
            autoFocus
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <select className={`${inputBase} w-full`} name="kind" defaultValue="review">
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              className={`${inputBase} w-full`}
              name="outlet"
              placeholder="Outlet (optional)"
              maxLength={120}
            />
            <input
              className={`${inputBase} w-full`}
              name="publishedOn"
              type="date"
              aria-label="Date it appeared"
            />
          </div>

          <input
            className={`${inputBase} w-full`}
            name="note"
            placeholder="Note (optional). For example 8/10, or which track they picked"
            maxLength={300}
          />

          {state.error && <ErrorText>{state.error}</ErrorText>}

          <div className="flex items-center gap-3">
            <button className={button} disabled={pending}>
              {pending ? "Saving…" : "Add coverage"}
            </button>
            <button
              type="button"
              className={actionPill}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className={`${actionPill} mt-5`}
          onClick={() => setOpen(true)}
        >
          Add coverage
        </button>
      )}
    </div>
  );
}
