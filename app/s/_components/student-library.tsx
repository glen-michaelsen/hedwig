"use client";

import { useMemo, useState } from "react";
import type { StudentLibraryItem } from "@/lib/dal/student";
import { Empty, SectionTitle, actionPill, actionPillBrand, input } from "@/app/_components/ui";
import { MaterialList } from "./material-list";

/**
 * Filtering happens here rather than on the server: everything a student can
 * see already arrived with the page, so search-as-you-type costs nothing and
 * has no loading state to design around.
 */
export function StudentLibrary({
  onShelf,
  fromLessons,
}: {
  onShelf: StudentLibraryItem[];
  fromLessons: StudentLibraryItem[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const item of [...onShelf, ...fromLessons]) {
      for (const tag of item.tags) set.add(tag);
    }
    return [...set].sort();
  }, [onShelf, fromLessons]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();

    function keep(item: StudentLibraryItem) {
      if (activeTag && !item.tags.includes(activeTag)) return false;
      if (!needle) return true;
      return (
        item.title.toLowerCase().includes(needle) ||
        (item.description?.toLowerCase().includes(needle) ?? false) ||
        item.tags.some((tag) => tag.includes(needle))
      );
    }

    return { shelf: onShelf.filter(keep), lessons: fromLessons.filter(keep) };
  }, [onShelf, fromLessons, query, activeTag]);

  const total = onShelf.length + fromLessons.length;
  const visible = matches.shelf.length + matches.lessons.length;
  const filtering = query.trim().length > 0 || activeTag !== null;

  if (total === 0) {
    return <Empty>Nothing from your teacher yet.</Empty>;
  }

  return (
    <>
      <input
        type="search"
        className={input}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your material"
        aria-label="Search your material"
      />

      {allTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={activeTag === null ? actionPillBrand : actionPill}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={activeTag === tag ? actionPillBrand : actionPill}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Announced politely so a screen reader hears the count change as
          the filter narrows, without interrupting typing. */}
      <p className="sr-only" role="status" aria-live="polite">
        {visible} of {total} items shown
      </p>

      {visible === 0 ? (
        <div className="mt-8">
          <Empty>Nothing matches that.</Empty>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {matches.shelf.length > 0 && (
            <section>
              <SectionTitle hint="Always here, whichever lesson it came from.">
                On your shelf
              </SectionTitle>
              <MaterialList materials={matches.shelf} />
            </section>
          )}

          {matches.lessons.length > 0 && (
            <section>
              <SectionTitle hint="Everything your teacher has gone through with you.">
                From your lessons
              </SectionTitle>
              <MaterialList materials={matches.lessons} />
            </section>
          )}
        </div>
      )}

      {filtering && visible > 0 && (
        <p className="mt-8 text-center text-xs text-faint">
          Showing {visible} of {total}
        </p>
      )}
    </>
  );
}
