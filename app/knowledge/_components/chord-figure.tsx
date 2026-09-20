import { ZoomableImage } from "./zoomable-image";

/**
 * One generated chord diagram (see lib/chord-diagrams), shown as a real
 * <img> — a real file with a real URL is what makes it eligible for Google
 * Images, which an inline <svg> in the page markup isn't.
 */
export function ChordFigure({
  slug,
  name,
  shortName,
}: {
  slug: string;
  name: string;
  shortName: string;
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
      <figcaption className="mt-1 text-sm font-semibold">
        {shortName}
      </figcaption>
    </figure>
  );
}
