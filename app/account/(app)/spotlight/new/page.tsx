import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  Empty,
  PageHeader,
  actionPill,
  actionPillBrand,
  buttonQuiet,
  focusable,
} from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import {
  listPhotosForRelease,
  listReleasesForPicker,
  type ReleaseOption,
} from "@/lib/dal/spotlight";
import {
  createSpotlightAction,
  skipReleaseAction,
  unskipReleaseAction,
} from "../actions";
import { SpotlightForm } from "../_components/spotlight-form";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

/**
 * The three states a release can be in, from this desk's point of view.
 * "Undecided" rather than "not decided" because it's what you'd say out
 * loud, and it's the default view: the only list with anything to do in it.
 */
const TABS = [
  { key: "undecided", label: "Undecided" },
  { key: "written", label: "Written" },
  { key: "skipped", label: "Skipped" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function stateOf(release: ReleaseOption): TabKey {
  if (release.spotlightId) return "written";
  return release.skipped ? "skipped" : "undecided";
}

function ReleaseCard({ release }: { release: ReleaseOption }) {
  const state = stateOf(release);

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 shadow-soft">
      {release.coverAssetId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/spotlight/image/${release.coverAssetId}?size=sm`}
          alt=""
          className={`h-16 w-16 shrink-0 rounded-2xl object-cover ${
            state === "skipped" ? "opacity-50" : ""
          }`}
        />
      ) : (
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-dashed border-line text-[10px] text-faint">
          No art
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{release.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {release.artistName} · {KIND_LABELS[release.kind]}
        </p>

        {state === "written" && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">
            {release.spotlightPublished ? "Published" : "Draft written"}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {state === "written" && (
          <Link
            href={`/account/spotlight/${release.spotlightId}`}
            className={actionPillBrand}
          >
            Open
          </Link>
        )}

        {state === "undecided" && (
          <>
            <Link
              href={`/account/spotlight/new?release=${release.id}`}
              className={actionPillBrand}
            >
              Write
            </Link>
            <form action={skipReleaseAction}>
              <input type="hidden" name="releaseId" value={release.id} />
              <button className={actionPill}>Skip</button>
            </form>
          </>
        )}

        {state === "skipped" && (
          <form action={unskipReleaseAction}>
            <input type="hidden" name="releaseId" value={release.id} />
            <button className={actionPill}>Move back</button>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Two steps in one route: pick a release, then write. `?release=` carries the
 * choice, so the back button returns to the picker instead of losing a
 * half-written article to a wizard's internal state.
 */
export const metadata = { title: "New spotlight" };

export default async function NewSpotlightPage({
  searchParams,
}: PageProps<"/account/spotlight/new">) {
  await requireAdmin();
  const { release, show } = await searchParams;
  const releaseId = typeof release === "string" ? release : undefined;

  const releases = await listReleasesForPicker();

  if (!releaseId) {
    const tab: TabKey =
      typeof show === "string" && TABS.some((entry) => entry.key === show)
        ? (show as TabKey)
        : "undecided";

    const counts = {
      undecided: 0,
      written: 0,
      skipped: 0,
    } satisfies Record<TabKey, number>;
    for (const option of releases) counts[stateOf(option)] += 1;

    const shown = releases.filter((option) => stateOf(option) === tab);

    const emptyCopy = {
      undecided: "Every release has been dealt with. Nothing waiting.",
      written: "No Spotlights written yet.",
      skipped: "Nothing skipped.",
    } satisfies Record<TabKey, string>;

    return (
      <>
        <PageHeader
          title="Pick a release"
          subtitle="Write it up, or skip it. Its cover and release date come from the press kit."
          action={
            <Link className={buttonQuiet} href="/account/spotlight">
              Cancel
            </Link>
          }
        />

        <div className="mb-7 flex flex-wrap gap-2">
          {TABS.map((entry) => (
            <Link
              key={entry.key}
              href={`/account/spotlight/new?show=${entry.key}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                tab === entry.key
                  ? "border-transparent bg-brand-600 text-white"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
              } ${focusable}`}
            >
              {entry.label}
              <span
                className={`tabular-nums ${
                  tab === entry.key ? "text-white/70" : "text-faint"
                }`}
              >
                {counts[entry.key]}
              </span>
            </Link>
          ))}
        </div>

        {releases.length === 0 ? (
          <Empty>No releases exist yet. Create one in Press Kit first.</Empty>
        ) : shown.length === 0 ? (
          <Empty>{emptyCopy[tab]}</Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {shown.map((option) => (
              <ReleaseCard key={option.id} release={option} />
            ))}
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
      <PageHeader
        title="Already written"
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
            Pick another
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
