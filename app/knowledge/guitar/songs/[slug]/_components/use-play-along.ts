"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A metronome that walks through a song bar by bar.
 *
 * Clicks are scheduled ahead on the audio clock (the standard Web Audio
 * "look-ahead" pattern), never fired from a timer or animation frame,
 * so beat 4 to the next 1 is exactly as long as every other beat. The
 * screen follows the same clock and only re-renders when the beat changes.
 */

const COUNT_IN = 4;
const LOOK_AHEAD = 0.12; // seconds of clicks scheduled in advance
const SCHEDULE_EVERY = 25; // ms between scheduler runs

export type PlayPosition =
  | { phase: "count-in"; beat: number }
  | { phase: "playing"; bar: number; beat: number };

export function usePlayAlong({ bars, initialBpm }: { bars: number; initialBpm: number }) {
  const [position, setPosition] = useState<PlayPosition | null>(null);
  const [bpm, setBpmState] = useState(initialBpm);
  const [click, setClickState] = useState(true);

  const ctx = useRef<AudioContext | null>(null);
  const bpmRef = useRef(initialBpm);
  const clickRef = useRef(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const frame = useRef(0);
  const queue = useRef<{ beat: number; time: number }[]>([]);
  const next = useRef({ beat: 0, time: 0 });
  const startBar = useRef(0);
  const shown = useRef(-1);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    cancelAnimationFrame(frame.current);
    queue.current = [];
    shown.current = -1;
    setPosition(null);
  }, []);

  const start = useCallback(
    async (fromBar = 0) => {
      stop();
      const AudioContextClass =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current ??= new AudioContextClass();
      const audio = ctx.current;
      await audio.resume();

      startBar.current = fromBar;
      const totalBeats = COUNT_IN + (bars - fromBar) * 4;
      next.current = { beat: 0, time: audio.currentTime + 0.15 };

      const schedule = () => {
        while (next.current.time < audio.currentTime + LOOK_AHEAD && next.current.beat < totalBeats) {
          const { beat, time } = next.current;
          queue.current.push({ beat, time });
          if (clickRef.current) {
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            // The 1 of every bar, and the whole count-in, click higher.
            osc.frequency.value = beat % 4 === 0 ? 1500 : 950;
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.exponentialRampToValueAtTime(0.3, time + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
            osc.connect(gain).connect(audio.destination);
            osc.start(time);
            osc.stop(time + 0.07);
          }
          next.current = { beat: beat + 1, time: time + 60 / bpmRef.current };
        }
      };

      const follow = () => {
        const now = audio.currentTime;
        while (queue.current.length > 1 && queue.current[1].time <= now) queue.current.shift();
        const current = queue.current[0];
        if (current && current.time <= now && current.beat !== shown.current) {
          shown.current = current.beat;
          setPosition(
            current.beat < COUNT_IN
              ? { phase: "count-in", beat: current.beat }
              : {
                  phase: "playing",
                  bar: startBar.current + Math.floor((current.beat - COUNT_IN) / 4),
                  beat: (current.beat - COUNT_IN) % 4,
                },
          );
        }
        // The last beat has had its full length: the song is over.
        if (next.current.beat >= totalBeats && now >= next.current.time) {
          stop();
          return;
        }
        frame.current = requestAnimationFrame(follow);
      };

      schedule();
      timer.current = setInterval(schedule, SCHEDULE_EVERY);
      setPosition({ phase: "count-in", beat: -1 });
      frame.current = requestAnimationFrame(follow);
    },
    [bars, stop],
  );

  const setBpm = useCallback((value: number) => {
    bpmRef.current = value;
    setBpmState(value);
  }, []);

  const setClick = useCallback((value: boolean) => {
    clickRef.current = value;
    setClickState(value);
  }, []);

  useEffect(
    () => () => {
      stop();
      void ctx.current?.close();
    },
    [stop],
  );

  return { position, playing: position !== null, start, stop, bpm, setBpm, click, setClick };
}
