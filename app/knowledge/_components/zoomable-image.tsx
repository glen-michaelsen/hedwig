"use client";

import { useState } from "react";
import { Modal } from "@/app/_components/modal";
import { focusable } from "@/app/_components/ui";

/**
 * A small diagram that opens larger in a modal on click/tap — the on-page
 * thumbnail is deliberately small enough to sit in a grid, but a beginner
 * squinting at finger placement on a phone needs to be able to see it
 * bigger. Reused by chord diagrams and the finger-numbering illustration.
 */
export function ZoomableImage({
  src,
  alt,
  width,
  height,
  title,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${title} larger`}
        className={`block cursor-zoom-in transition-transform hover:scale-[1.03] ${focusable} rounded-xl ${className ?? ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="h-auto w-full"
        />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <div className="flex items-center justify-center px-6 py-8 sm:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full max-w-xs"
          />
        </div>
      </Modal>
    </>
  );
}
