import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  Empty,
  PageHeader,
  buttonQuiet,
  focusable,
} from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { listPhotosForRelease, listReleasesForPicker } from "@/lib/dal/spotlight";
import { createSpotlightAction } from "../actions";
import { SpotlightForm } from "../_components/spotlight-form";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

/**
 * Two steps in one route: pick a release, then write. `?release=` carries the
 * choice, so the back button returns to the picker instead of losing a
 * half-written article to a wizard's internal state.
 */
export default async function NewSpotlightPage({
  searchParams,
}: PageProps<"/account/spotlight/new">) {
  await requireAdmin();
  const { release } = await searchParams;
  const releaseId = typeof release === "string" ? release : undefined;

  const releases = await listReleasesForPicker();

  if (!releaseId) {
    return (
      <>
        <PageHeader
          title="Write a Spotlight"
          subtitle="Pick the release it's about — the cover and date come from its press kit."
          action={
            <Link className={buttonQuiet} href="/account/spotlight">
              Cancel
            </Link>
          }
        />

        {releases.length === 0 ? (
          <Empty>No releases exist yet. Create one in Press Kit first.</Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {releases.map((option) => {
              const taken = option.spotlightId !== null;
              return (
                <Link
                  key={option.id}
                  href={
                    taken
                      ? `/account/spotlight/${option.spotlightId}`
                      : `/account/spotlight/new?release=${option.id}`
                  }
                  className={`flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 shadow-soft transition-colors hover:border-line-strong ${focusable}`}
                >
                  {option.coverAssetId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/spotlight/image/${option.coverAssetId}?size=sm`}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-dashed border-line text-[10px] text-faint">
                      No art
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {option.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {option.artistName} · {KIND_LABELS[option.kind]}
                    </p>
                    {taken && (
                      <p className="mt-1.5 text-xs text-faint">
                        Already written — open it
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </>
    );
  }

  const chosen = releases.find((option) => option.id === releaseId);
  if (!chosen) notFound();

  // One article per release; sending them to the existing one beats a
  // unique-constraint error after they've written six paragraphs.
  if (chosen.spotlightId) {
    return (
      <>
        <PageHeader
          title="Already covered"
          subtitle={`${chosen.artistName} — ${chosen.title} has a Spotlight already.`}
          action={
            <Link
              className={buttonQuiet}
              href={`/account/spotlight/${chosen.spotlightId}`}
            >
              Open it
            </Link>
          }
        />
      </>
    );
  }

  const photos = await listPhotosForRelease(releaseId);

  return (
    <>
      <PageHeader
        title={chosen.title}
        subtitle={`${chosen.artistName} · ${KIND_LABELS[chosen.kind]}`}
        action={
          <Link className={buttonQuiet} href="/account/spotlight/new">
            Change release
          </Link>
        }
      />

      <Card>
        <SpotlightForm
          action={createSpotlightAction}
          releaseId={releaseId}
          photos={photos}
          submitLabel="Create draft"
        />
      </Card>
    </>
  );
}
