"use client";

import type { ReactNode } from "react";

/**
 * Fire-and-forget event reporting. `keepalive` matters on the outbound link:
 * the page is being navigated away from, and a normal fetch would be
 * cancelled before it left.
 */
export function sendKitEvent(
  slug: string,
  kind: "play" | "photo" | "link",
  assetId?: string,
) {
  try {
    void fetch(`/kit/${slug}/event`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, assetId }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Counting is never worth breaking the page for.
  }
}

/** An outbound link that reports the click on its way out. */
export function TrackedLink({
  slug,
  href,
  className,
  children,
}: {
  slug: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      onClick={() => sendKitEvent(slug, "link")}
    >
      {children}
    </a>
  );
}
