import Link from "next/link";
import { Hearts } from "@/app/_components/hearts";
import { focusable } from "@/app/_components/ui";

export type SpotlightCardArticle = {
  id: string;
  slug: string;
  headline: string;
  rating: number;
  artistName: string;
  releaseDate: string | null;
  headerAssetId: string | null;
  headerFocusX: number;
  headerFocusY: number;
  coverAssetId: string | null;
};

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

/** One Spotlight piece in a grid: the Spotlight index and the Discover pages. */
export function SpotlightCard({ article }: { article: SpotlightCardArticle }) {
  const image = article.headerAssetId ?? article.coverAssetId;
  const date = formatDate(article.releaseDate);

  return (
    <Link href={`/spotlight/${article.slug}`} className={`group block ${focusable}`}>
      <div className="aspect-4/3 w-full overflow-hidden rounded-3xl bg-surface-muted">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/spotlight/image/${image}?size=md`}
            alt=""
            style={{
              objectPosition: article.headerAssetId
                ? `${article.headerFocusX}% ${article.headerFocusY}%`
                : "50% 50%",
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {article.artistName}
      </p>
      <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-brand-700">
        {article.headline}
      </h2>
      <div className="mt-2.5 flex items-center gap-3">
        <Hearts rating={article.rating} className="h-3.5 w-3.5" />
        {date && <span className="text-xs text-faint">{date}</span>}
      </div>
    </Link>
  );
}
