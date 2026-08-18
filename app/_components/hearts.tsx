import { MAX_RATING } from "@/lib/spotlight/slug";

export function HeartShape({
  filled,
  className = "h-5 w-5",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 20.4s-7.6-4.6-7.6-9.7a4.3 4.3 0 0 1 7.6-2.8 4.3 4.3 0 0 1 7.6 2.8c0 5.1-7.6 9.7-7.6 9.7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The rating, read out as text for anyone not looking at it — a row of six
 * identical icons tells a screen reader nothing on its own.
 */
export function Hearts({
  rating,
  className = "h-5 w-5",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-300"
      role="img"
      aria-label={`${rating} out of ${MAX_RATING} hearts`}
    >
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <HeartShape
          key={index}
          filled={index < rating}
          className={`${className} ${index < rating ? "" : "opacity-30"}`}
        />
      ))}
    </span>
  );
}
