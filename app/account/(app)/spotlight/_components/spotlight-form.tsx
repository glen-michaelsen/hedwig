"use client";

import { useActionState, useState } from "react";
import { HeartShape } from "@/app/_components/hearts";
import {
  ErrorText,
  button,
  focusable,
  input,
  label,
} from "@/app/_components/ui";
import { MAX_RATING, slugify } from "@/lib/spotlight/slug";
import { HeaderPosition } from "./header-position";
import type { SpotlightFormState } from "../actions";

export type PhotoOption = { id: string; filename: string };

export type SpotlightDefaults = {
  id?: string;
  headline?: string;
  body?: string;
  rating?: number;
  headerAssetId?: string | null;
  headerFocusX?: number;
  headerFocusY?: number;
};

function RatingPicker({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value;

  return (
    <div className="flex items-center gap-3">
      <input type="hidden" name="rating" value={value} />
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: MAX_RATING }, (_, index) => {
          const heart = index + 1;
          return (
            <button
              key={heart}
              type="button"
              onClick={() => onChange(heart)}
              onMouseEnter={() => setHovered(heart)}
              aria-label={`${heart} of ${MAX_RATING} hearts`}
              aria-pressed={value === heart}
              className={`rounded-full p-1 text-brand-600 transition-transform hover:scale-110 dark:text-brand-300 ${
                heart <= shown ? "" : "opacity-25"
              } ${focusable}`}
            >
              <HeartShape filled={heart <= shown} className="h-7 w-7" />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-muted tabular-nums">
        {value} / {MAX_RATING}
      </span>
    </div>
  );
}

export function SpotlightForm({
  action,
  releaseId,
  photos,
  defaults,
  submitLabel,
}: {
  action: (
    state: SpotlightFormState,
    formData: FormData,
  ) => Promise<SpotlightFormState>;
  releaseId: string;
  photos: PhotoOption[];
  defaults?: SpotlightDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    SpotlightFormState,
    FormData
  >(action, {});

  const [headline, setHeadline] = useState(defaults?.headline ?? "");
  const [rating, setRating] = useState(defaults?.rating ?? 4);
  const [headerAssetId, setHeaderAssetId] = useState(
    defaults?.headerAssetId ?? "",
  );
  const [focus, setFocus] = useState({
    x: defaults?.headerFocusX ?? 50,
    y: defaults?.headerFocusY ?? 50,
  });

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="releaseId" value={releaseId} />
      {defaults?.id && (
        <input type="hidden" name="spotlightId" value={defaults.id} />
      )}

      <div>
        <label className={label} htmlFor="headline">
          Headline
        </label>
        <input
          className={input}
          id="headline"
          name="headline"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          maxLength={160}
          required
        />
        {headline.trim().length > 0 && (
          <p className="mt-2 truncate text-xs text-faint">
            /spotlight/{slugify(headline)}
          </p>
        )}
      </div>

      <div>
        <label className={label}>Header photo</label>
        {photos.length === 0 ? (
          <p className="text-sm text-muted">
            This release has no press photos yet. Add some in the press kit and
            they&rsquo;ll appear here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => {
              const selected = headerAssetId === photo.id;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    setHeaderAssetId(selected ? "" : photo.id);
                    setFocus({ x: 50, y: 50 });
                  }}
                  aria-pressed={selected}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-colors ${
                    selected
                      ? "border-brand-500"
                      : "border-transparent hover:border-line-strong"
                  } ${focusable}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/spotlight/image/${photo.id}?size=sm`}
                    alt={photo.filename}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {selected && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                      Header
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <input type="hidden" name="headerAssetId" value={headerAssetId} />

        {/* Reposition only once there's something to reposition. A new
            header starts centred, which is right more often than not. */}
        {headerAssetId && (
          <div className="mt-5">
            <p className="mb-2 text-xs text-muted">
              How it will crop at the top of the article
            </p>
            <HeaderPosition
              src={`/spotlight/image/${headerAssetId}?size=md`}
              x={focus.x}
              y={focus.y}
              onChange={setFocus}
            />
          </div>
        )}
      </div>

      <div>
        <label className={label}>Rating</label>
        <RatingPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label className={label} htmlFor="body">
          Article
        </label>
        <textarea
          className={`${input} min-h-72 resize-y leading-relaxed`}
          id="body"
          name="body"
          defaultValue={defaults?.body ?? ""}
          placeholder="Write the piece. Leave a blank line between paragraphs."
          required
        />
        <p className="mt-2 text-xs text-faint">
          Plain text — a blank line starts a new paragraph.
        </p>
      </div>

      {state.error && <ErrorText>{state.error}</ErrorText>}

      <button className={button} disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
