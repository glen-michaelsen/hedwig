/**
 * "2 days ago", "Last Thursday", or a plain date once it's old enough that
 * naming a weekday stops being useful. Pure and sync (unlike lib/clock.ts)
 * so it can run in a client component too — callers already have `today`
 * from todayIso() by the time they need this.
 */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseIso(value));
}

export function formatRelativeDate(value: string, today: string) {
  const diffDays = Math.round(
    (parseIso(today).getTime() - parseIso(value).getTime()) / 86_400_000,
  );

  if (diffDays < 0) return formatShortDate(value);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 6) return `${diffDays} days ago`;
  if (diffDays <= 13) return `Last ${WEEKDAYS[parseIso(value).getDay()]}`;
  return formatShortDate(value);
}
