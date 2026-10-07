"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { focusable } from "@/app/_components/ui";
import { ChordFigure } from "../../../../_components/chord-figure";
import type { Bar, SongSection } from "@/lib/songs/types";
import { usePlayAlong, type PlayPosition } from "./use-play-along";

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

export type ChartChord = {
  symbol: string;
  diagram: { slug: string; name: string; href: string } | null;
};

/** One bar in playing order: repeats written out, so pass 2 is its own entry. */
type FlatBar = { section: number; bar: number; pass: number; chords: Bar };

/** Chords in a bar share its four beats evenly: two chords, two beats each. */
function chordIndexOnBeat(chords: Bar, beat: number) {
  return Math.min(chords.length - 1, Math.floor((beat * chords.length) / 4));
}

function chordOnBeat(chords: Bar, beat: number) {
  return chords[chordIndexOnBeat(chords, beat)];
}

/** The next chord that's different from the one on (bar, beat), or null at the end. */
function nextChange(flat: FlatBar[], bar: number, beat: number) {
  const now = chordOnBeat(flat[bar].chords, beat);
  for (let b = bar, t = beat + 1; b < flat.length; b++, t = 0) {
    for (; t < 4; t++) {
      const chord = chordOnBeat(flat[b].chords, t);
      if (chord !== now) return chord;
    }
  }
  return null;
}

/**
 * The playable part of a song page: the chords, the key switch, and the
 * song bar by bar with a play-along that lights up each bar on the beat.
 * The server works out both key versions; this only chooses which to show.
 */
