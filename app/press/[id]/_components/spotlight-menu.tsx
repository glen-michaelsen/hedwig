"use client";

import { useEffect, useRef, useState } from "react";
import { DropdownMenu } from "@/app/_components/dropdown-menu";
import { SpotlightIcon } from "@/app/_components/nav-icons";
import { focusable } from "@/app/_components/ui";

/** Long enough to cross the gap between the pill and its menu. */
const CLOSE_DELAY_MS = 200;

/**
 * Shown on a release that has a live Spotlight article. Same pill and
 * dropdown as PublishStatusMenu beside it, but it also opens on hover with
 * a mouse. Click still works, for touch and keyboard, where hover doesn't
 * exist.
 */
export function SpotlightMenu({ articleUrl }: { articleUrl: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function closeSoon() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => cancelClose, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(articleUrl);
    } catch {
      window.prompt("Copy this link", articleUrl);
    }
  }

  const items = [
    {
      label: "Read the article",
      onSelect: () => window.open(articleUrl, "_blank", "noopener,noreferrer"),
    },
    { label: "Copy article link", onSelect: copyLink },
    {
      label: "Get your badges",
      onSelect: () =>
        window.open(`${articleUrl}#badges`, "_blank", "noopener,noreferrer"),
    },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Featured in Spotlight. Options"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          cancelClose();
          setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") closeSoon();
        }}
        className={`group inline-flex items-center gap-1.5 rounded-full bg-brand-500/12 px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-500/18 ${focusable}`}
      >
        <SpotlightIcon className="h-4 w-4" />
        Spotlight
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180"
        >
          <path
            d="M5.5 8l4.5 4.5L14.5 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <DropdownMenu
        anchorRef={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onPointerEnter={cancelClose}
        onPointerLeave={closeSoon}
      />
    </>
  );
}
