"use client";

import { useState, useTransition } from "react";
import {
  setAllPhotoCaptionsAction,
  setAssetCaptionAction,
} from "../../actions";
import { Modal } from "@/app/_components/modal";
import {
  actionPill,
  button,
  buttonGhost,
  buttonQuiet,
  focusable,
  input,
  label,
} from "@/app/_components/ui";
import { DeleteAssetButton } from "./delete-asset-button";

/**
 * One press photo.
 *
 * The credit reads as plain text and only becomes a field when clicked, so a
 * shoot of six photos is six lines of a photographer's name rather than six
 * open inputs and a toolbar. The file name lives in the image's tooltip: it
 * matters when matching a delivery folder, and never otherwise.
 */
export function PhotoCard({
  releaseId,
  photo,
  src,
  href,
}: {
  releaseId: string;
  photo: { id: string; filename: string; caption: string | null };
  src: string;
  /** Full-size view. */
  href: string;
}) {
  return (
    <figure className="group min-w-0">
      <div className="relative overflow-hidden rounded-2xl">
        <a href={href} target="_blank" rel="noreferrer" className={focusable}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={photo.caption ?? "Press photo"}
            title={photo.filename}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </a>

        {/* The two actions ride on the image, so the grid below stays a
            single quiet line per photo. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-linear-to-t from-black/55 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <a
            href={`${href.split("?")[0]}?download`}
            className={`${actionPill} pointer-events-auto border-transparent bg-white/90 text-foreground hover:bg-white`}
          >
            Download
          </a>
          <span className="pointer-events-auto">
            <DeleteAssetButton
              releaseId={releaseId}
              assetId={photo.id}
              filename={photo.filename}
              className={`${actionPill} border-transparent bg-white/90 text-foreground hover:bg-white hover:text-rose-700`}
            />
          </span>
        </div>
      </div>

      <figcaption className="mt-2.5">
        <CreditEditor
          releaseId={releaseId}
          assetId={photo.id}
          filename={photo.filename}
          caption={photo.caption}
          allowApplyAll
        />
      </figcaption>
    </figure>
  );
}

/**
 * The credit, as a line of text that becomes a field only when clicked.
 *
 * Six photos used to mean six open inputs and a toolbar above them; this is
 * six lines of a photographer's name. "Apply to all photos" lives in the
 * dialog because one shoot usually has one photographer, and offering it
 * only there keeps the grid quiet.
 */
export function CreditEditor({
  releaseId,
  assetId,
  filename,
  caption,
  allowApplyAll = false,
  emptyLabel = "Add credit",
}: {
  releaseId: string;
  assetId: string;
  filename: string;
  caption: string | null;
  allowApplyAll?: boolean;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(caption ?? "");
  const [pending, startTransition] = useTransition();

  function save(all: boolean) {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("assetId", assetId);
    formData.set("caption", text);

    startTransition(async () => {
      await (all
        ? setAllPhotoCaptionsAction(formData)
        : setAssetCaptionAction(formData));
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full items-center gap-1.5 rounded-xl px-1 py-1 text-left text-xs transition-colors hover:bg-surface-muted ${focusable}`}
      >
        <span
          className={`min-w-0 truncate ${caption ? "text-muted" : "text-faint"}`}
        >
          {caption ? `Photo: ${caption}` : emptyLabel}
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-faint"
        >
          <path
            d="M13.5 4.5l2 2M4 16l.6-2.6 8-8 2 2-8 8L4 16Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Credit">
        <div className="space-y-4 px-6 py-6 sm:px-7">
          <div>
            <label className={label} htmlFor={`credit-${assetId}`}>
              Credit
            </label>
            <input
              className={input}
              id={`credit-${assetId}`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="e.g. Christian Krog"
              maxLength={200}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  save(false);
                }
              }}
            />
            <p className="mt-2 truncate text-xs text-faint">{filename}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={button}
              disabled={pending}
              onClick={() => save(false)}
            >
              {pending ? "Saving…" : "Apply"}
            </button>
            {allowApplyAll && (
              <button
                type="button"
                className={buttonGhost}
                disabled={pending}
                onClick={() => save(true)}
              >
                Apply to all photos
              </button>
            )}
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
