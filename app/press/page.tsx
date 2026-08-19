import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { CopyLink } from "./_components/copy-link";
import { listReleases } from "@/lib/dal/press";
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

export default async function PressPage() {
  const account = await requireAccount();
  const releases = await listReleases(account.id);
  const { APP_URL } = await getEnv();

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
        <Empty>
          No releases yet. Add one and the material follows.
        </Empty>
      ) : (
        <Panel>
          <PanelList>
            {releases.map((release) => (
              <li key={release.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted">
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
                    <p className="truncate text-sm font-medium">
                      {release.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {release.artistName} · {KIND_LABELS[release.kind]} ·{" "}
                      {formatDate(release.releaseDate)}
                    </p>
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
                      <span className="hidden rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 sm:inline dark:text-emerald-300">
                        Public
                      </span>
                      <CopyLink url={`${APP_URL}/kit/${release.slug}`} />
                    </>
                  ) : (
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Private
                    </span>
                  )}
                </div>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
