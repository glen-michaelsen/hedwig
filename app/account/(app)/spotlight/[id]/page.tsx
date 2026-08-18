import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  PageHeader,
  buttonGhost,
  buttonQuiet,
} from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { getSpotlight, listPhotosForRelease } from "@/lib/dal/spotlight";
import { togglePublishedAction, updateSpotlightAction } from "../actions";
import { SpotlightForm } from "../_components/spotlight-form";
import { DeleteSpotlightButton } from "./_components/delete-spotlight-button";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

export default async function EditSpotlightPage({
  params,
}: PageProps<"/account/spotlight/[id]">) {
  const { id } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

  const photos = await listPhotosForRelease(article.releaseId);

  return (
    <>
      <PageHeader
        title={article.headline}
        subtitle={`${article.artistName} — ${article.releaseTitle} · ${KIND_LABELS[article.releaseKind]}`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link className={buttonQuiet} href="/account/spotlight">
              All articles
            </Link>
            <Link
              className={buttonGhost}
              href={`/spotlight/${article.slug}`}
              target="_blank"
            >
              {article.published ? "View live" : "Preview"}
            </Link>
            <form action={togglePublishedAction}>
              <input type="hidden" name="spotlightId" value={article.id} />
              <input
                type="hidden"
                name="published"
                value={article.published ? "0" : "1"}
              />
              <button
                className={
                  article.published
                    ? buttonGhost
                    : "inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-brand transition-all hover:bg-brand-500"
                }
              >
                {article.published ? "Unpublish" : "Publish"}
              </button>
            </form>
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
