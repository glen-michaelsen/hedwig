"use client";

import { useState } from "react";
import { getPreviewLinkAction } from "../../actions";
import { buttonGhost } from "@/app/_components/ui";

/**
 * Unlike the other CopyLink-family buttons, the link isn't known up front —
 * the token is generated (once) on first click, so this calls the action
 * directly from onClick rather than copying a prop that was already there.
 */
export function CopyPreviewLinkButton({ spotlightId }: { spotlightId: string }) {
  const [label, setLabel] = useState("Copy preview link");

  async function copy() {
    const result = await getPreviewLinkAction(spotlightId);

    if ("error" in result) {
      setLabel("Couldn't create link");
    } else {
      try {
        await navigator.clipboard.writeText(result.link);
        setLabel("Copied");
      } catch {
        window.prompt("Copy this link", result.link);
      }
    }

    setTimeout(() => setLabel("Copy preview link"), 2000);
  }

  return (
    <button type="button" onClick={copy} className={buttonGhost}>
      {label}
    </button>
  );
}
