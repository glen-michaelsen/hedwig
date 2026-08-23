"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StudentFeedNote, StudentLibraryItem } from "@/lib/dal/student";
import { Empty, SectionTitle, input } from "@/app/_components/ui";
import { MaterialList } from "./material-list";

/**
 * A material pinned to the shelf *and* attached to a lesson is deliberately
 * listed twice on the material tab — that's true, and hiding either would
 * misrepresent where it came from. Search is a different job: finding one
 * thing fast, so here it's shown once.
 */
function dedupeMaterials(
  onShelf: StudentLibraryItem[],
  fromLessons: StudentLibraryItem[],
) {
  const seen = new Set<string>();
  const merged: StudentLibraryItem[] = [];
  for (const item of [...onShelf, ...fromLessons]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

/**
 * Everything a student can see, searched at once. Filtering happens here
 * rather than on the server, same as the material tab: it all arrived with
 * the page, so search-as-you-type costs nothing.
 */
export function StudentSearch({
  notes,
  onShelf,
  fromLessons,
}: {
  notes: StudentFeedNote[];
  onShelf: StudentLibraryItem[];
  fromLessons: StudentLibraryItem[];
}) {
  const [query, setQuery] = useState("");
  const materials = useMemo(
    () => dedupeMaterials(onShelf, fromLessons),
    [onShelf, fromLessons],
  );

  const needle = query.trim().toLowerCase();

  const matchingNotes = useMemo(() => {
    if (!needle) return [];
    return notes.filter(
      (note) =>
        note.date.includes(needle) ||
        (note.summaryShared?.toLowerCase().includes(needle) ?? false) ||
        (note.homework?.toLowerCase().includes(needle) ?? false),
    );
  }, [notes, needle]);

  const matchingMaterials = useMemo(() => {
    if (!needle) return [];
    return materials.filter(
      (m) =>
        m.title.toLowerCase().includes(needle) ||
        (m.description?.toLowerCase().includes(needle) ?? false) ||
        m.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  }, [materials, needle]);

  const total = matchingNotes.length + matchingMaterials.length;

  return (
    <>
      <input
        type="search"
        autoFocus
        className={input}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search lessons and material"
        aria-label="Search lessons and material"
      />

      {!needle ? (
        <p className="mt-8 text-center text-sm text-muted">
          Type to search everything your teacher has shared with you.
        </p>
      ) : total === 0 ? (
        <div className="mt-8">
          <Empty>Nothing matches that.</Empty>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {matchingNotes.length > 0 && (
            <section>
              <SectionTitle>Lessons</SectionTitle>
              <ul className="space-y-3">
                {matchingNotes.map((note) => (
                  <li key={note.id} className="min-w-0">
                    <Link
                      href={`/s/note/${note.id}`}
                      className="block min-w-0 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-soft transition-all hover:-translate-y-px hover:shadow-lift"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] tabular-nums text-brand-600 dark:text-brand-400">
                        {note.date}
                      </p>
                      {note.summaryShared && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                          {note.summaryShared}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {matchingMaterials.length > 0 && (
            <section>
              <SectionTitle>Material</SectionTitle>
              <MaterialList materials={matchingMaterials} />
            </section>
          )}
        </div>
      )}
    </>
  );
}
