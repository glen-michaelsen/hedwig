"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/app/_components/modal";
import { button, buttonGhost, buttonQuiet } from "@/app/_components/ui";
import { deleteSpotlightAction } from "../../actions";

export function DeleteSpotlightButton({
  spotlightId,
  headline,
}: {
  spotlightId: string;
  headline: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const formData = new FormData();
    formData.set("spotlightId", spotlightId);
    startTransition(() => deleteSpotlightAction(formData));
  }

  return (
    <>
      <button
        className={`${buttonGhost} text-rose-700 hover:border-rose-500/40`}
        onClick={() => setOpen(true)}
      >
        Delete article
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${headline}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed text-muted">
            The writing and the rating go. The release and its press kit are
            untouched, and you can write a new Spotlight for it afterwards.
            This can&rsquo;t be undone.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`${button} bg-rose-600 shadow-none hover:bg-rose-500`}
              onClick={confirm}
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete it"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setOpen(false)}
            >
              Keep it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
