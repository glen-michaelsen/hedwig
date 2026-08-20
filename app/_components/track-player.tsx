"use client";

import { useEffect, useRef, useState } from "react";
import { focusable } from "./ui";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 translate-x-px">
      <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M6.5 4.5h2.5v11H6.5zM11 4.5h2.5v11H11z" fill="currentColor" />
    </svg>
  );
}

/**
 * An audio player we can actually style.
 *
 * The native `<audio controls>` widget is drawn by the browser: the played
 * and buffered bars come from the platform, and the shadow parts that would
 * colour them are either unstylable or different in every engine. So the
 * element is kept for playback and hidden, and the bar is ours — played in
 * brand-600, buffered in brand-200, which is the whole point of the exercise.
 *
 * Seeking is a real range input laid over the bar rather than a click
 * handler on a div, so arrow keys, Home/End and screen readers work without
 * any of it being reimplemented.
 */
export function TrackPlayer({
  src,
  title,
  onFirstPlay,
}: {
  src: string;
  title: string;
  /** Called once, the first time this track is started. */
  onFirstPlay?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const reported = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTime() {
      if (!audio) return;
      setCurrent(audio.currentTime);
    }
    function onMeta() {
      if (!audio) return;
      setDuration(audio.duration);
    }
    function onProgress() {
      if (!audio) return;
      // The range that covers the playhead is the one that matters; a file
      // seeked around in has several, and the last one may be behind us.
      const ranges = audio.buffered;
      let ahead = 0;
      for (let i = 0; i < ranges.length; i++) {
        if (ranges.start(i) <= audio.currentTime && ranges.end(i) >= audio.currentTime) {
          ahead = ranges.end(i);
          break;
        }
        ahead = Math.max(ahead, ranges.end(i));
      }
      setBuffered(ahead);
    }
    function onPlay() {
      setPlaying(true);
      // Once per mount: a pause and resume is the same listen.
      if (!reported.current) {
        reported.current = true;
        onFirstPlay?.();
      }
    }
    function onPause() {
      setPlaying(false);
    }

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("progress", onProgress);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("progress", onProgress);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
    };
  }, [onFirstPlay]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration)) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  const playedRatio = duration > 0 ? current / duration : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  /**
   * Where the thumb's centre actually is.
   *
   * A range thumb is inset by half its width at each end — at 0% its centre
   * sits THUMB/2 in from the left, not at the left edge — so a fill drawn to
   * a plain percentage of the track stops short of the dot everywhere except
   * dead centre. This is that same curve, so the fill ends exactly under the
   * thumb and the two read as one shape.
   */
  const THUMB = 14;
  const playedWidth = `calc(${playedRatio * 100}% + ${(0.5 - playedRatio) * THUMB}px)`;

  return (
    <div className="flex items-center gap-4 rounded-full bg-surface-muted px-3 py-2.5">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} ${title}`}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-500 ${focusable}`}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <span className="shrink-0 text-xs tabular-nums text-muted">
        {formatTime(current)} / {formatTime(duration)}
      </span>

      <div className="relative min-w-0 flex-1">
        {/* Track, buffered, played — stacked, all the same 6px rail. */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-200 transition-[width] duration-300"
            style={{ width: `${bufferedPercent}%` }}
          />
        </div>
        {/* Square on the right: a rounded cap would read as a pill sitting
            beside the thumb rather than running into it. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 h-1.5 rounded-l-full bg-brand-600"
          style={{ width: playedWidth }}
        />

        <input
          type="range"
          min={0}
          max={Number.isFinite(duration) && duration > 0 ? duration : 0}
          step={0.1}
          value={current}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label={`Seek within ${title}`}
          className={`absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 ${focusable}`}
        />
      </div>
    </div>
  );
}
