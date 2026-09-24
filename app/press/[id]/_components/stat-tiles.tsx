"use client";

import { useState, type ReactElement } from "react";
import { Modal } from "@/app/_components/modal";
import { focusable } from "@/app/_components/ui";
import type { KitEventKind } from "@/lib/dal/kit-stats";

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

function ExpandIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 4h4v4M8 16H4v-4M16 4l-5 5M4 16l5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type TopItem = { id: string; name: string; total: number };

/**
 * Photo opens are recorded but not shown: knowing someone enlarged a picture
 * says nothing about whether the release travelled. Visits, plays, downloads
 * and outbound clicks are the ones worth a musician's attention.
 *
 * Plays and Downloads open their top list in a modal, which keeps the panel
 * short: the lists are there when you want them, not in the way.
 */
const TILES: {
  kind: KitEventKind;
  label: string;
  Icon: (props: IconProps) => ReactElement;
  list?: { title: string; empty: string; unit: string };
}[] = [
  { kind: "view", label: "Visits", Icon: EyeIcon },
  {
    kind: "play",
    label: "Plays",
    Icon: PlayIcon,
    list: { title: "Most listened", empty: "No tracks played yet.", unit: "plays" },
  },
  {
    kind: "download",
    label: "Downloads",
    Icon: DownloadIcon,
    list: { title: "Most downloaded", empty: "Nothing downloaded yet.", unit: "downloads" },
  },
  { kind: "link", label: "Listen clicks", Icon: LinkOutIcon },
];

export function StatTiles({
  totals,
  lists,
}: {
  totals: Record<KitEventKind, number>;
  lists: Partial<Record<KitEventKind, TopItem[]>>;
}) {
  const [openKind, setOpenKind] = useState<KitEventKind | null>(null);
  const openTile = TILES.find((tile) => tile.kind === openKind);
  const rows = openKind ? (lists[openKind] ?? []) : [];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TILES.map((tile) => {
          const body = (
            <>
              {/* The icon sits in the corner rather than above the number,
                  so the box is only as tall as the figure and its label. */}
              <span className="absolute right-3 top-3 text-brand-500/70">
                <tile.Icon className="h-4 w-4" />
              </span>
              <p className="text-2xl font-semibold tabular-nums">{totals[tile.kind]}</p>
              <p className="mt-0.5 text-xs text-muted">{tile.label}</p>
            </>
          );

          if (!tile.list) {
            return (
              <div
                key={tile.kind}
                className="relative rounded-3xl border border-line bg-surface-muted/40 px-4 py-3.5"
              >
                {body}
              </div>
            );
          }

          return (
            <button
              key={tile.kind}
              type="button"
              onClick={() => setOpenKind(tile.kind)}
              aria-haspopup="dialog"
              aria-label={`${totals[tile.kind]} ${tile.label}. Show ${tile.list.title.toLowerCase()}`}
              className={`group relative rounded-3xl border border-line bg-surface-muted/40 px-4 py-3.5 text-left transition-colors hover:border-brand-400/60 hover:bg-surface ${focusable}`}
            >
              {body}
              {/* Always a faint hint, since touch screens have no hover.
                  Hover and keyboard focus spell it out. */}
              <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium text-faint transition-colors group-hover:text-brand-600 group-focus-visible:text-brand-600">
                <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline">
                  See list
                </span>
                <ExpandIcon />
              </span>
            </button>
          );
        })}
      </div>

      <Modal
        open={openTile !== undefined && openTile.list !== undefined}
        onClose={() => setOpenKind(null)}
        title={openTile?.list?.title ?? ""}
        description="Over the whole life of the press kit."
      >
        {rows.length === 0 ? (
          <p className="px-6 py-6 text-sm text-muted sm:px-7">{openTile?.list?.empty}</p>
        ) : (
          <ol className="px-6 py-3 sm:px-7">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className="flex items-center gap-4 border-b border-line py-3 last:border-b-0"
              >
                <span className="w-5 shrink-0 font-mono text-xs text-faint">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{row.name}</span>
                <span className="shrink-0 text-sm tabular-nums text-muted">
                  {row.total} {openTile?.list?.unit}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Modal>
    </>
  );
}
