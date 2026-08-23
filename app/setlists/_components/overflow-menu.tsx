"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { focusable } from "@/app/_components/ui";

/**
 * The three-dot menu. Opens on click, closes on Escape, an outside click, or
 * choosing something — the same rules as the public header's dropdown, for
 * the same reason: a hover menu has no equivalent under a finger.
 *
 * The popup is portalled to `document.body` and positioned from the
 * trigger's own bounding box rather than nested under it: several callers
 * sit inside a rounded, `overflow-hidden` panel, and a nested popup would
 * get clipped at the panel's edge for any row near the top or bottom of it.
 */
export function OverflowMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; onSelect: () => void; danger?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<{ top: number; right: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const box = triggerRef.current?.getBoundingClientRect();
    if (box) {
      setOrigin({ top: box.bottom + 8, right: window.innerWidth - box.right });
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          <circle cx="4" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {open &&
        origin &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: origin.top, right: origin.right }}
            className="z-50 w-44 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-float"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-muted ${
                  item.danger ? "text-rose-700 dark:text-rose-300" : ""
                } ${focusable}`}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
