/**
 * Song lengths, as musicians write them: 3:45, or 345 meaning the same, or
 * plain minutes. Shared by the editor and the server that saves it.
 */

/** "3:45" → 225. Returns null for anything unparseable, including blank. */
export function parseDuration(value: string): number | null {
  const text = value.trim();
  if (!text) return null;

  // 3:45 or 1:02:30
  const parts = text.split(":");
  if (parts.length > 1) {
    const numbers = parts.map((part) => Number(part.trim()));
    if (numbers.some((n) => !Number.isFinite(n) || n < 0)) return null;

    const seconds =
      parts.length === 3
        ? numbers[0] * 3600 + numbers[1] * 60 + numbers[2]
        : numbers[0] * 60 + numbers[1];

    return Math.round(seconds);
  }

  // Bare number: minutes, because "4" is a four-minute song, not four seconds.
  const minutes = Number(text);
  if (!Number.isFinite(minutes) || minutes < 0) return null;
  return Math.round(minutes * 60);
}

/** 225 → "3:45". */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "—";
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

/** 3900 → "1h 05m", for set and gig totals where 65:00 reads badly. */
export function formatLength(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export type FitVerdict = {
  /** Signed difference in seconds: positive means the set runs long. */
  diffSeconds: number;
  tone: "under" | "close" | "over";
  label: string;
};

/**
 * How well a set fills its slot.
 *
 * Three minutes either way is "about right" — a band's actual timing varies
 * by more than that between soundcheck and the last song, so pretending to
 * be exact would be false precision.
 */
export function fitVerdict(
  playedSeconds: number,
  targetMinutes: number,
): FitVerdict {
  const target = targetMinutes * 60;
  const diff = playedSeconds - target;
  const minutes = Math.round(Math.abs(diff) / 60);

  if (Math.abs(diff) <= 3 * 60) {
    return { diffSeconds: diff, tone: "close", label: "About right" };
  }
  if (diff < 0) {
    return {
      diffSeconds: diff,
      tone: "under",
      label: `${minutes} min short`,
    };
  }
  return { diffSeconds: diff, tone: "over", label: `${minutes} min over` };
}
