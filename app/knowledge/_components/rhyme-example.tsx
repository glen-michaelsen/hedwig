"use client";

import { useState } from "react";
import { focusable } from "@/app/_components/ui";

export type RhymeLine = {
  /** The line up to (not including) its last word. */
  before: string;
  /** The last word, where the rhyme lands. */
  word: string;
  /** The pattern letter for this line. Lines sharing a letter rhyme. */
  letter: string;
};

/**
 * A four-line example for one rhyme pattern. Rhyming words are real
 * buttons, so hover, tap and keyboard focus all light up the partner
 * words (and their letters) the same way. A letter used only once
 * (the free lines in ABCB) has nothing to pair with, so its word stays plain.
 */
export function RhymeExample({ lines }: { lines: readonly RhymeLine[] }) {
  const [active, setActive] = useState<string | null>(null);

  const counts = lines.reduce<Record<string, number>>((acc, line) => {
    acc[line.letter] = (acc[line.letter] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-4 rounded-2xl bg-surface-muted/60 px-4 py-3.5">
      {lines.map((line, index) => {
        const rhymes = counts[line.letter] > 1;
        const lit = rhymes && active === line.letter;

        return (
          <p key={index} className="flex items-baseline gap-3 py-0.5 text-[15px] leading-relaxed">
            <span
              aria-hidden="true"
              className={`w-5 shrink-0 text-center font-mono text-xs font-semibold transition-colors ${
                lit ? "text-brand-600" : "text-faint"
              }`}
            >
              {line.letter}
            </span>
            <span className="text-muted">
              {line.before}{" "}
              {rhymes ? (
                <button
                  type="button"
                  onMouseEnter={() => setActive(line.letter)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(line.letter)}
                  onBlur={() => setActive(null)}
                  onClick={() =>
                    setActive((current) => (current === line.letter ? null : line.letter))
                  }
                  className={`rounded-md px-1 -mx-1 font-semibold transition-colors ${focusable} ${
                    lit ? "bg-brand-500/15 text-brand-700" : "text-foreground"
                  }`}
                >
                  {line.word}
                </button>
              ) : (
                line.word
              )}
            </span>
          </p>
        );
      })}
    </div>
  );
}
