"use client";

import { useState, useTransition } from "react";
import { buttonGhost } from "@/app/_components/ui";
import { sendSpotlightTestEmailAction } from "../../actions";

type Kind = "planned" | "published";

const LABELS: Record<Kind, string> = {
  planned: "Send the planned email to me",
  published: "Send the published email to me",
};

/** Sends either email to the admin's own inbox, for testing and forwarding. */
export function EmailTestButtons({ spotlightId }: { spotlightId: string }) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<Kind | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function send(kind: Kind) {
    setBusy(kind);
    setMessage(null);
    startTransition(async () => {
      const result = await sendSpotlightTestEmailAction(spotlightId, kind);
      setMessage("error" in result ? result.error : `Sent to ${result.sentTo}.`);
      setBusy(null);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {(["planned", "published"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            disabled={pending}
            onClick={() => send(kind)}
            className={buttonGhost}
          >
            {busy === kind ? "Sending…" : LABELS[kind]}
          </button>
        ))}
      </div>
      {message && (
        <p role="status" className="mt-3 text-sm text-muted">
          {message}
        </p>
      )}
    </div>
  );
}
