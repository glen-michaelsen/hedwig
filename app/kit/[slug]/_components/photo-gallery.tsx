"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/app/_components/modal";
import { actionPill, focusable } from "@/app/_components/ui";
import { formatBytes } from "@/lib/press/assets";

export type GalleryPhoto = {
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
 * The press photos, and what a journalist needs before using one: how big it
 * is in pixels, how heavy the file is, who to credit, and a download that
 * gives the original rather than the resized copy on screen.
 */
export function PhotoGallery({
  photos,
  assetBase,
}: {
  photos: GalleryPhoto[];
  /** `/kit/<slug>/asset` — the id and query are added here. */
  assetBase: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [measured, setMeasured] = useState<
    Record<string, { width: number; height: number }>
  >({});

  const found = photos.find((photo) => photo.id === openId) ?? null;
  const open = found
    ? { ...found, ...(measured[found.id] ?? {}) }
    : null;

  /**
   * Photos uploaded before dimensions were recorded have none, so the panel
   * asks for this one — and only this one, on open. Measuring the whole
   * gallery up front is what took the Worker over its CPU limit.
   */
  useEffect(() => {
    if (!found || found.width !== null || measured[found.id]) return;

    let cancelled = false;
    const id = found.id;

    async function measure() {
      try {
        const response = await fetch(`${assetBase}/${id}/info`);
        if (!response.ok) return;

        const data = (await response.json()) as {
          width?: number | null;
          height?: number | null;
        };
        if (cancelled || !data.width || !data.height) return;

        setMeasured((previous) => ({
          ...previous,
          [id]: { width: data.width as number, height: data.height as number },
        }));
      } catch {
        // The panel simply shows the file size without a pixel size.
      }
    }

    void measure();

    return () => {
      cancelled = true;
    };
  }, [found, assetBase, measured]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <figure key={photo.id} className="min-w-0">
            <button
              type="button"
              onClick={() => setOpenId(photo.id)}
              className={`block w-full overflow-hidden rounded-3xl ${focusable}`}
              aria-label={`Open ${photo.filename}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${assetBase}/${photo.id}?size=md`}
                alt={photo.filename}
                className="aspect-4/3 w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </button>
            {photo.caption && (
              <figcaption className="mt-3 truncate text-xs text-muted">
                Photo: {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Modal
        open={open !== null}
        onClose={() => setOpenId(null)}
        title={open?.filename ?? ""}
        description={open?.caption ? `Photo: ${open.caption}` : undefined}
        size="lg"
      >
        {open && (
          <div className="grid gap-6 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${assetBase}/${open.id}?size=lg`}
              alt={open.filename}
              className="max-h-[70vh] w-full rounded-2xl object-contain"
            />

            <div>
              <dl>
                {open.width && open.height && (
                  <>
                    <Detail
                      label="Dimensions"
                      value={`${open.width} × ${open.height}`}
                    />
                    <Detail
                      label="Aspect"
                      value={(open.width / open.height).toFixed(2).replace(/\.00$/, "") + ":1"}
                    />
                  </>
                )}
                <Detail label="File size" value={formatBytes(open.sizeBytes)} />
                {open.caption && <Detail label="Credit" value={open.caption} />}
              </dl>

              <a
                href={`${assetBase}/${open.id}?download`}
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
        )}
      </Modal>
    </>
  );
}
