"use client";

import { useState, useTransition } from "react";
import { deleteIdeaAction } from "../actions";
import { Modal } from "@/app/_components/modal";
import { button, buttonQuiet } from "@/app/_components/ui";

/** For spam and duplicates. Anything worth keeping should be declined instead. */
export function DeleteIdeaButton({
  ideaId,
  title,
  className,
}: {
  ideaId: string;
  title: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const formData = new FormData();
    formData.set("ideaId", ideaId);
    startTransition(() => deleteIdeaAction(formData));
  }

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        Delete
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${title}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed text-muted">
            This removes it for good. If it&rsquo;s a real idea you simply
            won&rsquo;t build, mark it{" "}
            <span className="text-foreground">Not for now</span> instead — that
            keeps the record of someone having asked.
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
