"use client";

import { saveSocialsAction } from "../actions";
import { SOCIAL_PLATFORMS } from "@/lib/bio/socials";
import { Card, ErrorText, button, input } from "@/app/_components/ui";
import { useAction } from "./use-action";

export function SocialsForm({
  socials,
}: {
  socials: { platform: string; url: string }[];
}) {
  const { error, pending, saved, onSubmit } = useAction(saveSocialsAction);
  const byPlatform = new Map(socials.map((s) => [s.platform, s.url]));

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-sm text-muted">
          These show as a row under your name. Leave any blank to skip it.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((platform) => (
            <li key={platform.id} className="flex items-center gap-2">
              <input type="hidden" name="platform" value={platform.id} />
              <label
                className="w-24 shrink-0 text-xs font-medium text-muted"
                htmlFor={`social-${platform.id}`}
              >
                {platform.label}
              </label>
              <input
                className={`${input} text-sm`}
                id={`social-${platform.id}`}
                name="socialUrl"
                type="url"
                defaultValue={byPlatform.get(platform.id) ?? ""}
                placeholder="https://…"
              />
            </li>
          ))}
        </ul>

        {error && <ErrorText>{error}</ErrorText>}

        <div className="flex items-center gap-3">
          <button className={button} disabled={pending}>
            {pending ? "Saving…" : "Save links"}
          </button>
          {saved && !error && <span className="text-xs text-muted">Saved.</span>}
        </div>
      </form>
    </Card>
  );
}
