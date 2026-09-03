"use client";

import { useState } from "react";
import { CreateMaterialModal } from "./create-material-modal";
import { KindBadge, buttonQuiet, input, label } from "@/app/_components/ui";

export type MaterialOption = {
  id: string;
  title: string;
  description: string | null;
  kind: "pdf" | "link" | "video";
};

const RECENT_COUNT = 3;

/**
 * Attach/detach material for a lesson note. Renders hidden `materialIds`
 * inputs so the enclosing form submits the same way it always did — this
 * widget only changes how a tutor builds that list.
 */
export function MaterialAttachField({
  materials,
  allTags,
  initialAttachedIds,
}: {
  /** Already ordered most-recent-first, per `listMaterials`. */
  materials: MaterialOption[];
  allTags: string[];
  initialAttachedIds: string[];
}) {
  // Seeded from the prop, then grown locally when a material is created
  // right here — the server list was already fetched by the time that
  // happens, so this is the only place that needs to know about it.
  const [allMaterials, setAllMaterials] = useState(materials);
  const [attachedIds, setAttachedIds] = useState(initialAttachedIds);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

  const attachedSet = new Set(attachedIds);
  const attached = allMaterials.filter((m) => attachedSet.has(m.id));
  const available = allMaterials.filter((m) => !attachedSet.has(m.id));

  const needle = query.trim().toLowerCase();
  const results = needle
    ? available.filter(
        (m) =>
          m.title.toLowerCase().includes(needle) ||
          (m.description?.toLowerCase().includes(needle) ?? false),
      )
    : [];
  const recent = available.slice(0, RECENT_COUNT);
  const shown = needle ? results : recent;

  function attach(materialId: string) {
    setAttachedIds((current) =>
      current.includes(materialId) ? current : [...current, materialId],
    );
    setQuery("");
    setActiveIndex(0);
  }

  function remove(materialId: string) {
    setAttachedIds((current) => current.filter((id) => id !== materialId));
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && shown.length) {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, shown.length - 1));
    } else if (event.key === "ArrowUp" && shown.length) {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      // Always swallow Enter here — this field sits inside the note form,
      // and letting it fall through would submit the whole thing.
      event.preventDefault();
      if (shown.length) {
        attach(shown[Math.min(activeIndex, shown.length - 1)].id);
      }
    }
  }

  return (
    <div className="space-y-5">
      {attachedIds.map((id) => (
        <input key={id} type="hidden" name="materialIds" value={id} />
      ))}

      <div>
        <p className={label}>Attached material</p>
        {attached.length === 0 ? (
          <p className="text-sm text-muted">Nothing attached yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {attached.map((m) => (
              <li
                key={m.id}
                className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-surface-muted px-4 py-3 text-sm"
              >
                <KindBadge kind={m.kind} />
                <span className="min-w-0 flex-1 truncate">{m.title}</span>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className={label}>Add material</p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={`${buttonQuiet} px-3.5 py-1.5 text-xs`}
          >
            Create material
          </button>
        </div>

        {available.length > 0 && (
          <>
            <input
              className={`${input} mt-3`}
              type="text"
              role="combobox"
              aria-expanded={shown.length > 0}
              aria-controls="material-search-results"
              placeholder="Search your library"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onSearchKeyDown}
            />

            <ul
              id="material-search-results"
              role="listbox"
              className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line"
            >
              {shown.length === 0 ? (
                <li className="px-4 py-3 text-sm text-muted">
                  Nothing matches that.
                </li>
              ) : (
                shown.map((m, i) => (
                  <li key={m.id} role="option" aria-selected={i === activeIndex}>
                    <button
                      type="button"
                      onClick={() => attach(m.id)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors ${
                        i === activeIndex ? "bg-brand-500/8" : "hover:bg-surface-muted"
                      }`}
                    >
                      <KindBadge kind={m.kind} />
                      <span className="min-w-0 flex-1 truncate">{m.title}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>

      <CreateMaterialModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        allTags={allTags}
        onCreated={(material) => {
          setAllMaterials((current) => [material, ...current]);
          attach(material.id);
        }}
      />
    </div>
  );
}
