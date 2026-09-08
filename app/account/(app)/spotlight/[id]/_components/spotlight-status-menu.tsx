"use client";

import { useRef, useState, useTransition } from "react";
import { getPreviewLinkAction, togglePublishedAction } from "../../actions";
import { DropdownMenu } from "@/app/_components/dropdown-menu";
import { focusable } from "@/app/_components/ui";
import type { SpotlightStatus } from "@/lib/spotlight/slug";

const STYLES: Record<SpotlightStatus, string> = {
  draft: "bg-surface-muted text-muted hover:bg-line",
  planned:
    "bg-amber-500/12 text-amber-700 hover:bg-amber-500/18 dark:text-amber-300",
  published:
    "bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300",
};

const LABELS: Record<SpotlightStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  published: "Published",
};

/**
 * Preview link, live link, and the publish toggle used to be three separate
 * pills. One status pill now carries all of it — its color is the status,
 * same shape as the press kit's PublishStatusMenu.
 */
export function SpotlightStatusMenu({
  spotlightId,
  status,
  published,
  isFutureRelease,
  previewUrl,
}: {
  spotlightId: string;
  status: SpotlightStatus;
  published: boolean;
  isFutureRelease: boolean;
  previewUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [, startTransition] = useTransition();

  function setPublished(next: boolean) {
    const formData = new FormData();
    formData.set("spotlightId", spotlightId);
    formData.set("published", next ? "1" : "0");
    startTransition(() => togglePublishedAction(formData));
  }

  // The dropdown closes the instant an item is picked, so there's no window
  // to show a "Copied" label — the copy itself still succeeds.
  async function copyPreviewLink() {
    const result = await getPreviewLinkAction(spotlightId);
    if ("error" in result) return;
    try {
      await navigator.clipboard.writeText(result.link);
    } catch {
      window.prompt("Copy this link", result.link);
    }
  }

  const items = [
    {
      label: "Open Preview",
      onSelect: () => window.open(previewUrl, "_blank", "noopener,noreferrer"),
    },
    { label: "Copy Preview", onSelect: copyPreviewLink },
    published
      ? { label: "Unpublish", danger: true, onSelect: () => setPublished(false) }
      : {
          label: isFutureRelease ? "Plan" : "Publish",
          onSelect: () => setPublished(true),
        },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${LABELS[status]} — manage`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${focusable} ${STYLES[status]}`}
      >
        {LABELS[status]}
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
      />
    </>
  );
}
