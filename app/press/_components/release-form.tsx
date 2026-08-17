"use client";

import { useActionState, useState } from "react";
import type { ReleaseFormState } from "../actions";
import {
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";

export type ArtistOption = { id: string; name: string };

export type ReleaseDefaults = {
  id?: string;
  artistId?: string;
  title?: string;
  kind?: "single" | "ep" | "album";
  url?: string | null;
  releaseDate?: string | null;
  notes?: string | null;
};

const NEW_ARTIST = "__new__";

export function ReleaseForm({
  action,
  artists,
  defaults,
  submitLabel,
}: {
  action: (
    state: ReleaseFormState,
    formData: FormData,
  ) => Promise<ReleaseFormState>;
  artists: ArtistOption[];
  defaults?: ReleaseDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    ReleaseFormState,
    FormData
  >(action, {});

  // With no artists yet there is nothing to pick, so the form opens on the
  // "new artist" field rather than an empty dropdown.
  const [artistChoice, setArtistChoice] = useState(
    defaults?.artistId ?? (artists.length > 0 ? artists[0].id : NEW_ARTIST),
  );

  return (
    <form action={formAction} className="space-y-5">
      {defaults?.id && (
        <input type="hidden" name="releaseId" value={defaults.id} />
      )}

      <div>
        <label className={label} htmlFor="artistId">
          Artist
        </label>
        <select
          className={input}
          id="artistId"
          name="artistId"
          value={artistChoice}
          onChange={(event) => setArtistChoice(event.target.value)}
        >
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
          <option value={NEW_ARTIST}>+ New artist…</option>
        </select>

        {artistChoice === NEW_ARTIST && (
          <input
            className={`${input} mt-3`}
            name="newArtist"
            placeholder="Artist name"
            aria-label="New artist name"
            required
          />
        )}
      </div>

      <div>
        <label className={label} htmlFor="title">
          Title
        </label>
        <input
          className={input}
          id="title"
          name="title"
          defaultValue={defaults?.title ?? ""}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="kind">
            Type
          </label>
          <select
            className={input}
            id="kind"
            name="kind"
            defaultValue={defaults?.kind ?? "single"}
          >
            <option value="single">Single</option>
            <option value="ep">EP</option>
            <option value="album">Album</option>
          </select>
        </div>

        <div>
          <label className={label} htmlFor="releaseDate">
            Release date
          </label>
          <input
            className={input}
            id="releaseDate"
            name="releaseDate"
            type="date"
            defaultValue={defaults?.releaseDate ?? ""}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="url">
          Link{" "}
          <span className="font-normal normal-case tracking-normal text-faint">
            (optional)
          </span>
        </label>
        <input
          className={input}
          id="url"
          name="url"
          type="url"
          placeholder="https://lnk.to/…"
          defaultValue={defaults?.url ?? ""}
        />
      </div>

      <div>
        <label className={label} htmlFor="notes">
          Notes{" "}
          <span className="font-normal normal-case tracking-normal text-faint">
            (optional)
          </span>
        </label>
        <textarea
          className={`${input} min-h-24 resize-y`}
          id="notes"
          name="notes"
          placeholder="Anything press should know"
          defaultValue={defaults?.notes ?? ""}
        />
      </div>

      {state.error && <ErrorText>{state.error}</ErrorText>}

      <button className={button} disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
