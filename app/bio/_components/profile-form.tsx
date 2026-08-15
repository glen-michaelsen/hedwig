"use client";

import { updateProfileAction } from "../actions";
import { publicImageUrl } from "@/lib/bio/urls";
import {
  Card,
  ErrorText,
  button,
  input,
  inputBase,
  label,
} from "@/app/_components/ui";
import { useAction } from "./use-action";

export function ProfileForm({
  page,
}: {
  page: {
    handle: string;
    title: string;
    tagline: string | null;
    avatarKey: string | null;
  };
}) {
  const { error, pending, saved, onSubmit } = useAction(updateProfileAction);
  const avatar = publicImageUrl(page.avatarKey);

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex items-center gap-5">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-500/12 text-lg font-semibold text-brand-700">
              {page.title.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <label className={label} htmlFor="avatar">
              Photo
            </label>
            <input
              className={`${input} file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/12 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-brand-700`}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="handle">
            Handle
          </label>
          <div className="flex items-stretch">
            <span className={`${inputBase} rounded-r-none border-r-0 text-muted`}>
              /@
            </span>
            <input
              className={`${inputBase} flex-1 rounded-l-none`}
              id="handle"
              name="handle"
              defaultValue={page.handle}
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </div>
          <p className="mt-2 text-xs text-faint">
            Changing this keeps the old address working as a redirect.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="title">
            Display name
          </label>
          <input
            className={input}
            id="title"
            name="title"
            defaultValue={page.title}
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="tagline">
            Tagline
          </label>
          <input
            className={input}
            id="tagline"
            name="tagline"
            defaultValue={page.tagline ?? ""}
            placeholder="Guitar teacher · Copenhagen"
          />
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <div className="flex items-center gap-3">
          <button className={button} disabled={pending}>
            {pending ? "Saving…" : "Save profile"}
          </button>
          {saved && !error && (
            <span className="text-xs text-muted">Saved.</span>
          )}
        </div>
      </form>
    </Card>
  );
}
