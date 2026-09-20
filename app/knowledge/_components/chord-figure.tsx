/**
 * Renders one generated chord diagram (see lib/chord-diagrams) as a real
 * <img>, not inline SVG — a real file with a real URL is what makes it
 * eligible for Google Images, which an inline <svg> in the page markup
 * isn't.
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/knowledge/guitar/chords/${slug}.svg`}
        alt={`${name} guitar chord diagram`}
        width={200}
        height={210}
        loading="lazy"
        className="mx-auto h-auto w-full max-w-36"
      />
      <figcaption className="mt-1 text-sm font-semibold">
        {shortName}
      </figcaption>
    </figure>
  );
}
