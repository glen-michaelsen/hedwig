"use client";

import { useState, useTransition } from "react";
import { deleteReleaseAction } from "../../../actions";
import { Modal } from "@/app/_components/modal";
import { button, buttonGhost, buttonQuiet } from "@/app/_components/ui";

export function DeleteReleaseButton({
  releaseId,
  title,
}: {
  releaseId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    startTransition(() => deleteReleaseAction(formData));
  }

  return (
    <>
      <button
        className={`${buttonGhost} text-rose-700 hover:border-rose-500/40`}
        onClick={() => setOpen(true)}
      >
        Delete release
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${title}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed">
            Every file attached to this release goes with it — the cover, the
            press photos, the audio and the documents.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            Make sure your masters exist somewhere else first. This
            can&rsquo;t be undone.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`${button} bg-rose-600 shadow-none hover:bg-rose-500`}
              onClick={confirm}
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete everything"}
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
