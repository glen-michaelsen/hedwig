"use client";

import { useState, useTransition } from "react";
import { deleteMaterialAction } from "../../actions";
import { Modal } from "@/app/_components/modal";
import { button, buttonQuiet } from "@/app/_components/ui";

/**
 * Deleting a material detaches it from every lesson note and shelf it was on
 * — the database cascades — so the confirmation says exactly what that means
 * before you commit to it. The lessons themselves are untouched.
 */
export function DeleteMaterialButton({
  materialId,
  title,
  lessonCount,
  shelfCount,
  className,
  label = "Delete",
}: {
  materialId: string;
  title: string;
  lessonCount: number;
  shelfCount: number;
  className: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const formData = new FormData();
    formData.set("materialId", materialId);
    startTransition(() => deleteMaterialAction(formData));
  }

  const attachments = [
    lessonCount > 0 &&
      `${lessonCount} lesson ${lessonCount === 1 ? "note" : "notes"}`,
    shelfCount > 0 && `${shelfCount} ${shelfCount === 1 ? "shelf" : "shelves"}`,
  ].filter(Boolean) as string[];

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${title}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          {attachments.length > 0 ? (
            <>
              <p className="text-sm leading-relaxed">
                It&rsquo;s currently on {attachments.join(" and ")}. Deleting it
                removes it from {attachments.length > 1 ? "those" : "there"}{" "}
                too.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                The lesson notes themselves stay exactly as they are — they
                just lose this attachment. Students will no longer see it.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              It isn&rsquo;t attached to any lesson or shelf, so nothing else
              changes.
            </p>
          )}

          <p className="text-sm leading-relaxed text-muted">
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
