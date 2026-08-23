"use client";

import { useState, useTransition } from "react";
import { deleteGigAction, duplicateGigAction } from "../actions";
import { OverflowMenu } from "./overflow-menu";
import { Modal } from "@/app/_components/modal";
import { button, buttonQuiet } from "@/app/_components/ui";

/** Duplicate and delete for a row in the gig list — always visible, so it works with a tap, not just a hover. */
export function GigRowMenu({
  gigId,
  gigName,
}: {
  gigId: string;
  gigName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function act(action: (formData: FormData) => Promise<void>) {
    const formData = new FormData();
    formData.set("gigId", gigId);
    startTransition(() => action(formData));
  }

  return (
    <>
      <OverflowMenu
        label={`Actions for ${gigName}`}
        items={[
          { label: "Duplicate", onSelect: () => act(duplicateGigAction) },
          {
            label: "Delete",
            danger: true,
            onSelect: () => setConfirming(true),
          },
        ]}
      />

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Delete “${gigName}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed text-muted">
            The sets and every song in them go with it. This can&rsquo;t be
            undone.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`${button} bg-rose-600 shadow-none hover:bg-rose-500`}
              disabled={pending}
              onClick={() => act(deleteGigAction)}
            >
              {pending ? "Deleting…" : "Delete it"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setConfirming(false)}
            >
              Keep it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
