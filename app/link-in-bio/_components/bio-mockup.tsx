"use client";

import { useState } from "react";
import { BlockRenderer } from "@/app/[handle]/_components/blocks";
import { PhoneFrame } from "@/app/_components/mockup/phone-frame";
import type { ParsedBlock } from "@/lib/bio/blocks";
import { socialLabel } from "@/lib/bio/socials";
import { resolveTheme, themeVars } from "@/lib/bio/theme";

/**
 * A real phone showing a real bio page — reusing the actual public-page
 * renderer (BlockRenderer) and theme engine (resolveTheme/themeVars), rather
 * than a screenshot. It never drifts from what the product actually looks
 * like, and switching the swatch below is a real theme change, not a second
 * image to keep in sync.
 *
 * The content is Glen's own page, trenodo.com/@glen, copied here by hand:
 * nothing reads from the database, and the phone itself is inert
 * (pointer-events-none). If that page changes a lot, update this to match.
 */

const PAGE = {
  title: "Glen Michaelsen",
  tagline: "Passionate about Marketing, Entrepreneurship, Music, and Board Games",
  avatarKey: null,
  accentColor: null as string | null,
  backgroundKind: "preset" as const,
  backgroundValue: null,
  showCredit: true,
};

/** Same photo as the About me section on the front page. */
const AVATAR = "/images/about/glen.jpg";

const SOCIALS = [
  { id: "s1", platform: "instagram", url: "#" },
  { id: "s2", platform: "youtube", url: "#" },
];

const BLOCKS: ParsedBlock[] = [
  { id: "b1", kind: "text", visible: true, config: { variant: "heading", value: "Projects" } },
  {
    id: "b2",
    kind: "link",
    visible: true,
    config: { label: "Trenodo", url: "#", description: "Free Toolbox for Musicians" },
  },
  {
    id: "b3",
    kind: "link",
    visible: true,
    config: { label: "Čujemo se", url: "#", description: "Free Online Serbian Lessons" },
  },
  { id: "b4", kind: "text", visible: true, config: { variant: "divider", value: null } },
  { id: "b5", kind: "text", visible: true, config: { variant: "heading", value: "Portfolio" } },
  { id: "b6", kind: "link", visible: true, config: { label: "Unsplash", url: "#", description: null } },
  { id: "b7", kind: "link", visible: true, config: { label: "SoundCloud", url: "#", description: null } },
  { id: "b8", kind: "link", visible: true, config: { label: "Medium", url: "#", description: null } },
];

/** Ivory first: it's the theme Glen's real page uses. */
const SWATCHES = [
  { id: "ivory", label: "Ivory" },
  { id: "sand", label: "Sand" },
  { id: "blush", label: "Blush" },
  { id: "midnight", label: "Midnight" },
] as const;

export function BioMockup() {
  // Starts on Ivory, the real page's theme. A dark one would also sit
  // right against the phone's black bezel and read as one flat block.
  const [presetId, setPresetId] = useState<(typeof SWATCHES)[number]["id"]>(
    "ivory",
  );

  const theme = resolveTheme({ ...PAGE, themePreset: presetId });

  return (
    <div className="select-none">
      <PhoneFrame
        screenStyle={themeVars(theme)}
        screenClassName="bg-[var(--bio-bg)] font-[family-name:var(--bio-font)] text-[var(--bio-fg)] transition-colors duration-500"
      >
        <div className="px-6 pt-14 pb-16">
          <header className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover shadow-lg"
            />

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-balance">
              {PAGE.title}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[var(--bio-muted)] text-pretty">
              {PAGE.tagline}
            </p>

            <nav className="mt-6 flex flex-wrap justify-center gap-2">
              {SOCIALS.map((social) => (
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
            {BLOCKS.map((block) => (
              <BlockRenderer key={block.id} block={block} today="2026-01-01" />
            ))}
          </div>

          <footer className="mt-16 text-center">
            <span className="text-xs opacity-45">Made with Trenodo</span>
          </footer>
        </div>
      </PhoneFrame>

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
              background: resolveTheme({ ...PAGE, themePreset: swatch.id }).bg,
            }}
          />
        ))}
      </div>
    </div>
  );
}
