"use client";

import type { ReactNode } from "react";

/**
 * A link that tells us it was clicked without delaying the navigation.
 * sendBeacon is fire-and-forget by design; if it isn't available we fall
 * back to a keepalive fetch and still never await it.
 */
export function TrackedLink({
  blockId,
  href,
  className,
  children,
}: {
  blockId: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  function track() {
    const body = JSON.stringify({ blockId });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/bio/click",
          new Blob([body], { type: "application/json" }),
        );
        return;
      }
      void fetch("/api/bio/click", {
        method: "POST",
        body,
        headers: { "content-type": "application/json" },
        keepalive: true,
      });
    } catch {
      // Counting is a nice-to-have; never get in the way of the click.
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      onClick={track}
    >
      {children}
    </a>
  );
}
