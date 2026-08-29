"use client";

import { useActionState, useState } from "react";
import type { ReleaseFormState } from "../actions";
import {
  ErrorText,
  SectionTitle,
  button,
  input,
  label,
} from "@/app/_components/ui";
import { TagPicker } from "@/app/_components/tag-picker";
import {
  GENRES,
  GENRE_MAX,
  MOODS,
  MOOD_MAX,
  LANGUAGES,
  LABEL_STATUSES,
  NORDIC_COUNTRIES,
  OTHER_COUNTRIES,
} from "@/lib/press/taxonomy";

export type ArtistOption = { id: string; name: string };

export type ReleaseDefaults = {
  id?: string;
  artistId?: string;
  title?: string;
  kind?: "single" | "ep" | "album";
  url?: string | null;
  releaseDate?: string | null;
  notes?: string | null;
  genre?: string[];
  mood?: string[];
  country?: string | null;
  city?: string | null;
  language?: string | null;
  labelStatus?: string | null;
};

const NEW_ARTIST = "__new__";

type ArtistTags = {
  country: string | null;
  city: string | null;
  labelStatus: string | null;
};

export function ReleaseForm({
  action,
  artists,
  artistDefaults,
  defaults,
  submitLabel,
}: {
  action: (
    state: ReleaseFormState,
    formData: FormData,
  ) => Promise<ReleaseFormState>;
  artists: ArtistOption[];
  /** Latest country/city/label status per artist, for prefilling a new release. */
  artistDefaults?: Record<string, ArtistTags | null>;
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

  // Editing a specific release always shows what it actually has saved —
  // only a brand-new release inherits from the chosen artist's last one.
  const isEditing = Boolean(defaults?.id);
  const inherited = isEditing ? null : artistDefaults?.[artistChoice];
  const effectiveCountry = isEditing ? (defaults?.country ?? "") : (inherited?.country ?? "");
  const effectiveCity = isEditing ? (defaults?.city ?? "") : (inherited?.city ?? "");
  const effectiveLabelStatus = isEditing
    ? (defaults?.labelStatus ?? "")
    : (inherited?.labelStatus ?? "");

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
        <SectionTitle hint="Self-tagged, so releases can be found by genre, mood and market later.">
          Help people find this
        </SectionTitle>

        <div className="space-y-5">
          <TagPicker
            name="genre"
            heading="Genre"
            options={[...GENRES]}
            max={GENRE_MAX}
            allowCustom={false}
            defaultSelected={defaults?.genre ?? []}
          />

          <TagPicker
            name="mood"
            heading="Mood / vibe"
            options={[...MOODS]}
            max={MOOD_MAX}
            allowCustom={false}
            defaultSelected={defaults?.mood ?? []}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="country">
                Country{" "}
                <span className="font-normal normal-case tracking-normal text-faint">
                  (optional)
                </span>
              </label>
              <select
                key={`country-${artistChoice}`}
                className={input}
                id="country"
                name="country"
                defaultValue={effectiveCountry}
              >
                <option value="">Not specified</option>
                <optgroup label="Nordic">
                  {NORDIC_COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {OTHER_COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className={label} htmlFor="city">
                City{" "}
                <span className="font-normal normal-case tracking-normal text-faint">
                  (optional)
                </span>
              </label>
              <input
                key={`city-${artistChoice}`}
                className={input}
                id="city"
                name="city"
                placeholder="Copenhagen"
                defaultValue={effectiveCity}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="language">
                Language{" "}
                <span className="font-normal normal-case tracking-normal text-faint">
                  (optional)
                </span>
              </label>
              <select
                className={input}
                id="language"
                name="language"
                defaultValue={defaults?.language ?? ""}
              >
                <option value="">Not specified</option>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label} htmlFor="labelStatus">
                Label status{" "}
                <span className="font-normal normal-case tracking-normal text-faint">
                  (optional)
                </span>
              </label>
              <select
                key={`labelStatus-${artistChoice}`}
                className={input}
                id="labelStatus"
                name="labelStatus"
                defaultValue={effectiveLabelStatus}
              >
                <option value="">Not specified</option>
                {LABEL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
