"use client";

import { useEffect, useId, type ReactNode } from "react";
import { focusable } from "./ui";

/**
 * Overlay dialog. Escape and backdrop clicks close it, and the page behind
 * is scroll-locked while it's open.
 *
 * `toolbar` sits under the title and outside the scroll area, for search or
 * filters that should stay put while the body scrolls.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  toolbar,
  footer,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  /** "lg" for embedded documents and video, which need the room. */
  size?: "md" | "lg";
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      // Warm scrim rather than flat black — pure black over a cream page
      // reads as a heavy modal, which these aren't.
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/25 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-4xl border border-line bg-surface shadow-float sm:rounded-4xl ${
          size === "lg" ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        <div className="border-b border-line px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-muted">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground ${focusable}`}
            >
              ✕
            </button>
          </div>
          {toolbar}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="border-t border-line px-6 py-4 sm:px-7">{footer}</div>
        )}
      </div>
    </div>
  );
}
