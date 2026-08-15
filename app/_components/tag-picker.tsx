"use client";

import { useState } from "react";
import { focusable, inputBase, label } from "./ui";

/**
 * Tags are picked from what the studio already uses, so the same idea doesn't
 * end up stored as "grade 3", "Grade3" and "grade three". Adding a genuinely
 * new one is a deliberate second step rather than a side effect of typing.
 *
 * Submits one `tags` field per selected tag; the action reads them with
 * formData.getAll("tags").
 */
export function TagPicker({
  allTags,
  defaultSelected = [],
}: {
  allTags: string[];
  defaultSelected?: string[];
}) {
  const [known, setKnown] = useState(() =>
    [...new Set([...allTags, ...defaultSelected])].sort(),
  );
  const [selected, setSelected] = useState(() => new Set(defaultSelected));
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const normalised = draft.trim().toLowerCase();
  const alreadyExists = normalised.length > 0 && known.includes(normalised);

  function toggle(name: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function addNew() {
    if (!normalised) return;

    if (!known.includes(normalised)) {
      setKnown((current) => [...current, normalised].sort());
      setNotice(null);
    } else {
      setNotice(`"${normalised}" already exists — selected it for you.`);
    }

    setSelected((current) => new Set(current).add(normalised));
    setDraft("");
  }

  return (
    <div>
      <p className={label}>Tags</p>

      {known.length > 0 ? (
        <ul className="mb-4 flex flex-wrap gap-2">
          {known.map((name) => {
            const isSelected = selected.has(name);
            return (
              <li key={name}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(name)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${focusable} ${
                    isSelected
                      ? "border-transparent bg-brand-600 text-white shadow-brand"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
                  }`}
                >
                  {isSelected && (
                    <span aria-hidden className="text-[10px]">
                      ✓
                    </span>
                  )}
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mb-4 text-xs text-faint">
          No tags yet — the first one you add starts your studio&rsquo;s list.
        </p>
      )}

      <div className="rounded-3xl bg-surface-muted p-4">
        <p className="mb-2.5 text-xs font-medium text-muted">Add a new tag</p>
        <div className="flex gap-2">
          <input
            className={`${inputBase} flex-1 min-w-0 bg-surface`}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setNotice(null);
            }}
            onKeyDown={(event) => {
              // Enter here means "add the tag", not "submit the form".
              if (event.key === "Enter") {
                event.preventDefault();
                addNew();
              }
            }}
            placeholder="e.g. sight reading"
            aria-label="New tag name"
          />
          <button
            type="button"
            onClick={addNew}
            disabled={!normalised}
            className={`shrink-0 rounded-full border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-40 ${focusable}`}
          >
            {alreadyExists ? "Select" : "Add"}
          </button>
        </div>
        {notice && <p className="mt-2.5 text-xs text-muted">{notice}</p>}
      </div>

      {[...selected].map((name) => (
        <input key={name} type="hidden" name="tags" value={name} />
      ))}
    </div>
  );
}
