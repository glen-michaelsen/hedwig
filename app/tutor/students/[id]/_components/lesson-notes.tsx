"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Empty,
  Panel,
  PanelList,
  button,
  buttonGhost,
  focusable,
  panelRow,
} from "@/app/_components/ui";

export type NoteSummary = {
  id: string;
  date: string;
  summaryShared: string | null;
  hasHomework: boolean;
  materialCount: number;
};

/** Paperclip — reads as "things attached" without needing a label. */
function AttachmentChip({ count }: { count: number }) {
  return (
    <span
      className="hidden shrink-0 items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] leading-none text-faint sm:inline-flex"
      title={`${count} ${count === 1 ? "item" : "items"} attached`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
        aria-hidden
      >
        <path d="M20 11.5 12.3 19.2a4.5 4.5 0 0 1-6.4-6.4l7.8-7.8a3 3 0 0 1 4.2 4.2l-7.7 7.8a1.5 1.5 0 0 1-2.2-2.1l7.1-7.1" />
      </svg>
      <span className="tabular-nums">{count}</span>
      <span className="sr-only">
        {count === 1 ? "item attached" : "items attached"}
      </span>
    </span>
  );
}

/* ------------------------------ date helpers ----------------------------- */
// All pure and deterministic: they take the month or date as input and never
// read the clock. "ym" is always YYYY-MM, "iso" always YYYY-MM-DD.

function parseYm(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  return { year, month };
}

function addMonths(ym: string, delta: number) {
  const { year, month } = parseYm(ym);
  const zeroBased = month - 1 + delta;
  const nextYear = year + Math.floor(zeroBased / 12);
  const nextMonth = ((zeroBased % 12) + 12) % 12;
  return `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}`;
}

function daysInMonth(ym: string) {
  const { year, month } = parseYm(ym);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 0 = Monday. European week, since the first studios are Danish. */
function firstWeekdayOffset(ym: string) {
  const { year, month } = parseYm(ym);
  const sundayFirst = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return (sundayFirst + 6) % 7;
}

function isoFor(ym: string, day: number) {
  return `${ym}-${String(day).padStart(2, "0")}`;
}

// Locale is pinned so the server-rendered label and the hydrated one agree.
const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

function monthLabel(ym: string) {
  const { year, month } = parseYm(ym);
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function dayLabel(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return dayFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* --------------------------------- icons --------------------------------- */

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d={direction === "left" ? "M14.5 6 8.5 12l6 6" : "M9.5 6l6 6-6 6"} />
    </svg>
  );
}

/* -------------------------------- component ------------------------------ */

export function LessonNotes({
  studentId,
  notes,
  today,
}: {
  studentId: string;
  notes: NoteSummary[];
  /** YYYY-MM-DD from the server. */
  today: string;
}) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [month, setMonth] = useState(() => today.slice(0, 7));
  const [selected, setSelected] = useState<string | null>(null);

  const notesByDate = useMemo(() => {
    const map = new Map<string, NoteSummary[]>();
    for (const note of notes) {
      const list = map.get(note.date) ?? [];
      list.push(note);
      map.set(note.date, list);
    }
    return map;
  }, [notes]);

  const cells = useMemo(() => {
    const offset = firstWeekdayOffset(month);
    const total = daysInMonth(month);
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, i) => i + 1),
    ];
  }, [month]);

  const selectedNotes = selected ? (notesByDate.get(selected) ?? []) : [];
  const monthNoteCount = notes.filter((n) => n.date.startsWith(month)).length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Lesson notes
        </h2>

        <div
          role="tablist"
          aria-label="Lesson notes view"
          className="flex rounded-full border border-line bg-surface p-1 shadow-soft"
        >
          {(["list", "calendar"] as const).map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={view === value}
              onClick={() => setView(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${focusable} ${
                view === value
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        notes.length === 0 ? (
          <Empty>No lessons written up yet.</Empty>
        ) : (
          <Panel>
            <PanelList>
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/tutor/students/${studentId}/notes/${note.id}`}
                    className={panelRow}
                  >
                    {/* Same shape as a shelf row: pill, then the text.
                        ISO keeps every pill the same width. */}
                    <span className="shrink-0 rounded-full bg-brand-500/12 px-3 py-1.5 text-[11px] font-semibold leading-none tabular-nums text-brand-700 dark:text-brand-300">
                      {note.date}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm">
                      {note.summaryShared ?? (
                        <span className="text-faint">Nothing shared yet</span>
                      )}
                    </span>

                    {note.materialCount > 0 && (
                      <AttachmentChip count={note.materialCount} />
                    )}

                    {note.hasHomework && (
                      <span className="hidden shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] uppercase tracking-wide leading-none text-faint sm:inline">
                        Homework
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </PanelList>
          </Panel>
        )
      ) : (
        <div className="rounded-4xl border border-line bg-surface p-6 shadow-soft sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                {monthLabel(month)}
              </p>
              <p className="mt-0.5 text-xs text-faint">
                {monthNoteCount === 0
                  ? "No lessons this month"
                  : `${monthNoteCount} ${monthNoteCount === 1 ? "lesson" : "lessons"}`}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMonth(addMonths(month, -1))}
                aria-label="Previous month"
                className={`grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground ${focusable}`}
              >
                <Chevron direction="left" />
              </button>
              <button
                onClick={() => setMonth(today.slice(0, 7))}
                className={`rounded-full border border-line px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-foreground ${focusable}`}
              >
                Today
              </button>
              <button
                onClick={() => setMonth(addMonths(month, 1))}
                aria-label="Next month"
                className={`grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground ${focusable}`}
              >
                <Chevron direction="right" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="pb-2 text-center text-[11px] font-medium uppercase tracking-wide text-faint"
              >
                {/* Now the cells are wide, there's room for names —
                    "M T W T F S S" made Tue/Thu and Sat/Sun ambiguous. */}
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden" aria-hidden>
                  {day.slice(0, 1)}
                </span>
                <span className="sr-only sm:hidden">{day}</span>
              </div>
            ))}

            {cells.map((day, index) => {
              if (day === null) return <div key={`pad-${index}`} />;

              const iso = isoFor(month, day);
              const dayNotes = notesByDate.get(iso) ?? [];
              const isToday = iso === today;
              const isSelected = iso === selected;

              return (
                <button
                  key={iso}
                  onClick={() => setSelected(isSelected ? null : iso)}
                  aria-label={`${dayLabel(iso)}${
                    dayNotes.length > 0
                      ? `, ${dayNotes.length} lesson note${dayNotes.length === 1 ? "" : "s"}`
                      : ", no lesson notes"
                  }`}
                  aria-pressed={isSelected}
                  // Fixed height rather than aspect-square: the grid is wide,
                  // and square cells made the month absurdly tall.
                  className={`relative flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-sm transition-all sm:h-16 ${focusable} ${
                    isSelected
                      ? "bg-brand-600 text-white shadow-brand"
                      : dayNotes.length > 0
                        ? "bg-brand-500/12 font-medium text-brand-700 hover:bg-brand-500/20 dark:text-brand-200"
                        : "text-muted hover:bg-surface-muted"
                  } ${isToday && !isSelected ? "ring-1 ring-brand-400" : ""}`}
                >
                  <span className="tabular-nums">{day}</span>

                  {dayNotes.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayNotes.slice(0, 3).map((note) => (
                        <span
                          key={note.id}
                          className={`h-1 w-1 rounded-full ${
                            isSelected ? "bg-white/80" : "bg-brand-500"
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            {selected === null ? (
              <p className="text-center text-sm text-muted">
                Pick a day to see its notes, or to write one for that date.
              </p>
            ) : (
              <>
                <p className="mb-4 text-sm font-medium">{dayLabel(selected)}</p>

                {selectedNotes.length > 0 && (
                  <ul className="mb-4 space-y-2">
                    {selectedNotes.map((note) => (
                      <li key={note.id}>
                        <Link
                          href={`/tutor/students/${studentId}/notes/${note.id}`}
                          className="flex items-center gap-3 rounded-2xl bg-surface-muted px-5 py-3.5 text-sm transition-colors hover:bg-brand-500/10"
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {note.summaryShared ?? (
                              <span className="text-muted">
                                Opened, nothing shared yet
                              </span>
                            )}
                          </span>
                          {note.materialCount > 0 && (
                            <AttachmentChip count={note.materialCount} />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={`/tutor/students/${studentId}/notes/new?date=${selected}`}
                  className={selectedNotes.length > 0 ? buttonGhost : button}
                >
                  {selectedNotes.length > 0
                    ? "Add another note for this day"
                    : "Write a note for this day"}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
