"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "@/app/_components/modal";
import { actionPill, focusable } from "@/app/_components/ui";
import { formatBytes } from "@/lib/press/assets";

export type ViewableImage = {
  id: string;
  filename: string;
  caption: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-xs uppercase tracking-[0.08em] text-faint">{label}</dt>
      <dd className="text-sm tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * One image, with the details a journalist needs before using it: pixel
 * size, file weight, who to credit, and a download of the original rather
 * than the resized copy on screen.
 *
 * The trigger is whatever you pass as children, so a cover and a gallery
 * tile share this without sharing a layout.
 */
export function ImageViewer({
  image,
  assetBase,
  children,
  className = "",
  label,
}: {
  image: ViewableImage;
  /** `/kit/<slug>/asset` — the id and query are added here. */
  assetBase: string;
  children: ReactNode;
  className?: string;
  /** What this image is, for the button's accessible name. */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [measured, setMeasured] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const width = image.width ?? measured?.width ?? null;
  const height = image.height ?? measured?.height ?? null;

  /**
   * Images uploaded before dimensions were recorded have none, so this asks
   * for them — on open, for this one image. Measuring a whole gallery during
   * a page render is what took the Worker past its CPU limit.
   */
  useEffect(() => {
    if (!open || width !== null) return;

    let cancelled = false;

    async function measure() {
      try {
        const response = await fetch(`${assetBase}/${image.id}/info`);
        if (!response.ok) return;

        const data = (await response.json()) as {
          width?: number | null;
          height?: number | null;
        };
        if (cancelled || !data.width || !data.height) return;
        setMeasured({ width: data.width, height: data.height });
      } catch {
        // The panel shows file size alone rather than an error.
      }
    }

    void measure();
    return () => {
      cancelled = true;
    };
  }, [open, width, image.id, assetBase]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${label}`}
        className={`${focusable} ${className}`}
      >
        {children}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={image.filename}
        description={image.caption ? `Photo: ${image.caption}` : undefined}
        size="lg"
      >
        <div className="grid gap-6 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${assetBase}/${image.id}?size=lg`}
            alt={image.filename}
            className="max-h-[70vh] w-full rounded-2xl object-contain"
          />

          <div>
            <dl>
              {width && height && (
                <>
                  <Detail label="Dimensions" value={`${width} × ${height}`} />
                  <Detail
                    label="Aspect"
                    value={`${(width / height).toFixed(2).replace(/\.00$/, "")}:1`}
                  />
                </>
              )}
              <Detail label="File size" value={formatBytes(image.sizeBytes)} />
              {image.caption && <Detail label="Credit" value={image.caption} />}
            </dl>

            <a
              href={`${assetBase}/${image.id}?download`}
              className={`${actionPill} mt-5`}
            >
              Download original
            </a>
            <p className="mt-3 text-xs leading-relaxed text-faint">
              The download is the file as supplied. The image above is a
              resized copy for the web.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
