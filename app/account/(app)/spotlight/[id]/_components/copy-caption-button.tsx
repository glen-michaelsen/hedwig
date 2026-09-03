"use client";

import { useState } from "react";
import { buttonGhost } from "@/app/_components/ui";

/** Same small clipboard component every section keeps a local copy of
 *  (press's, musicians') — copies plain text here rather than a link. */
export function CopyCaptionButton({ caption }: { caption: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this caption", caption);
    }
  }

  return (
    <button type="button" onClick={copy} className={buttonGhost}>
      {copied ? "Copied" : "Copy caption"}
    </button>
  );
}
