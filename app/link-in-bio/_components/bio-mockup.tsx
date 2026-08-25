"use client";

import { useState } from "react";
import { BlockRenderer } from "@/app/[handle]/_components/blocks";
import type { ParsedBlock } from "@/lib/bio/blocks";
import { socialLabel } from "@/lib/bio/socials";
import { resolveTheme, themeVars } from "@/lib/bio/theme";

/**
 * A real phone showing a real bio page — reusing the actual public-page
 * renderer (BlockRenderer) and theme engine (resolveTheme/themeVars) with
 * made-up content, rather than a screenshot. It never drifts from what the
 * product actually looks like, and switching the swatch below is a real
 * theme change, not a second image to keep in sync.
 *
 * Sample content only: nothing here reads from the database, and the phone
 * itself is inert (pointer-events-none) — it's a picture that happens to be
 * built out of real components, not a working page.
 */

const SAMPLE_PAGE = {
  title: "Glen",
  tagline: "Producer & vocalist — new EP out now",
  avatarKey: null,
  accentColor: null as string | null,
  backgroundKind: "preset" as const,
  backgroundValue: null,
  showCredit: true,
};

const SAMPLE_SOCIALS = [
  { id: "s1", platform: "instagram", url: "#" },
  { id: "s2", platform: "spotify", url: "#" },
];

const SAMPLE_BLOCKS: ParsedBlock[] = [
  {
    id: "b1",
    kind: "link",
    visible: true,
    config: { label: "Listen to “Nordlys”", url: "#", description: null },
  },
  {
    id: "b2",
    kind: "text",
    visible: true,
    config: { variant: "heading", value: "Upcoming shows" },
  },
  {
    id: "b3",
    kind: "link",
    visible: true,
    config: { label: "Copenhagen — Vega", url: "#", description: "Sept 14" },
  },
  {
    id: "b4",
    kind: "link",
    visible: true,
    config: { label: "Aarhus — Voxhall", url: "#", description: "Sept 21" },
  },
  { id: "b5", kind: "text", visible: true, config: { variant: "divider", value: null } },
  {
    id: "b6",
    kind: "link",
    visible: true,
    config: { label: "Merch", url: "#", description: null },
  },
];

const SWATCHES = [
  { id: "midnight", label: "Midnight" },
  { id: "sand", label: "Sand" },
  { id: "blush", label: "Blush" },
] as const;

/** The real page's content width, before it's scaled down to phone size. */
const NATIVE_WIDTH = 340;
const SCALE = 0.62;

export function BioMockup() {
  // Starts on a light theme — a dark one sits right against the phone's
  // own black bezel and reads as one flat block. Midnight's still one of
  // the swatches below, just not what loads first.
  const [presetId, setPresetId] = useState<(typeof SWATCHES)[number]["id"]>(
    "sand",
  );

  const theme = resolveTheme({ ...SAMPLE_PAGE, themePreset: presetId });

  return (
    <div className="select-none">
      <div className="rise-in relative mx-auto w-[248px] rounded-[2.75rem] bg-neutral-900 p-2.5 shadow-float">
        <div className="relative h-[536px] w-full overflow-hidden rounded-[2.25rem]">
          <div
            aria-hidden
            className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black"
          />

          <div
            style={{ ...themeVars(theme) }}
            className="pointer-events-none flex h-full w-full items-start justify-center overflow-hidden bg-[var(--bio-bg)] font-[family-name:var(--bio-font)] text-[var(--bio-fg)] transition-colors duration-500"
          >
            {/* `flex justify-center` centers this before the scale is
                applied — scaling around the box's own midpoint only lines
                up with the frame's center if the box was centered to begin
                with, and a fixed-width block laid out on its own just
                left-aligns and drags everything right of true center. */}
            <div
              className="shrink-0 origin-top"
              style={{ width: NATIVE_WIDTH, transform: `scale(${SCALE})` }}
            >
              <div className="px-6 pt-14 pb-16">
                <header className="flex flex-col items-center text-center">
                  <span className="grid h-24 w-24 place-items-center rounded-full bg-[var(--bio-accent)] text-2xl font-semibold text-[var(--bio-accent-fg)]">
                    {SAMPLE_PAGE.title.slice(0, 1)}
                  </span>

                  <h1 className="mt-6 text-2xl font-semibold tracking-tight text-balance">
                    {SAMPLE_PAGE.title}
                  </h1>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--bio-muted)] text-pretty">
                    {SAMPLE_PAGE.tagline}
                  </p>

                  <nav className="mt-6 flex flex-wrap justify-center gap-2">
                    {SAMPLE_SOCIALS.map((social) => (
                      <span
                        key={social.id}
                        className="rounded-full border border-current/20 px-3.5 py-1.5 text-xs font-medium opacity-80"
                      >
                        {socialLabel(social.platform)}
                      </span>
                    ))}
                  </nav>
                </header>

                <div className="mt-10 space-y-3.5">
                  {SAMPLE_BLOCKS.map((block) => (
                    <BlockRenderer key={block.id} block={block} today="2026-01-01" />
                  ))}
                </div>

                <footer className="mt-16 text-center">
                  <span className="text-xs opacity-45">Made with Trenodo</span>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            aria-label={`Preview the ${swatch.label} theme`}
            aria-pressed={presetId === swatch.id}
            onClick={() => setPresetId(swatch.id)}
            className={`h-6 w-6 rounded-full border-2 transition-all ${
              presetId === swatch.id
                ? "scale-110 border-foreground"
                : "border-transparent hover:scale-105"
            }`}
            style={{
              background: resolveTheme({ ...SAMPLE_PAGE, themePreset: swatch.id }).bg,
            }}
          />
        ))}
      </div>
    </div>
  );
}
