import { ZoomableImage } from "./zoomable-image";

/**
 * One generated scale diagram (see lib/scale-diagrams), shown as a real
 * <img> for the same reason as ChordFigure — a real file with a real URL
 * is what makes it eligible for Google Images.
 */
export function ScaleFigure({
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
        src={`/images/knowledge/guitar/scales/${slug}.svg`}
        alt={`${name} guitar scale diagram`}
        width={272}
        height={224}
        title={name}
        className="mx-auto max-w-56"
      />
      <figcaption className="mt-1 text-sm font-semibold">
        {shortName}
      </figcaption>
    </figure>
  );
}
