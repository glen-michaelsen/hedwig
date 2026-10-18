"use client";

import { useEffect, useState, type ReactNode } from "react";
import { actionPill } from "./ui";

/**
 * Whether to use the share sheet: a touch device whose browser can hand it
 * image files. Desktop browsers can share too, but there a download is what
 * people expect.
 */
function canShareImages() {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
  if (!window.matchMedia("(pointer: coarse)").matches) return false;
  try {
    return navigator.canShare({ files: [new File([""], "image.jpg", { type: "image/jpeg" })] });
  } catch {
    return false;
  }
}

/**
 * Saving a generated image so it's ready to post. On a phone that means
 * the share sheet with the image attached: "Save Image" puts it in Photos,
 * and Instagram is right there too, where a plain download would land in
 * Files. Safari only opens the sheet straight after a tap, so the image is
 * fetched ahead of it. Elsewhere it's an ordinary download (`?download`).
 *
 * `name` is the file name without its extension, which follows the image type.
 */
export function useSaveImage(src: string, name: string) {
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

  return {
    /** "Save" where it opens the share sheet, "Download" where it downloads. */
    label: file ? "Save" : "Download",
    save() {
      if (file) {
        // Closing the sheet rejects too; nothing to do either way.
        navigator.share({ files: [file] }).catch(() => {});
        return;
      }
      const link = document.createElement("a");
      link.href = `${src}${src.includes("?") ? "&" : "?"}download`;
      link.download = "";
      link.click();
    },
  };
}

export function SaveImageButton({
  src,
  name,
  className = actionPill,
  children,
}: {
  src: string;
  name: string;
  className?: string;
  /** Replaces the label; it's "Save" or "Download" otherwise. */
  children?: ReactNode;
}) {
  const { label, save } = useSaveImage(src, name);
  return (
    <button type="button" className={className} onClick={save}>
      {children ?? label}
    </button>
  );
}
