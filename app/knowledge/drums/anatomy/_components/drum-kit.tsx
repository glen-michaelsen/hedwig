"use client";

import { useState } from "react";
import { focusable } from "@/app/_components/ui";
import { KIT_PARTS, type KitPartKey } from "../kit-parts";

/**
 * A five-piece drum kit, drawn from the front. Tap or hover a piece to
 * light it up and read about it; the buttons under the drawing do the
 * same for keyboards and screen readers.
 */
export function DrumKit() {
  const [selected, setSelected] = useState<KitPartKey>("snare");
  const [hovered, setHovered] = useState<KitPartKey | null>(null);
  const active = hovered ?? selected;
  const part = KIT_PARTS.find((p) => p.key === active)!;

  // Every drawn piece shares these handlers and its highlight.
  const piece = (key: KitPartKey) => ({
    onClick: () => setSelected(key),
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(null),
    className: `cursor-pointer transition-colors duration-150 ${
      active === key ? "fill-brand-500/35 stroke-brand-600" : "fill-surface-muted stroke-line-strong"
    }`,
    strokeWidth: 2,
  });
  const cymbal = (key: KitPartKey) => ({
    ...piece(key),
    className: `cursor-pointer transition-colors duration-150 ${
      active === key ? "fill-brand-500/45 stroke-brand-600" : "fill-amber-200/60 stroke-amber-600/50"
    }`,
  });
  const stand = "stroke-line-strong";

  return (
    <div className="overflow-hidden rounded-4xl border border-line bg-surface shadow-soft">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 600 420" role="img" aria-label="A five-piece drum kit seen from the front" className="w-full">
          {/* Stands, drawn first so the pieces sit on top. */}
          <g className={stand} strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M95 175 V395 M95 395 l-30 14 M95 395 l30 14" />
            <path d="M175 110 V395 M175 395 l-28 14 M175 395 l28 14" />
            <path d="M485 135 V395 M485 395 l-28 14 M485 395 l28 14" />
            <path d="M150 262 l-22 140 M200 262 l22 140" />
            <path d="M412 300 l-6 108 M488 300 l6 108" />
          </g>

          {/* Crash and ride. */}
          <ellipse cx="175" cy="105" rx="78" ry="11" transform="rotate(-8 175 105)" {...cymbal("crash")} />
          <circle cx="175" cy="105" r="5" className="fill-line-strong" />
          <ellipse cx="485" cy="130" rx="92" ry="12" transform="rotate(7 485 130)" {...cymbal("ride")} />
          <circle cx="485" cy="130" r="6" className="fill-line-strong" />

          {/* Hi-hat: two cymbals on one stand. */}
          <g {...cymbal("hihat")}>
            <ellipse cx="95" cy="168" rx="52" ry="8" />
            <ellipse cx="95" cy="178" rx="52" ry="8" />
          </g>

          {/* Bass drum. */}
          <circle cx="300" cy="300" r="98" {...piece("kick")} />
          <circle cx="300" cy="300" r="78" fill="none" className="pointer-events-none stroke-line" strokeWidth={2} />

          {/* Rack toms, mounted on the bass drum. */}
          <g {...piece("rack-toms")}>
            <path d="M222 178 h66 v44 a33 9 0 0 1 -66 0 Z" />
            <ellipse cx="255" cy="178" rx="33" ry="9" />
            <path d="M318 172 h74 v50 a37 10 0 0 1 -74 0 Z" />
            <ellipse cx="355" cy="172" rx="37" ry="10" />
          </g>

          {/* Snare. */}
          <g {...piece("snare")}>
            <path d="M120 245 h110 v34 a55 12 0 0 1 -110 0 Z" />
            <ellipse cx="175" cy="245" rx="55" ry="12" />
          </g>

          {/* Floor tom. */}
          <g {...piece("floor-tom")}>
            <path d="M390 238 h120 v68 a60 14 0 0 1 -120 0 Z" />
            <ellipse cx="450" cy="238" rx="60" ry="14" />
          </g>

          {/* Pedals and throne. */}
          <g {...piece("pedals")}>
            <rect x="270" y="392" width="60" height="16" rx="5" />
            <rect x="72" y="392" width="46" height="16" rx="5" />
          </g>
        </svg>

        <div className="flex flex-col" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">{part.size}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">{part.name}</h3>
          <p className="mt-3 text-base leading-relaxed text-muted text-pretty">{part.does}</p>
          <p className="mt-4 rounded-2xl bg-brand-500/[0.07] px-4 py-3 text-sm leading-relaxed text-foreground">
            <span className="font-semibold text-brand-700">Tip: </span>
            {part.tip}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line bg-surface-muted/50 px-5 py-4 sm:px-7" role="group" aria-label="Parts of the kit">
        {KIT_PARTS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={selected === p.key}
            onClick={() => setSelected(p.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${focusable} ${
              active === p.key ? "bg-brand-600 text-white" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
