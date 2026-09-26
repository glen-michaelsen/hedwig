import Link from "next/link";
import { isAdmin, requireAccount } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { CopyLink } from "./_components/copy-link";
import { listOtherAccountsReleases, listReleases } from "@/lib/dal/press";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  button,
  focusable,
} from "@/app/_components/ui";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

function formatDate(value: string | null) {
  if (!value) return "No date yet";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // Built from the parts rather than parsed: `new Date("2026-08-18")` is
    // UTC midnight, which is the day before in any negative offset.
  }).format(new Date(year, month - 1, day));
}

export const metadata = { title: "Press Kit" };

type ReleaseRowData = Awaited<ReturnType<typeof listReleases>>[number] & {
  ownerName?: string;
  ownerEmail?: string;
};

function ReleaseRow({ release, appUrl }: { release: ReleaseRowData; appUrl: string }) {
  return (
    <li className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted">
      <Link
        href={`/press/${release.id}`}
        className={`flex min-w-0 flex-1 items-center gap-4 ${focusable}`}
      >
        {release.coverAssetId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/press/${release.id}/asset/${release.coverAssetId}?size=sm`}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-dashed border-line text-[10px] text-faint">
            No art
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{release.title}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {release.artistName} · {KIND_LABELS[release.kind]} ·{" "}
            {formatDate(release.releaseDate)}
          </p>
          {release.ownerEmail && (
            <p className="mt-0.5 truncate text-xs text-faint">
              Owner: {release.ownerName} ({release.ownerEmail})
            </p>
          )}
        </div>

        <span className="hidden shrink-0 text-xs text-faint sm:block">
          {release.assetCount === 0
            ? "No files"
            : `${release.assetCount} file${release.assetCount === 1 ? "" : "s"}`}
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {release.published && release.slug ? (
          <>
            <span className="hidden rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 sm:inline">
              Public
            </span>
            <CopyLink url={`${appUrl}/kit/${release.slug}`} />
          </>
        ) : (
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
            Private
          </span>
        )}
      </div>
    </li>
  );
}

export default async function PressPage() {
  const account = await requireAccount("/press");
  const admin = await isAdmin(account);
  const [releases, others, { APP_URL }] = await Promise.all([
    listReleases(account.id),
    // Admin only: everyone else's kits, to open, edit or transfer.
    admin ? listOtherAccountsReleases(account.id) : Promise.resolve([]),
    getEnv(),
  ]);

  return (
    <>
      <PageHeader
        title="Press Kit"
        subtitle="One place for the cover, the photos, the audio and the paperwork."
        action={
          <Link className={button} href="/press/new">
            New release
          </Link>
        }
      />

      {releases.length === 0 ? (
        <Empty>No releases yet. Add one and the material follows.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {releases.map((release) => (
              <ReleaseRow key={release.id} release={release} appUrl={APP_URL} />
            ))}
          </PanelList>
        </Panel>
      )}

      {admin && (
        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Other musicians&rsquo; press kits
            </h2>
            <span className="rounded-full bg-brand-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-700">
              Admin
            </span>
          </div>
          {others.length === 0 ? (
            <Empty>No other press kits yet.</Empty>
          ) : (
            <Panel>
              <PanelList>
                {others.map((release) => (
                  <ReleaseRow key={release.id} release={release} appUrl={APP_URL} />
                ))}
              </PanelList>
            </Panel>
          )}
        </section>
      )}
    </>
  );
}
