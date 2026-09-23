"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { detectPitch } from "@/lib/tuner/pitch-detect";
import { frequencyToNote, STANDARD_TUNING } from "@/lib/tuner/notes";
import { ErrorText, button, buttonGhost, focusable } from "@/app/_components/ui";

const IN_TUNE_CENTS = 5;
const CLOSE_CENTS = 20;
/** How often the UI updates, in ms — the pitch loop itself still runs every animation frame. */
const UPDATE_INTERVAL = 80;

type Reading = { cents: number; detectedLabel: string; matchesTarget: boolean };

function TuningMeter({ cents }: { cents: number }) {
  const clamped = Math.max(-50, Math.min(50, cents));
  const percent = 50 + clamped;
  const inTune = Math.abs(cents) <= IN_TUNE_CENTS;
  const close = Math.abs(cents) <= CLOSE_CENTS;
  const dotColor = inTune ? "bg-emerald-500" : close ? "bg-amber-500" : "bg-rose-500";
  const textColor = inTune
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-foreground";
  const label = inTune ? "In tune 👍" : cents < 0 ? "Too low. Tune up." : "Too high. Tune down.";

  return (
    <div className="text-center">
      <p className={`text-3xl font-semibold tabular-nums ${textColor}`}>
        {cents > 0 ? "+" : ""}
        {cents}&cent;
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      <div className="relative mt-5 h-2 rounded-full bg-surface-muted">
        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong"
          aria-hidden="true"
        />
        <div
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full transition-[left] duration-150 ${dotColor}`}
          style={{ left: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/**
 * A live chromatic tuner using the visitor's own microphone — Web Audio's
 * getUserMedia plus autocorrelation-based pitch detection (see
 * lib/tuner/pitch-detect.ts). Entirely client-side: nothing recorded here
 * ever leaves the browser.
 *
 * The target string is a ref, not just state, so switching strings mid-way
 * re-targets the running audio loop immediately instead of needing a
 * restart — the loop reads whichever string is selected right now.
 */
export function GuitarTuner() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);

  const selectedIndexRef = useRef(selectedIndex);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(0);

  function selectString(index: number) {
    selectedIndexRef.current = index;
    setSelectedIndex(index);
    setReading(null);
  }

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setListening(false);
    setReading(null);
  }, []);

  // Release the mic and audio context if the visitor navigates away
  // without pressing Stop.
  useEffect(() => stop, [stop]);

  async function start() {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "This browser can't use the microphone from a webpage. Try a recent version of Chrome, Safari, Firefox or Edge.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const tick = (timestamp: number) => {
        analyser.getFloatTimeDomainData(buffer);
        const frequency = detectPitch(buffer, audioContext.sampleRate);

        if (frequency > 0 && timestamp - lastUpdateRef.current > UPDATE_INTERVAL) {
          lastUpdateRef.current = timestamp;
          const target = STANDARD_TUNING[selectedIndexRef.current];
          const detected = frequencyToNote(frequency);
          const cents = Math.round(1200 * Math.log2(frequency / target.frequency));
          const matchesTarget =
            detected.name === target.note && detected.octave === target.octave;
          setReading({
            cents,
            detectedLabel: `${detected.name}${detected.octave}`,
            matchesTarget,
          });
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      setListening(true);
    } catch {
      setError(
        "We couldn't get access to your microphone. Allow it for this site in your browser settings, and try again.",
      );
    }
  }

  const target = STANDARD_TUNING[selectedIndex];

  return (
    <div className="rounded-4xl border border-line bg-surface p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Guitar Tuner</h3>
          <p className="mt-1 text-sm text-muted">Standard tuning: E A D G B E</p>
        </div>
        {listening ? (
          <button type="button" onClick={stop} className={buttonGhost}>
            Stop
          </button>
        ) : (
          <button type="button" onClick={start} className={button}>
            Start tuning
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STANDARD_TUNING.map((string, index) => (
          <button
            key={string.label}
            type="button"
            onClick={() => selectString(index)}
            aria-pressed={index === selectedIndex}
            className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors ${focusable} ${
              index === selectedIndex
                ? "border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300"
                : "border-line text-muted hover:border-line-strong hover:text-foreground"
            }`}
          >
            {string.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-5">
          <ErrorText>{error}</ErrorText>
        </div>
      )}

      {listening && (
        <div className="mt-7" aria-live="polite">
          {!reading ? (
            <p className="text-center text-sm text-muted">
              Pluck the {target.label} string…
            </p>
          ) : reading.matchesTarget ? (
            <TuningMeter cents={reading.cents} />
          ) : (
            <p className="text-center text-sm text-muted">
              We hear {reading.detectedLabel}, not {target.label}. Are you
              plucking the right string?
            </p>
          )}
        </div>
      )}
    </div>
  );
}
