import Link from "next/link";

/**
 * A photo-backed card — the photo desaturated and tinted in brand purple
 * (a duotone) rather than shown raw, so a stock-feeling photo reads as
 * part of Trenodo's own palette instead of a generic product shot.
 * `alt=""`: the photo is decorative here, the title already names the
 * instrument or topic. Used on the Knowledge index and the pillar hubs.
 */
export function PhotoCard({
  href,
  title,
  body,
  image,
}: {
  href: string;
  title: string;
  body: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-4xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="aspect-4/3 w-full object-cover grayscale contrast-[1.08] brightness-95 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/60 to-brand-900/85 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-lg font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/85 text-pretty">
          {body}
        </p>
      </div>
    </Link>
  );
}
