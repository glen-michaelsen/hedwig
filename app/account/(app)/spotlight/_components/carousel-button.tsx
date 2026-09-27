"use client";

import { useState } from "react";
import { Modal } from "@/app/_components/modal";
import { ErrorText, button, buttonGhost, buttonQuiet, input, label } from "@/app/_components/ui";
import { CAROUSEL_DEFAULT_PAGES, CAROUSEL_MAX_PAGES } from "@/lib/spotlight/carousel";

/**
 * Downloads a PDF of the newest Spotlight share images, one per page, for a
 * LinkedIn document ("carousel") post. Fetched rather than linked, so the
 * dialog can say it's working while any missing images are made.
 */
export function CarouselButton({ liveCount }: { liveCount: number }) {
  const [open, setOpen] = useState(false);
  const max = Math.max(1, Math.min(CAROUSEL_MAX_PAGES, liveCount));
  const [count, setCount] = useState(Math.min(CAROUSEL_DEFAULT_PAGES, max));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/account/spotlight/carousel?count=${count}`);
      if (!response.ok) throw new Error(await response.text());

      const name =
        response.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ??
        "trenodo-spotlight.pdf";
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setOpen(false);
    } catch {
      setError("The PDF didn't come through. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={buttonGhost}
        onClick={() => setOpen(true)}
        disabled={liveCount === 0}
        title={liveCount === 0 ? "No live Spotlights yet" : undefined}
      >
        LinkedIn PDF
      </button>

      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title="LinkedIn carousel PDF"
        description="One Spotlight image per page, newest first. Upload it to LinkedIn as a document, and it shows as a swipeable carousel."
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <div>
            <label className={label} htmlFor="carousel-count">
              How many of the newest Spotlights?
            </label>
            <select
              id="carousel-count"
              className={input}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              disabled={busy}
            >
              {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Spotlight" : "Spotlights"}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-faint">
              Only live articles, {liveCount} right now. Up to {CAROUSEL_MAX_PAGES} per PDF.
            </p>
          </div>

          {error && <ErrorText>{error}</ErrorText>}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={button} onClick={download} disabled={busy}>
              {busy ? "Making your PDF…" : "Download PDF"}
            </button>
            <button type="button" className={buttonQuiet} onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
