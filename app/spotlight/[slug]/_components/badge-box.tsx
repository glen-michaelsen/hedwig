"use client";

import { useState, useSyncExternalStore } from "react";
import { actionPill, actionPillBrand } from "@/app/_components/ui";
import {
  badgeAlt,
  badgeSize,
  type BadgeVariant,
} from "@/lib/press/badge-meta";

type Tone = "light" | "dark";

const DESIGNS = [
  {
    key: "a",
    name: "Simple",
    note: "Small and quiet. Fits in a footer or a sidebar.",
    variant: (tone: Tone): BadgeVariant => (tone === "light" ? "a-light" : "a-dark"),
    hasTones: true,
  },
  {
    key: "b",
    name: "With hearts",
    note: "Brand purple, with your rating. Works on any background.",
    variant: (): BadgeVariant => "b",
    hasTones: false,
  },
  {
    key: "c",
    name: "With your cover",
    note: "Cover, title and rating. The proudest of the three.",
    variant: (tone: Tone): BadgeVariant => (tone === "light" ? "c-light" : "c-dark"),
    hasTones: true,
  },
] as const;

function subscribe() {
  return () => {};
}

function getOrigin() {
  return window.location.origin;
}

function getServerOrigin() {
  return null;
}

/**
 * Copy-paste embed code for the three "Featured on Trenodo" badges. The
 * code is a plain link around an <img>, so it works on any site builder
 * and counts as a real link back to the article. No script of ours runs on
 * the artist's page.
 *
 * Built from `window.location.origin`, like ShareBox, so the code on
 * preview points at preview and the code on trenodo.com at trenodo.com.
 * The release page links straight here, at #badges.
 */
export function BadgeBox({
  slug,
  title,
  artist,
  rating,
  maxRating,
}: {
  slug: string;
  title: string;
  artist: string;
  rating: number;
  maxRating: number;
}) {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const [tones, setTones] = useState<Record<string, Tone>>({ a: "light", c: "light" });
  const [copied, setCopied] = useState<string | null>(null);

  // Rendered on the server too, without the origin, so the #badges anchor
  // exists on first paint and a link to it lands. The code fills in the
  // full URL right after hydration.
  const articleUrl = `${origin ?? ""}/spotlight/${slug}`;

  function embedCode(variant: BadgeVariant) {
    const { width, height } = badgeSize(variant);
    const alt = badgeAlt(variant, { title, artist, rating, maxRating }).replace(/"/g, "&quot;");
    return `<a href="${articleUrl}" target="_blank" rel="noopener"><img src="${articleUrl}/badge/${variant}.png" alt="${alt}" width="${width}" height="${height}" style="border:0"></a>`;
  }

  async function copy(key: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
    } catch {
      // Clipboard access denied. The code is still on screen to select.
    }
  }

  return (
    <section id="badges" className="mt-16 scroll-mt-24 border-t border-line pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        Badge for your website
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
        Featured here? Show it off. 🏅
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
        Pick a badge, copy the code, and paste it on your website or in your
        EPK. It links back to this article, so fans and bookers can read it.
      </p>

      <div className="mt-8 space-y-5">
        {DESIGNS.map((design) => {
          const tone = tones[design.key] ?? "light";
          const variant = design.variant(tone);
          const { width, height } = badgeSize(variant);
          const code = embedCode(variant);

          return (
            <div
              key={design.key}
              className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft"
            >
              <div
                className={`flex items-center justify-center px-4 py-6 transition-colors ${
                  tone === "dark" && design.hasTones ? "bg-foreground" : "bg-surface-muted"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/spotlight/${slug}/badge/${variant}.png`}
                  alt=""
                  width={width}
                  height={height}
                  className="max-w-full"
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{design.name}</p>
                    <p className="text-sm text-muted">{design.note}</p>
                  </div>
                  {design.hasTones && (
                    <div
                      role="group"
                      aria-label={`${design.name} badge colour`}
                      className="flex gap-1.5"
                    >
                      {(["light", "dark"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={tone === option}
                          onClick={() =>
                            setTones((current) => ({ ...current, [design.key]: option }))
                          }
                          className={tone === option ? actionPillBrand : actionPill}
                        >
                          {option === "light" ? "Light" : "Dark"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <pre className="mt-4 overflow-x-auto rounded-2xl bg-surface-muted px-4 py-3 font-mono text-xs leading-relaxed text-muted whitespace-pre-wrap break-all">
                  {code}
                </pre>

                <button
                  type="button"
                  onClick={() => copy(design.key, code)}
                  className={`mt-3 ${actionPillBrand}`}
                >
                  {copied === design.key ? "Copied ✓" : "Copy code"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
