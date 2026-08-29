"use client";

import { useRef, useState, useTransition } from "react";
import { toggleReleasePublishedAction } from "../../actions";
import { DropdownMenu } from "@/app/_components/dropdown-menu";
import { focusable } from "@/app/_components/ui";

/**
 * The publish toggle and the "share this" actions (view, copy link) used to
 * be a button plus a separate card repeating the same link. One pill now
 * carries both: its color is the status, and its dropdown is everything
 * you'd do about it.
 */
export function PublishStatusMenu({
  releaseId,
  published,
  shareUrl,
}: {
  releaseId: string;
  published: boolean;
  shareUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [, startTransition] = useTransition();

  function setPublished(next: boolean) {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("published", next ? "1" : "0");
    startTransition(() => toggleReleasePublishedAction(formData));
  }

  // The dropdown closes the instant an item is picked, so there's no
  // window to swap this label to "Copied" the way the standalone CopyLink
  // button does — the copy itself still succeeds.
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  }

  const items = published
    ? [
        {
          label: "View",
          onSelect: () => window.open(shareUrl, "_blank", "noopener,noreferrer"),
        },
        { label: "Copy link", onSelect: copyLink },
        { label: "Unpublish", danger: true, onSelect: () => setPublished(false) },
      ]
    : [{ label: "Publish", onSelect: () => setPublished(true) }];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={published ? "Published — manage" : "Unpublished — manage"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        // `group` + `aria-expanded` is what turns the chevron, no open
        // state needed beyond what's already on this element.
        className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${focusable} ${
          published
            ? "bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/18 dark:text-emerald-300"
            : "bg-rose-500/12 text-rose-700 hover:bg-rose-500/18 dark:text-rose-300"
        }`}
      >
        {published ? "Published" : "Unpublished"}
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
