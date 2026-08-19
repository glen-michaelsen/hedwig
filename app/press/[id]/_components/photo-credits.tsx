"use client";

import { useState, useTransition } from "react";
import {
  setAllPhotoCaptionsAction,
  setAssetCaptionAction,
} from "../../actions";
import { actionPill, buttonGhost, inputBase } from "@/app/_components/ui";

/**
 * The credit line on one photo, saved on blur.
 *
 * Blur rather than a Save button beside every field: with six photos on
 * screen that would be six buttons, and the value is one short line that
 * nobody edits twice. A field that has unsaved changes says so, so nothing
 * is silently lost either.
 */
function PhotoCredit({
  releaseId,
  assetId,
  value,
  placeholder = "Photo credit",
}: {
  releaseId: string;
  assetId: string;
  value: string;
  /** "Artwork credit" for a cover, where "photo" is the wrong word. */
  placeholder?: string;
}) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(value);
  const [pending, startTransition] = useTransition();

  // A "set on all" from above changes the server value under us; adopt it
  // unless this field is mid-edit.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (text === saved) {
      setText(value);
      setSaved(value);
    }
  }

  function save() {
    if (text === saved) return;
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("assetId", assetId);
    formData.set("caption", text);
    startTransition(async () => {
      await setAssetCaptionAction(formData);
      setSaved(text);
    });
  }

  return (
    <div className="mt-2">
      <input
        className={`${inputBase} w-full !py-2 text-xs`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={200}
      />
      {text !== saved && !pending && (
        <p className="mt-1 text-[11px] text-faint">Unsaved — press Enter</p>
      )}
    </div>
  );
}

export { PhotoCredit };

/** Fills every photo's credit at once, for the usual one-photographer shoot. */
export function SetAllCredits({
  releaseId,
  suggestion,
}: {
  releaseId: string;
  /** Whatever's already on a photo, so the common case is one click. */
  suggestion: string;
}) {
  const [text, setText] = useState(suggestion);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function apply() {
    const formData = new FormData();
    formData.set("releaseId", releaseId);
    formData.set("caption", text);
    startTransition(async () => {
      await setAllPhotoCaptionsAction(formData);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2.5">
      <input
        className={`${inputBase} min-w-0 flex-1 !py-2 text-xs sm:max-w-xs`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Photo credit, e.g. Jane Doe"
        aria-label="Credit for all photos"
        maxLength={200}
      />
      <button
        type="button"
        onClick={apply}
        disabled={pending}
        className={`${buttonGhost} !py-2 text-xs`}
      >
        {done ? "Applied" : pending ? "Applying…" : "Set on all photos"}
      </button>
      <span className={`${actionPill} pointer-events-none border-transparent bg-transparent`}>
        Shown on the public kit
      </span>
    </div>
  );
}