export function SongChart({
  songKey,
  bpm,
  sections,
  original,
  capo,
}: {
  songKey: string;
  bpm: number;
  sections: SongSection[];
  original: ChartChord[];
  capo: { fret: number; chords: ChartChord[] } | null;
}) {
  const [useCapo, setUseCapo] = useState(false);
  const chords = useCapo && capo ? capo.chords : original;
  const name = (symbol: string) =>
    useCapo && capo ? capo.chords[original.findIndex((c) => c.symbol === symbol)].symbol : symbol;

  const flat = useMemo<FlatBar[]>(
    () =>
      sections.flatMap((section, s) =>
        Array.from({ length: section.repeat ?? 1 }, (_, pass) =>
          section.bars.map((chords, b) => ({ section: s, bar: b, pass, chords })),
        ).flat(),
      ),
    [sections],
  );

  const play = usePlayAlong({ bars: flat.length, initialBpm: bpm });
  const position = play.position;
  const playingBar = position?.phase === "playing" ? flat[position.bar] : null;

  return (
    <>
      {capo && <KeySwitch songKey={songKey} capoFret={capo.fret} useCapo={useCapo} onChange={setUseCapo} />}

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
          Play along, bar by bar
        </h2>
        <p className="mt-2 text-sm text-muted">
          Each box is one bar of four beats. Press play, or tap a bar to start there.
        </p>

        <PlayPanel play={play} flat={flat} name={name} songBpm={bpm} />

        <div className="mt-6 space-y-7">
          {sections.map((section, s) => {
            const here = playingBar?.section === s ? playingBar : null;
            return (
              <div key={`${section.name}-${s}`}>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {section.name}
                  {section.repeat && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        here ? "bg-brand-600 text-white" : "bg-surface-muted text-muted"
                      }`}
                    >
                      {here ? `${here.pass + 1} of ${section.repeat}` : `×${section.repeat}`}
                    </span>
                  )}
                </h3>
                <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {section.bars.map((bar, b) => (
                    <BarBox
                      key={b}
                      chords={bar}
                      name={name}
                      beat={here?.bar === b && position?.phase === "playing" ? position.beat : null}
                      onStart={() => play.start(flat.findIndex((f) => f.section === s && f.bar === b))}
                    />
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function KeySwitch({
  songKey,
  capoFret,
  useCapo,
  onChange,
}: {
  songKey: string;
  capoFret: number;
  useCapo: boolean;
  onChange: (value: boolean) => void;
}) {
  // A segmented control: the choice in play is solid purple with a tick,
  // so which version you're reading is never in doubt.
  const segment = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${focusable} ${
      on ? "bg-brand-600 text-white shadow-soft" : "text-muted hover:text-foreground"
    }`;
  const tick = (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="m5 10.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted">Play it</span>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface-muted p-1" role="group" aria-label="Play it">
        <button type="button" className={segment(!useCapo)} aria-pressed={!useCapo} onClick={() => onChange(false)}>
          {!useCapo && tick}
          Original key ({songKey})
        </button>
        <button type="button" className={segment(useCapo)} aria-pressed={useCapo} onClick={() => onChange(true)}>
          {useCapo && tick}
          Easier: capo {capoFret}
        </button>
      </div>
    </div>
  );
}

/** Play/stop, what to play now and next, the beat, and the tempo. Sticks below the header while playing. */
function PlayPanel({
  play,
  flat,
  name,
  songBpm,
}: {
  play: ReturnType<typeof usePlayAlong>;
  flat: FlatBar[];
  name: (symbol: string) => string;
  songBpm: number;
}) {
  const position: PlayPosition | null = play.position;
  let now: string;
  let next: string | null;
  let label: string;
  let beatsLit: number;

  if (!position) {
    now = name(chordOnBeat(flat[0].chords, 0));
    next = nextChange(flat, 0, 0);
    label = "First chord";
    beatsLit = 0;
  } else if (position.phase === "count-in") {
    now = position.beat < 0 ? "…" : String(position.beat + 1);
    next = chordOnBeat(flat[0].chords, 0);
    label = "Count-in";
    beatsLit = position.beat + 1;
  } else {
    now = name(chordOnBeat(flat[position.bar].chords, position.beat));
    next = nextChange(flat, position.bar, position.beat);
    label = "Play now";
    beatsLit = position.beat + 1;
  }

  return (
    <div
      className={`mt-5 rounded-3xl border bg-surface/95 p-4 shadow-soft backdrop-blur sm:p-5 ${
        play.playing ? "sticky top-20 z-30 border-brand-500/30" : "border-line"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={() => (play.playing ? play.stop() : play.start(0))}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${focusable} ${
            play.playing
              ? "border border-line bg-surface text-foreground hover:border-line-strong"
              : "bg-brand-600 text-white shadow-brand hover:bg-brand-700"
          }`}
        >
          <span aria-hidden="true">{play.playing ? "■" : "▶"}</span>
          {play.playing ? "Stop" : "Play along"}
        </button>

        <div className="flex items-end gap-6">
          <div className="min-w-20">
            <p className="text-xs font-medium text-muted">{label}</p>
            <p className="text-4xl font-semibold leading-none tracking-tight text-brand-700 tabular-nums">{now}</p>
          </div>
          <div className="min-w-14">
            <p className="text-xs font-medium text-muted">Next</p>
            <p className="text-2xl font-semibold leading-none text-faint">{next ? name(next) : "End"}</p>
          </div>
          <ol className="flex gap-1.5 pb-1" aria-label={`Beat ${beatsLit} of 4`}>
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className={`h-3 w-3 rounded-full ${i < beatsLit ? "bg-brand-600" : "border border-line-strong bg-surface-muted"}`}
              />
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted sm:ml-auto">
          <label className="flex items-center gap-2">
            Tempo
            <input
              type="range"
              min={40}
              max={Math.max(160, songBpm)}
              step={1}
              value={play.bpm}
              onChange={(event) => play.setBpm(Number(event.target.value))}
              className="w-28 accent-brand-600"
            />
            <span className="w-16 font-semibold text-foreground tabular-nums">{play.bpm} BPM</span>
          </label>
          {play.bpm !== songBpm && (
            <button
              type="button"
              onClick={() => play.setBpm(songBpm)}
              className={`rounded text-xs text-brand-600 hover:underline ${focusable}`}
            >
              Song tempo
            </button>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={play.click}
              onChange={(event) => play.setClick(event.target.checked)}
              className="accent-brand-600"
            />
            Click
          </label>
        </div>
      </div>
    </div>
  );
}

/** One bar: its chords side by side, filling up a quarter per beat while it plays. */
function BarBox({
  chords,
  name,
  beat,
  onStart,
}: {
  chords: Bar;
  name: (symbol: string) => string;
  beat: number | null;
  onStart: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const active = beat !== null;

  // Keep the bar being played on screen, below the sticky panel.
  useEffect(() => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < 280 || rect.bottom > window.innerHeight - 40) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ref.current.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
    }
  }, [active]);

  const playingIndex = active ? chordIndexOnBeat(chords, beat) : -1;

  return (
    <li>
      <button
        ref={ref}
        type="button"
        onClick={onStart}
        aria-label={`Play from this bar: ${chords.map(name).join(", ")}`}
        aria-current={active ? "step" : undefined}
        className={`relative flex h-16 w-full overflow-hidden rounded-2xl border bg-surface shadow-soft transition-colors ${focusable} ${
          active ? "border-2 border-brand-500" : "border-line hover:border-line-strong"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-brand-500/15 motion-safe:transition-[width] motion-safe:duration-100"
          style={{ width: active ? `${(beat + 1) * 25}%` : "0%" }}
        />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute bottom-1.5 h-1 w-1 rounded-full ${active && i <= beat ? "bg-brand-500" : "bg-line-strong"}`}
            style={{ left: `calc(${12.5 + i * 25}% - 2px)` }}
          />
        ))}
        {chords.map((chord, i) => (
          <span
            key={i}
            className={`relative flex flex-1 items-center justify-center text-lg font-semibold ${
              i > 0 ? "border-l border-dashed border-line" : ""
            } ${active && i === playingIndex ? "text-brand-700" : "text-foreground"}`}
          >
            {name(chord)}
          </span>
        ))}
      </button>
    </li>
  );
}
