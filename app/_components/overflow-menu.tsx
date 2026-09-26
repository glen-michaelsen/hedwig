"use client";

import { useRef, useState } from "react";
import { DropdownMenu } from "@/app/_components/dropdown-menu";
import { focusable } from "@/app/_components/ui";

/**
 * The three-dot menu. Opens on click, closes on Escape, an outside click, or
 * choosing something — the same rules as the public header's dropdown, for
 * the same reason: a hover menu has no equivalent under a finger.
 */
export function OverflowMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; onSelect: () => void; danger?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        // `after` extends the tappable area past the visible circle without
        // making the circle itself any bigger — a precise 36px target is
        // easy to miss with a thumb.
        className={`relative grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors after:absolute after:-inset-2.5 hover:text-foreground ${focusable}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          <circle cx="4" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <DropdownMenu
        anchorRef={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        items={items}
      />
    </>
  );
}
