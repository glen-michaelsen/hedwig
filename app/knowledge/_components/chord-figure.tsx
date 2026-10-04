import Link from "next/link";
import { focusable } from "@/app/_components/ui";
import { ZoomableImage } from "./zoomable-image";

/**
 * One generated chord diagram (see lib/chord-diagrams), shown as a real
 * <img> — a real file with a real URL is what makes it eligible for Google
 * Images, which an inline <svg> in the page markup isn't.
 *
 * `href` turns the caption into a quiet link (the diagram itself still
 * zooms); `detail` adds a second, smaller caption line.
 */
export function ChordFigure({
  slug,
  name,
  shortName,
  href,
  detail,
}: {
  slug: string;
  name: string;
  shortName: string;
  href?: string;
  detail?: string;
}) {
  return (
    <figure className="rounded-3xl border border-line bg-surface p-4 text-center shadow-soft">
      <ZoomableImage
        src={`/images/knowledge/guitar/chords/${slug}.svg`}
        alt={`${name} guitar chord diagram`}
        width={200}
        height={210}
        title={name}
        className="mx-auto max-w-36"
      />
      <figcaption className="mt-1">
        {href ? (
          <Link
            href={href}
            title={`All ${shortName} chord variations`}
            className={`group inline-flex items-center gap-1 rounded text-sm font-semibold transition-colors hover:text-brand-700 ${focusable}`}
          >
            {shortName}
            <span
              className="text-xs font-normal text-faint transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ) : (
          <span className="text-sm font-semibold">{shortName}</span>
        )}
        {detail && <span className="mt-0.5 block text-xs text-faint">{detail}</span>}
      </figcaption>
    </figure>
  );
}
