"use client";

import { useEffect, useState } from "react";
import { actionPill } from "@/app/_components/ui";

/** Whether this browser can hand image files to the share sheet (phones, mostly). */
function canShareImages() {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
  try {
    return navigator.canShare({ files: [new File([""], "story.jpg", { type: "image/jpeg" })] });
  } catch {
    return false;
  }
}

/**
 * On a phone, opens the share sheet with the story attached: "Save Image"
 * puts it in Photos, and Instagram is right there too. A plain download
 * would land in Files instead. Safari only opens the sheet straight after
 * a tap, so the image is fetched ahead of it. Elsewhere it's a download.
 *
 * `name` is the file name without its extension, which follows the image type.
 */
export function SaveStoryButton({ src, name }: { src: string; name: string }) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!canShareImages()) return;
    const controller = new AbortController();
    fetch(src, { signal: controller.signal })
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!blob) return;
        const type = blob.type || "image/jpeg";
        setFile(new File([blob], `${name}.${type === "image/png" ? "png" : "jpg"}`, { type }));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [src, name]);

  if (file) {
    return (
      <button
        type="button"
        className={actionPill}
        onClick={() => {
          navigator.share({ files: [file] }).catch(() => {
            // Closing the sheet rejects too; nothing to do either way.
          });
        }}
      >
        Save
      </button>
    );
  }

  return (
    <a href={`${src}?download`} download className={actionPill}>
      Download
    </a>
  );
}
