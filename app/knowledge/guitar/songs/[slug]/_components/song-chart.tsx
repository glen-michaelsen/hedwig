"use client";

import { useState } from "react";
import { focusable } from "@/app/_components/ui";
import { ChordFigure } from "../../../../_components/chord-figure";
import type { SongSection } from "@/lib/songs/types";

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

export type ChartChord = {
  symbol: string;
  diagram: { slug: string; name: string; href: string } | null;
};

/**
 * The playable part of a song page: which chords, and the song bar by
 * bar. The key switch swaps every chord for its capo shape at once; the
 * server works both versions out, this only chooses which to show.
 */
export function SongChart({
  sections,
  original,
  capo,
}: {
  sections: SongSection[];
  original: ChartChord[];
  capo: { fret: number; chords: ChartChord[] } | null;
}) {
  const [useCapo, setUseCapo] = useState(false);
  const chords = useCapo && capo ? capo.chords : original;
  // Same order in both lists, so a chord's position finds its capo shape.
  const name = (symbol: string) =>
    useCapo && capo ? capo.chords[original.findIndex((c) => c.symbol === symbol)].symbol : symbol;

  const toggle = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${focusable} ${
      on
        ? "border-brand-500/40 bg-brand-500/10 text-brand-700"
        : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
    }`;

  return (
    <>
      {capo && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Play it">
          <button type="button" className={toggle(!useCapo)} aria-pressed={!useCapo} onClick={() => setUseCapo(false)}>
            Original key
          </button>
          <button type="button" className={toggle(useCapo)} aria-pressed={useCapo} onClick={() => setUseCapo(true)}>
            Easier: capo {capo.fret}
          </button>
        </div>
      )}

      <section aria-labelledby="chords-heading">
        <h2 id="chords-heading" className="text-2xl font-semibold tracking-tight">
          Chords in this song
        </h2>
        {useCapo && capo && (
          <p className="mt-2 text-sm text-muted">
            Capo on the {ORDINAL[capo.fret]} fret. These shapes sound exactly like the original.
          </p>
        )}
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {chords.map((chord) =>
            chord.diagram ? (
              <ChordFigure
                key={chord.symbol}
                slug={chord.diagram.slug}
                name={chord.diagram.name}
                shortName={chord.symbol}
                href={chord.diagram.href}
              />
            ) : null,
          )}
        </div>
      </section>

      <section aria-labelledby="map-heading">
        <h2 id="map-heading" className="text-2xl font-semibold tracking-tight">
          The song, bar by bar
        </h2>
        <p className="mt-2 text-sm text-muted">Each box is one bar of four beats. Two chords share the bar.</p>
        <div className="mt-6 space-y-7">
          {sections.map((section, index) => (
            <div key={`${section.name}-${index}`}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {section.name}
                {section.repeat && (
                  <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold text-muted">
                    ×{section.repeat}
                  </span>
                )}
              </h3>
              <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {section.bars.map((bar, barIndex) => (
                  <li
                    key={barIndex}
                    className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-3 text-lg font-semibold text-foreground shadow-soft"
                  >
                    {bar.map((chord, chordIndex) => (
                      <span key={chordIndex} className="flex items-center gap-3">
                        {chordIndex > 0 && (
                          <span aria-hidden="true" className="text-sm font-normal text-faint">
                            ·
                          </span>
                        )}
                        {name(chord)}
                      </span>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
