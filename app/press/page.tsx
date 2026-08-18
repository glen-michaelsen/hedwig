import Link from "next/link";
import { requireAccount } from "@/lib/auth";
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
              <li key={release.id}>
                <Link
                  href={`/press/${release.id}`}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted ${focusable}`}
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

                  <span className="shrink-0 text-xs text-faint">
                    {release.assetCount === 0
                      ? "No files"
                      : `${release.assetCount} file${release.assetCount === 1 ? "" : "s"}`}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
