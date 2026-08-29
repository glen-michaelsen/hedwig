"use client";

import { useState } from "react";
import { focusable, inputBase, label } from "./ui";

export type TagOption = { value: string; label: string };

/**
 * Tags are picked from what the studio already uses, so the same idea doesn't
 * end up stored as "grade 3", "Grade3" and "grade three". Adding a genuinely
 * new one is a deliberate second step rather than a side effect of typing —
 * unless `allowCustom` is off, for a closed vocabulary (e.g. release genre)
 * where a new value can't just be typed into existence.
 *
 * Submits one hidden field per selected option, under `name`; the action
 * reads them with formData.getAll(name).
 */
export function TagPicker({
  id,
  name = "tags",
  heading = "Tags",
  options,
  defaultSelected = [],
  allowCustom = true,
  max,
}: {
  id?: string;
  name?: string;
  heading?: string;
  options: TagOption[];
  defaultSelected?: string[];
  allowCustom?: boolean;
  max?: number;
}) {
  const [known, setKnown] = useState<TagOption[]>(() => {
    const byValue = new Map(options.map((o) => [o.value, o]));
    for (const value of defaultSelected) {
      if (!byValue.has(value)) byValue.set(value, { value, label: value });
    }
    return [...byValue.values()];
  });
  const [selected, setSelected] = useState(() => new Set(defaultSelected));
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const normalised = draft.trim().toLowerCase();
  const alreadyExists =
    normalised.length > 0 && known.some((o) => o.value === normalised);
  const atMax = max !== undefined && selected.size >= max;

  function toggle(value: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (atMax) return current;
        next.add(value);
      }
      return next;
    });
  }

  function addNew() {
    if (!normalised || atMax) return;

    if (!known.some((o) => o.value === normalised)) {
      setKnown((current) =>
        [...current, { value: normalised, label: normalised }].sort((a, b) =>
          a.label.localeCompare(b.label),
        ),
      );
      setNotice(null);
    } else {
      setNotice(`"${normalised}" already exists — selected it for you.`);
    }

    setSelected((current) => new Set(current).add(normalised));
    setDraft("");
  }

  return (
    <div id={id}>
      <p className={label}>
        {heading}
        {max !== undefined && (
          <span className="normal-case text-faint"> · up to {max}</span>
        )}
      </p>

      {known.length > 0 ? (
        <ul className="mb-4 flex flex-wrap gap-2">
          {known.map((option) => {
            const isSelected = selected.has(option.value);
            const disabled = !isSelected && atMax;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  disabled={disabled}
                  onClick={() => toggle(option.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${focusable} ${
                    isSelected
                      ? "border-transparent bg-brand-600 text-white shadow-brand"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground disabled:opacity-40 disabled:hover:border-line disabled:hover:text-muted"
                  }`}
                >
                  {isSelected && (
                    <span aria-hidden className="text-[10px]">
                      ✓
                    </span>
                  )}
                  {option.label}
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

      {allowCustom && (
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
              disabled={!normalised || atMax}
              className={`shrink-0 rounded-full border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-40 ${focusable}`}
            >
              {alreadyExists ? "Select" : "Add"}
            </button>
          </div>
          {notice && <p className="mt-2.5 text-xs text-muted">{notice}</p>}
        </div>
      )}

      {[...selected].map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}
