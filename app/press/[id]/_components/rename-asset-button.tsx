"use client";

import { useState, useTransition } from "react";
import { renameAssetAction } from "../../actions";
import { Modal } from "@/app/_components/modal";
import {
  button,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

/** Renames what the file is called on the page, not the file itself. */
export function RenameAssetButton({
  releaseId,
  assetId,
  filename,
  title,
  className,
}: {
  releaseId: string;
  assetId: string;
  filename: string;
  title: string | null;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        Rename
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Rename">
        <form
          action={(formData) => {
            formData.set("releaseId", releaseId);
            formData.set("assetId", assetId);
            startTransition(async () => {
              await renameAssetAction(formData);
              setOpen(false);
            });
          }}
          className="space-y-4 px-6 py-6 sm:px-7"
        >
          <div>
            <label className={label} htmlFor={`title-${assetId}`}>
              Name
            </label>
            <input
              className={input}
              id={`title-${assetId}`}
              name="title"
              defaultValue={title ?? ""}
              placeholder={filename}
              maxLength={200}
              autoFocus
            />
            <p className="mt-2 text-xs text-faint">
              Leave empty to use the file name. Downloads keep the file type.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className={button} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
