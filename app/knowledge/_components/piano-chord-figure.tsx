import { ZoomableImage } from "./zoomable-image";

/**
 * One generated piano chord diagram (see lib/piano-diagrams), shown as a
 * real <img> — same reasoning as ChordFigure: a real file with a real URL
 * is what makes it eligible for Google Images.
 */
export function PianoChordFigure({
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
        src={`/images/knowledge/piano/chords/${slug}.svg`}
        alt={`${name} piano chord diagram`}
        width={512}
        height={182}
        title={name}
        className="mx-auto"
      />
      <figcaption className="mt-1 text-sm font-semibold">
        {shortName}
      </figcaption>
    </figure>
  );
}
