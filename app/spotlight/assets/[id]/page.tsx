import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hearts } from "@/app/_components/hearts";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { TermLink } from "@/app/_components/term-link";
import { buttonGhost, container } from "@/app/_components/ui";
import { getSpotlightForAssets } from "@/lib/dal/spotlight";
import { downloadName } from "@/lib/spotlight/share-image";
import { MAX_RATING } from "@/lib/spotlight/slug";
import { storySlots } from "@/lib/spotlight/story-image";
import { AssetGallery } from "./_components/asset-gallery";

export const dynamic = "force-dynamic";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

/** Three-letter months, as on the stories: en-GB's short September is "Sept". */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/**
 * A Spotlight's asset library: the post, the stories and the badges, for
 * the artist to share with their label, band and fans. Public on purpose,
 * reached by the article's id rather than listed anywhere, and kept out of
 * search results. Drafts aren't reachable.
 */
export async function generateMetadata({ params }: PageProps<"/spotlight/assets/[id]">): Promise<Metadata> {
  const { id } = await params;
  const article = await getSpotlightForAssets(id);
  return {
    title: article ? `${article.releaseTitle} by ${article.artistName}: Spotlight assets` : "Spotlight assets",
    robots: { index: false, follow: false },
  };
}

export default async function SpotlightAssetsPage({ params }: PageProps<"/spotlight/assets/[id]">) {
  const { id } = await params;
  const article = await getSpotlightForAssets(id);
  if (!article) notFound();

  const base = `/spotlight/assets/${article.id}`;
  const fileBase = downloadName(article);
  const stories = storySlots(article).map(({ slot, label }) => ({
    src: `${base}/story/${slot}`,
    name: `${fileBase}-story-${slot}`,
    label,
  }));

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-24">
        <div className={`${container} pt-12 sm:pt-16`}>
          <header className="flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-center">
            {article.coverAssetId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${base}/cover`}
                alt=""
                className="h-28 w-28 shrink-0 rounded-3xl object-cover shadow-soft"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Asset library</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">{article.releaseTitle}</h1>
              <p className="mt-1 text-muted">
                {[
                  article.artistName,
                  KIND_LABELS[article.releaseKind],
                  article.releaseDate && formatDate(article.releaseDate),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Hearts rating={article.rating} className="h-4 w-4" />
                <span className="text-sm text-muted tabular-nums">
                  {article.rating} of {MAX_RATING}
                </span>
              </div>
            </div>
            {article.live && (
              <Link href={`/spotlight/${article.slug}`} className={`${buttonGhost} self-start sm:self-center`}>
                Read the review
              </Link>
            )}
          </header>

          <p className="mt-8 max-w-2xl leading-relaxed text-muted text-pretty">
            Images and badges from the <TermLink href="/spotlight">Spotlight</TermLink> review, made for
            sharing. Post them, send them to your label, use them anywhere the music goes.
          </p>

          <div className="mt-12">
            <AssetGallery
              post={{ src: `${base}/post`, name: fileBase, label: "Instagram post" }}
              stories={stories}
              badge={
                article.live
                  ? {
                      slug: article.slug,
                      title: article.releaseTitle,
                      artist: article.artistName,
                      rating: article.rating,
                      maxRating: MAX_RATING,
                    }
                  : null
              }
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
