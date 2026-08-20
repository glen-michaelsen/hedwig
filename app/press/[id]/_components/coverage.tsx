"use client";

import { useActionState, useState, useTransition } from "react";
import {
  addCoverageAction,
  deleteCoverageAction,
  type CoverageState,
} from "../../actions";
import {
  ErrorText,
  actionPill,
  button,
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

  const date = formatDate(item.publishedOn);

  return (
    <li className="flex flex-wrap items-start gap-3 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-700 dark:text-brand-300">
            {KIND_LABELS[item.kind]}
          </span>
          {item.outlet && (
            <span className="text-xs font-medium">{item.outlet}</span>
          )}
          {date && <span className="text-xs text-faint">{date}</span>}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-1.5 block truncate text-sm transition-colors hover:text-brand-700 dark:hover:text-brand-300"
        >
          {item.title ?? item.url}
        </a>
        {item.note && (
          <p className="mt-1 text-xs text-muted">{item.note}</p>
        )}
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className={`${actionPill} shrink-0 hover:border-rose-500/40 hover:text-rose-700`}
      >
        {pending ? "Removing…" : "Remove"}
      </button>
    </li>
  );
}

/**
 * Where a release got written about. Typed in by hand, because nothing
 * reliably discovers a review and the artist usually hears first — a manager
 * forwarding "we got album of the week" is the moment this gets used.
 */
export function CoverageSection({
  releaseId,
  items,
}: {
  releaseId: string;
  items: CoverageRow[];
}) {
  const [state, formAction, pending] = useActionState<CoverageState, FormData>(
    addCoverageAction,
    {},
  );
  const [open, setOpen] = useState(false);

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing logged yet. Add the first review, playlist or post.
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <CoverageItem key={item.id} releaseId={releaseId} item={item} />
          ))}
        </ul>
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
            placeholder="Note (optional) — e.g. 8/10, or which track they picked"
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
