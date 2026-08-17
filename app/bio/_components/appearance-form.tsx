"use client";

import { useState } from "react";
import { updateAppearanceAction } from "../actions";
import {
  THEME_PRESETS,
  contrastRatio,
  getPreset,
  parseHex,
  readableOn,
} from "@/lib/bio/theme";
import {
  Card,
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";
import { useAction } from "./use-action";

type BackgroundKind = "preset" | "solid" | "gradient" | "image";

export function AppearanceForm({
  page,
}: {
  page: {
    themePreset: string;
    accentColor: string | null;
    backgroundKind: BackgroundKind;
    backgroundValue: string | null;
    showCredit: boolean;
  };
}) {
  const { error, pending, saved, onSubmit } = useAction(updateAppearanceAction);

  const [presetId, setPresetId] = useState(page.themePreset);
  const [accent, setAccent] = useState(page.accentColor ?? "");
  const [kind, setKind] = useState<BackgroundKind>(page.backgroundKind);
  const [background, setBackground] = useState(
    page.backgroundKind === "solid" || page.backgroundKind === "gradient"
      ? (page.backgroundValue ?? "#101010")
      : "#101010",
  );

  const preset = getPreset(presetId);
  const effectiveAccent = parseHex(accent) ? accent : preset.accent;

  // The same maths the page renders with, so the warning is never a guess.
  const buttonContrast = contrastRatio(
    readableOn(effectiveAccent),
    effectiveAccent,
  );
  const bodyGround =
    kind === "solid" || kind === "gradient" ? background : preset.bg;
  const accentOnGround = parseHex(bodyGround)
    ? contrastRatio(effectiveAccent, bodyGround)
    : null;

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-7">
        <div>
          <p className={label}>Theme</p>
          <input type="hidden" name="themePreset" value={presetId} />
          <ul className="grid gap-3 sm:grid-cols-3">
            {THEME_PRESETS.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => setPresetId(option.id)}
                  aria-pressed={presetId === option.id}
                  className={`w-full rounded-3xl border p-4 text-left transition-all ${
                    presetId === option.id
                      ? "border-brand-500 shadow-soft"
                      : "border-line hover:border-line-strong"
                  }`}
                >
                  <span
                    className="flex h-14 items-center justify-center rounded-2xl text-xs"
                    style={{ background: option.bg, color: option.fg }}
                  >
                    <span
                      className="rounded-full px-3 py-1"
                      style={{
                        background: option.accent,
                        color: readableOn(option.accent),
                      }}
                    >
                      Aa
                    </span>
                  </span>
                  <span className="mt-2.5 block text-sm font-medium">
                    {option.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="accentColor">
              Accent colour
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-11 w-14 shrink-0 cursor-pointer rounded-2xl border border-line bg-surface p-1"
                value={parseHex(accent) ? accent : preset.accent}
                onChange={(event) => setAccent(event.target.value)}
                aria-label="Pick an accent colour"
              />
              <input
                className={input}
                id="accentColor"
                name="accentColor"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
                placeholder={preset.accent}
              />
            </div>
            <p className="mt-2 text-xs text-faint">
              Leave empty to use the theme&rsquo;s own accent. Button text
              colour is chosen automatically ({buttonContrast.toFixed(1)}:1).
            </p>
          </div>

          <div>
            <label className={label} htmlFor="backgroundKind">
              Background
            </label>
            <select
              className={input}
              id="backgroundKind"
              name="backgroundKind"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as BackgroundKind)
              }
            >
              <option value="preset">Theme default</option>
              <option value="solid">Solid colour</option>
              <option value="gradient">Gradient from a colour</option>
              <option value="image">Photo</option>
            </select>
          </div>
        </div>

        {(kind === "solid" || kind === "gradient") && (
          <div>
            <label className={label} htmlFor="backgroundColor">
              Background colour
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-11 w-14 shrink-0 cursor-pointer rounded-2xl border border-line bg-surface p-1"
                value={parseHex(background) ? background : "#101010"}
                onChange={(event) => setBackground(event.target.value)}
                aria-label="Pick a background colour"
              />
              <input
                className={input}
                id="backgroundColor"
                name="backgroundColor"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-faint">
              Text colour is derived from this, so it stays readable.
            </p>
          </div>
        )}

        {kind === "image" && (
          <div>
            <label className={label} htmlFor="backgroundImage">
              Background photo
            </label>
            <input
              className={`${input} file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/12 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-brand-700`}
              id="backgroundImage"
              name="backgroundImage"
              type="file"
              accept="image/*"
            />
            <p className="mt-2 text-xs text-faint">
              Text gets a dark scrim over photos automatically — there&rsquo;s
              no way to know what a picture looks like.
            </p>
          </div>
        )}

        {accentOnGround !== null && accentOnGround < 3 && (
          <p className="rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            Your accent is very close to the background ({accentOnGround.toFixed(1)}
            :1). Buttons will still be readable, but they won&rsquo;t stand out.
          </p>
        )}

        {/* Asked for, not enforced: the credit is how most people find us,
            but it's their page. Say so plainly and let them decide. */}
        <div className="rounded-3xl bg-surface-muted p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-brand-600"
              name="showCredit"
              defaultChecked={page.showCredit}
            />
            <span>
              <span className="block text-sm font-medium">
                Show “Made with Trenodo” at the bottom
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                It&rsquo;s how most people find us, and leaving it on genuinely
                helps a small tool grow. But it&rsquo;s your page — turn it off
                whenever you like, and nothing else changes.
              </span>
            </span>
          </label>
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <div className="flex items-center gap-3">
          <button className={button} disabled={pending}>
            {pending ? "Saving…" : "Save appearance"}
          </button>
          {saved && !error && <span className="text-xs text-muted">Saved.</span>}
        </div>
      </form>
    </Card>
  );
}
