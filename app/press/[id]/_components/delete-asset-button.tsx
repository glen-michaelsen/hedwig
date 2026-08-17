"use client";

import { useState, useTransition } from "react";
import { deleteAssetAction } from "../../actions";
import { Modal } from "@/app/_components/modal";
import { button, buttonQuiet } from "@/app/_components/ui";

export function DeleteAssetButton({
  releaseId,
  assetId,
  filename,
  className,
  label = "Delete",
}: {
  releaseId: string;
  assetId: string;
  filename: string;
  className: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("assetId", assetId);
    startTransition(() => deleteAssetAction(formData));
  }

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Delete “${filename}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed text-muted">
            The file is removed from storage as well, so make sure you have
            your own copy of the master. This can&rsquo;t be undone.
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
