"use client";

import { useState } from "react";
import { actionPill } from "@/app/_components/ui";

/**
 * Copies a link to somewhere other than the current page, which is why it
 * takes the URL as a prop rather than reading window.location like the
 * Spotlight share box does.
 *
 * The URL is built on the server from APP_URL so the copied link is the
 * public one, not whatever host the admin happens to be signed in on.
 */
export function CopyLink({
  url,
  className = actionPill,
  label = "Copy link",
}: {
  url: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, or the user said no). Select the
      // text instead so it can still be copied by hand.
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? "Copied" : label}
    </button>
  );
}
