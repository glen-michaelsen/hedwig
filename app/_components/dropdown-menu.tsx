"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { focusable } from "./ui";

/**
 * The portalled panel behind both `OverflowMenu` and any other
 * click-to-open dropdown — positioning, outside-click/Escape-to-close, and
 * the item list. Takes the trigger's ref rather than owning one itself: the
 * trigger is always the caller's own element, attached with a plain
 * `ref={x}` in their own JSX. Never handed a ref through a render-prop or
 * `cloneElement` — the ref rules reject that shape outright, since a
 * function invoked during render could read `.current` early.
 *
 * Portalled to `document.body` and positioned from the trigger's bounding
 * box rather than nested under it: a caller inside a rounded,
 * `overflow-hidden` panel would otherwise get its dropdown clipped.
 */
export function DropdownMenu({
  anchorRef,
  open,
  onClose,
  items,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  items: { label: string; onSelect: () => void; danger?: boolean }[];
}) {
  const [origin, setOrigin] = useState<{ top: number; right: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const box = anchorRef.current?.getBoundingClientRect();
    if (box) {
      setOrigin({ top: box.bottom + 8, right: window.innerWidth - box.right });
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        anchorRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !origin) return null;

  return createPortal(
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
            onClose();
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
  );
}
