import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { getSpotlight, listPhotosForRelease } from "@/lib/dal/spotlight";
import { buildSpotlightCaption } from "@/lib/press/spotlight-caption";
import { MAX_RATING, computeSpotlightStatus } from "@/lib/spotlight/slug";
import { updateSpotlightAction } from "../actions";
import { SpotlightForm } from "../_components/spotlight-form";
import { DeleteSpotlightButton } from "./_components/delete-spotlight-button";
import { SocialMenu } from "./_components/social-menu";
import { SpotlightStatusMenu } from "./_components/spotlight-status-menu";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export async function generateMetadata({
  params,
}: PageProps<"/account/spotlight/[id]">) {
  const { id } = await params;
  await requireAdmin(`/account/spotlight/${id}`);
  const article = await getSpotlight(id);
  return { title: article ? `Edit spotlight: ${article.headline}` : "Spotlight" };
}

export default async function EditSpotlightPage({
  params,
}: PageProps<"/account/spotlight/[id]">) {
  const { id } = await params;
  await requireAdmin(`/account/spotlight/${id}`);

  const article = await getSpotlight(id);
  if (!article) notFound();

  const photos = await listPhotosForRelease(article.releaseId);
  const today = await todayIso();
  const status = computeSpotlightStatus(
    article.published,
    article.releaseDate,
    today,
  );
  const isFutureRelease = article.releaseDate !== null && article.releaseDate > today;

  const caption = buildSpotlightCaption({
    artistName: article.artistName,
    releaseTitle: article.releaseTitle,
    releaseKind: article.releaseKind,
    headline: article.headline,
    rating: article.rating,
    maxRating: MAX_RATING,
    body: article.body,
  });

  return (
    <>
      <PageHeader
        title={article.headline}
        subtitle={`${article.artistName} — ${article.releaseTitle} · ${KIND_LABELS[article.releaseKind]}`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <SocialMenu spotlightId={article.id} caption={caption} />
            <SpotlightStatusMenu
              spotlightId={article.id}
              status={status}
              published={article.published}
              isFutureRelease={isFutureRelease}
              previewUrl={`/spotlight/${article.slug}`}
            />
          </div>
        }
      />

      <Card>
        <SpotlightForm
          action={updateSpotlightAction}
          releaseId={article.releaseId}
          photos={photos}
          defaults={{
            id: article.id,
            headline: article.headline,
            body: article.body,
            rating: article.rating,
            headerAssetId: article.headerAssetId,
            headerFocusX: article.headerFocusX,
            headerFocusY: article.headerFocusY,
          }}
          submitLabel="Save changes"
        />
      </Card>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Danger zone
        </h2>
        <Card className="mt-4">
          <p className="text-sm leading-relaxed text-muted text-pretty">
            Deleting the article leaves the release and its press kit exactly
            as they are — only the writing goes.
          </p>
          <div className="mt-5">
            <DeleteSpotlightButton
              spotlightId={article.id}
              headline={article.headline}
            />
          </div>
        </Card>
      </section>
    </>
  );
}
