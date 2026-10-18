import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import {
  getSpotlight,
  getSpotlightEmailLog,
  getSpotlightOwner,
  listPhotosForRelease,
} from "@/lib/dal/spotlight";
import { buildSpotlightCaption } from "@/lib/press/spotlight-caption";
import { parseQuotes } from "@/lib/spotlight/quotes";
import { downloadName } from "@/lib/spotlight/share-image";
import { storySlots } from "@/lib/spotlight/story-image";
import { MAX_RATING, computeSpotlightStatus } from "@/lib/spotlight/slug";
import { updateSpotlightAction } from "../actions";
import { SpotlightForm } from "../_components/spotlight-form";
import { DeleteSpotlightButton } from "./_components/delete-spotlight-button";
import { EmailTestButtons } from "./_components/email-test-buttons";
import { SocialMenu } from "./_components/social-menu";
import { SpotlightStatusMenu } from "./_components/spotlight-status-menu";
import { Stories } from "./_components/stories";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

function sentLabel(date: Date | null | undefined) {
  if (!date) return "Not sent yet";
  return `Sent ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

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

  const [photos, owner, emailLog] = await Promise.all([
    listPhotosForRelease(article.releaseId),
    getSpotlightOwner(article.id),
    getSpotlightEmailLog(article.id),
  ]);
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
        subtitle={`${article.releaseTitle} by ${article.artistName} · ${KIND_LABELS[article.releaseKind]}`}
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
            quotes: parseQuotes(article.quotes),
          }}
          submitLabel="Save changes"
        />
      </Card>

      <Stories
        spotlightId={article.id}
        slots={storySlots(article)}
        fileBase={downloadName(article)}
        libraryUrl={article.published ? `/spotlight/assets/${article.id}` : null}
      />

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Emails to the artist
        </h2>
        <Card className="mt-4">
          <p className="text-sm leading-relaxed text-muted text-pretty">
            {owner ? (
              <>
                The press kit belongs to <span className="font-medium text-foreground">{owner.email}</span>.
              </>
            ) : (
              "The press kit's owner couldn't be found."
            )}{" "}
            They get an email when you publish: &ldquo;planned&rdquo; if the
            release date is still ahead, and &ldquo;published&rdquo; when the
            article goes live. A week after that, a reminder to share it again.
            Each goes out once, by itself.
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted">Planned email</dt>
              <dd className="font-medium">{sentLabel(emailLog?.plannedEmailSentAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Published email</dt>
              <dd className="font-medium">{sentLabel(emailLog?.publishedEmailSentAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Reminder</dt>
              <dd className="font-medium">{sentLabel(emailLog?.reminderEmailSentAt)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-muted text-pretty">
            These buttons send a copy to you, not to the artist. For testing, or
            to forward.
          </p>
          <div className="mt-3">
            <EmailTestButtons spotlightId={article.id} />
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Danger zone
        </h2>
        <Card className="mt-4">
          <p className="text-sm leading-relaxed text-muted text-pretty">
            Deleting the article leaves the release and its press kit exactly
            as they are. Only the text is removed.
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
