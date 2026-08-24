"use client";

import { useState } from "react";
import { actionPill } from "@/app/_components/ui";

/** Same small component as press/bio's own — kept local per the pattern already established for it. */
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
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? "Copied" : label}
    </button>
  );
}
