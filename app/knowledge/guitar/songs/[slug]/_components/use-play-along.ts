"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A metronome that walks through a song bar by bar.
 *
 * Clicks are scheduled ahead on the audio clock (the standard Web Audio
 * "look-ahead" pattern), never fired from a timer or animation frame,
 * so the last beat of a bar to the next 1 is exactly as long as every
 * other beat. The
 * screen follows the same clock and only re-renders when the beat changes.
 */

const LOOK_AHEAD = 0.12; // seconds of clicks scheduled in advance
const SCHEDULE_EVERY = 25; // ms between scheduler runs

export type PlayPosition =
  /** `from`: the bar playing starts at, after the count-in. */
  | { phase: "count-in"; beat: number; from: number }
  | { phase: "playing"; bar: number; beat: number };

export function usePlayAlong({
  bars,
  initialBpm,
  beatsPerBar,
  beatsPerPulse,
  groups,
}: {
  bars: number;
  initialBpm: number;
  /** 4 in 4/4, 6 in 6/8. */
  beatsPerBar: number;
  /** How many clicks make one `bpm` pulse: 1 in 4/4, 3 in 6/8. */
  beatsPerPulse: number;
  /** Beats in the bar that start a group (accented): [0] in 4/4, [0, 3] in 6/8. */
  groups: number[];
}) {
  // One bar of count-in, whatever the meter.
  const COUNT_IN = beatsPerBar;
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
      const totalBeats = COUNT_IN + (bars - fromBar) * beatsPerBar;
      next.current = { beat: 0, time: audio.currentTime + 0.15 };

      const schedule = () => {
        while (next.current.time < audio.currentTime + LOOK_AHEAD && next.current.beat < totalBeats) {
          const { beat, time } = next.current;
          queue.current.push({ beat, time });
          if (clickRef.current) {
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            // The 1 of every bar clicks highest, the start of each other
            // group (the 4 in 6/8) a little lower, the rest plainest.
            const inBar = beat % beatsPerBar;
            osc.frequency.value = inBar === 0 ? 1500 : groups.includes(inBar) ? 1200 : 950;
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.exponentialRampToValueAtTime(0.3, time + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
            osc.connect(gain).connect(audio.destination);
            osc.start(time);
            osc.stop(time + 0.07);
          }
          next.current = { beat: beat + 1, time: time + 60 / (bpmRef.current * beatsPerPulse) };
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
              ? { phase: "count-in", beat: current.beat, from: startBar.current }
              : {
                  phase: "playing",
                  bar: startBar.current + Math.floor((current.beat - COUNT_IN) / beatsPerBar),
                  beat: (current.beat - COUNT_IN) % beatsPerBar,
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
      setPosition({ phase: "count-in", beat: -1, from: fromBar });
      frame.current = requestAnimationFrame(follow);
    },
    [bars, stop, COUNT_IN, beatsPerBar, beatsPerPulse, groups],
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
