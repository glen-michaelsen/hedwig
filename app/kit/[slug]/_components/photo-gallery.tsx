"use client";

import { ImageViewer, type ViewableImage } from "./image-viewer";

export type GalleryPhoto = ViewableImage;

/** The press photos. Each opens the shared detail panel. */
export function PhotoGallery({
  photos,
  assetBase,
}: {
  photos: GalleryPhoto[];
  /** `/kit/<slug>/asset` — the id and query are added here. */
  assetBase: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <figure key={photo.id} className="min-w-0">
          <ImageViewer
            image={photo}
            assetBase={assetBase}
            label={photo.filename}
            className="block w-full overflow-hidden rounded-3xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${assetBase}/${photo.id}?size=md`}
              alt={photo.filename}
              className="aspect-4/3 w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </ImageViewer>

          {photo.caption && (
            <figcaption className="mt-3 truncate text-xs text-muted">
              Photo: {photo.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
