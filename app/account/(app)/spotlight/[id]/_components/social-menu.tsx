"use client";

import { useRef, useState } from "react";
import { DropdownMenu } from "@/app/_components/dropdown-menu";
import { buttonGhost } from "@/app/_components/ui";

/** Instagram image and caption used to be two separate pills; one "Social"
 *  trigger now carries both, same shape as PublishStatusMenu's dropdown. */
export function SocialMenu({
  spotlightId,
  caption,
}: {
  spotlightId: string;
  caption: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // The dropdown closes the instant an item is picked, so there's no window
  // to swap this to a "Copied" label — the copy itself still succeeds.
  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
    } catch {
      window.prompt("Copy this caption", caption);
    }
  }

  const items = [
    {
      label: "Image",
      onSelect: () =>
        window.open(
          `/account/spotlight/${spotlightId}/image`,
          "_blank",
          "noopener,noreferrer",
        ),
    },
    { label: "Captions", onSelect: copyCaption },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Social — image and caption"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`group inline-flex items-center gap-1.5 ${buttonGhost}`}
      >
        Social
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
