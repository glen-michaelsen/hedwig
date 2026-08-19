import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hearts } from "@/app/_components/hearts";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { ShareBox } from "./_components/share-box";
import {
  button,
  container,
  containerNarrow,
  focusable,
} from "@/app/_components/ui";
import { getAccount, isAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import {
  getPublishedSpotlight,
  getSpotlightBySlugForAdmin,
} from "@/lib/dal/spotlight";

export const dynamic = "force-dynamic";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

/**
 * Published for everyone; drafts for the admin only, so "Preview" in the
 * editor opens the real page at its real URL instead of an approximation.
 */
async function findArticle(slug: string) {
  const published = await getPublishedSpotlight(slug);
  if (published) return { article: published, isDraft: false };

  const account = await getAccount();
  if (account && (await isAdmin(account))) {
    const draft = await getSpotlightBySlugForAdmin(slug);
    if (draft) return { article: draft, isDraft: true };
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps<"/spotlight/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await findArticle(slug);
  if (!found) return { title: "Not found — Trenodo" };

  const { article } = found;
  return {
    title: `${article.headline} — Trenodo Spotlight`,
    description: `${article.artistName} — ${article.releaseTitle}`,
    openGraph: {
      title: article.headline,
      description: `${article.artistName} — ${article.releaseTitle}`,
      images: article.headerAssetId ?? article.coverAssetId
        ? [`/spotlight/image/${article.headerAssetId ?? article.coverAssetId}?size=md`]
        : undefined,
    },
  };
}

export default async function SpotlightArticlePage({
  params,
}: PageProps<"/spotlight/[slug]">) {
  const { slug } = await params;

  const found = await findArticle(slug);
  if (!found) notFound();

  const { article, isDraft } = found;
  const hero = article.headerAssetId ?? article.coverAssetId;
  const released = formatDate(article.releaseDate);

  // Both are plain YYYY-MM-DD, so a string compare is a date compare — and
  // it can't be knocked a day out by a timezone the way parsing would.
  const today = await todayIso();
  const upcoming = article.releaseDate !== null && today < article.releaseDate;

  // Blank lines separate paragraphs — the editor is a plain textarea, so
  // this is the whole of the formatting contract.
  const paragraphs = article.body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pb-24">
        {isDraft && (
          <div className="bg-amber-500/15 py-3 text-center text-sm text-amber-800 dark:text-amber-200">
            Draft — only you can see this.
          </div>
        )}

        {/*
          Two layouts rather than one that bends. A phone is too narrow to put
          a cover beside a headline without shrinking both past the point of
          being worth showing, so it stacks: photograph, cover centred across
          the edge, then the words on paper. Desktop keeps everything on the
          photograph, where there is room for it.
        */}

        {/* Phone */}
        <header className="sm:hidden">
          <div className="relative aspect-4/3 w-full bg-surface-muted">
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/spotlight/image/${hero}?size=md`}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
            {/* Lighter than the desktop scrim: nothing is set over this one,
                so it only has to seat the cover rather than carry text. */}
            <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
          </div>

          {article.coverAssetId && (
            // `relative` matters: the photograph above is a positioned
            // element, so a static box pulled up by a negative margin paints
            // underneath it. Giving the cover a position of its own puts it
            // back on top.
            <div className="relative z-10 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/spotlight/image/${article.coverAssetId}?size=md`}
                alt={`${article.releaseTitle} cover`}
                className="-mt-24 h-44 w-44 rounded-3xl object-cover shadow-float ring-1 ring-white/15"
              />
            </div>
          )}

          <div className={`${containerNarrow} mt-7 text-center`}>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {article.artistName} · {KIND_LABELS[article.releaseKind]}
              {released && ` · ${released}`}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
              {article.headline}
            </h1>
            <span className="mt-5 inline-flex">
              <Hearts rating={article.rating} className="h-5 w-5" />
            </span>
          </div>
        </header>

        {/* Desktop */}
        <header className="relative hidden sm:block">
          <div className="relative aspect-[21/9] w-full bg-surface-muted">
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/spotlight/image/${hero}?size=lg`}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

            {/*
              Anchored to the bottom edge of the photograph rather than laid
              out after it, so how far the cover hangs below doesn't depend on
              how tall the headline happens to be. `items-end` puts both
              bottoms on that edge; the cover's translate then pushes exactly
              a fifth of itself past it, and the text block's own padding
              lifts the hearts clear of it.
            */}
            <div className="absolute inset-x-0 bottom-0">
              <div className={container}>
                <div className="flex items-end gap-7">
                  {article.coverAssetId && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/spotlight/image/${article.coverAssetId}?size=md`}
                      alt={`${article.releaseTitle} cover`}
                      className="h-64 w-64 shrink-0 translate-y-[20%] rounded-3xl object-cover shadow-float ring-1 ring-white/15"
                    />
                  )}

                  {/* Bottom padding matches the column gap above, so the
                      space under the hearts reads as the same measure as the
                      space between the cover and the text. */}
                  <div className="min-w-0 pb-7">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                      {article.artistName} · {KIND_LABELS[article.releaseKind]}
                      {released && ` · ${released}`}
                    </p>
                    <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-white text-balance">
                      {article.headline}
                    </h1>
                    <span className="mt-5 inline-flex">
                      <Hearts
                        rating={article.rating}
                        className="h-5 w-5"
                        tone="light"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <article className={`${containerNarrow} mt-12 sm:mt-28`}>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-pretty leading-relaxed ${
                index === 0
                  ? "text-xl text-foreground sm:text-2xl"
                  : "mt-6 text-base text-muted sm:text-lg"
              }`}
            >
              {paragraph}
            </p>
          ))}

          {article.releaseUrl && (
            <div className="mt-12">
              <a
                href={article.releaseUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={button}
              >
                {upcoming ? "Pre-save" : "Listen to"} {article.releaseTitle}
              </a>
            </div>
          )}

          <ShareBox title={article.headline} />

          <div className="mt-8">
            <Link
              href="/spotlight"
              className={`text-sm text-muted transition-colors hover:text-foreground ${focusable}`}
            >
              ← All Spotlight pieces
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
