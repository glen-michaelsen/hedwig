import Link from "next/link";
import { focusable } from "@/app/_components/ui";

/** Where each cover sits: three fan out left, right and front; two lean together. */
const FAN_OF_THREE = [
  "-translate-x-[62%] -rotate-[9deg] group-hover:-translate-x-[70%] group-hover:-rotate-[12deg]",
  "translate-x-[62%] rotate-[9deg] group-hover:translate-x-[70%] group-hover:rotate-[12deg]",
  "z-10 group-hover:-translate-y-1.5",
];
const FAN_OF_TWO = [
  "-translate-x-[32%] -rotate-[7deg] group-hover:-translate-x-[40%] group-hover:-rotate-[10deg]",
  "z-10 translate-x-[32%] rotate-[5deg] group-hover:translate-x-[40%] group-hover:rotate-[8deg]",
];
const ALONE = ["group-hover:-translate-y-1.5 group-hover:rotate-[3deg]"];

/**
 * One Discover page as a block: up to three real covers from its newest
 * Spotlights, fanned out, which spread a little on hover.
 */
export function DiscoverBlock({
  href,
  title,
  count,
  averageRating,
  covers,
}: {
  href: string;
  title: string;
  count: number;
  averageRating: number;
  /** Newest first. */
  covers: string[];
}) {
  // The newest cover goes last in the markup, so it lands in front.
  const fanned = covers.length === 3 ? [covers[1], covers[2], covers[0]] : [...covers].reverse();
  const places = fanned.length === 3 ? FAN_OF_THREE : fanned.length === 2 ? FAN_OF_TWO : ALONE;

  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-4xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-float ${focusable}`}
    >
      <div className="relative grid h-44 place-items-center overflow-hidden bg-linear-to-br from-brand-500/15 via-brand-500/5 to-surface-muted">
        {fanned.map((cover, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={cover}
            src={cover}
            alt=""
            className={`absolute h-28 w-28 rounded-2xl object-cover shadow-lift ring-2 ring-surface transition-transform duration-500 ease-out ${places[index]}`}
          />
        ))}
      </div>
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-brand-700">
          {title}
        </h3>
        <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
          <span>
            <span className="font-semibold tabular-nums text-foreground">{count}</span>{" "}
            {count === 1 ? "release" : "releases"}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">♥ {averageRating.toFixed(1)}</span>
          <span
            className="ml-auto text-brand-600 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
