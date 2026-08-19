import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { TrackPlayer } from "@/app/_components/track-player";
import { actionPill, container, focusable } from "@/app/_components/ui";
import { getPublicRelease, listPublicAssets } from "@/lib/dal/press";
import { formatBytes } from "@/lib/press/assets";

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

export async function generateMetadata({
  params,
}: PageProps<"/kit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const release = await getPublicRelease(slug);
  if (!release) return { title: "Not found — Trenodo" };

  return {
    title: `${release.artistName} — ${release.title} | Press kit`,
    description: `Press material for ${release.title} by ${release.artistName}.`,
  };
}

export default async function PublicPressKitPage({
  params,
}: PageProps<"/kit/[slug]">) {
  const { slug } = await params;

  const release = await getPublicRelease(slug);
  if (!release) notFound();

  const assets = await listPublicAssets(release.id);
  const cover = assets.find((asset) => asset.kind === "cover");
  const photos = assets.filter((asset) => asset.kind === "photo");
  const tracks = assets.filter((asset) => asset.kind === "track");
  const documents = assets.filter((asset) => asset.kind === "document");

  const released = formatDate(release.releaseDate);
  const asset = (id: string) => `/kit/${slug}/asset/${id}`;

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pb-24">
        <div className={`${container} pt-12 sm:pt-16`}>
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${asset(cover.id)}?size=md`}
                alt={`${release.title} cover`}
                className="h-48 w-48 shrink-0 rounded-3xl object-cover shadow-float sm:h-60 sm:w-60"
              />
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                Press kit
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {release.title}
              </h1>
              <p className="mt-3 text-base text-muted">
                {release.artistName} · {KIND_LABELS[release.kind]}
                {released && ` · ${released}`}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {release.url && (
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={actionPill}
                  >
                    Listen online
                  </a>
                )}
                {cover && (
                  <a
                    href={`${asset(cover.id)}?download`}
                    className={actionPill}
                  >
                    Download cover
                  </a>
                )}
              </div>
            </div>
          </div>

          {release.notes && (
            <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted text-pretty">
              {release.notes}
            </p>
          )}

          {tracks.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Music
              </h2>
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-4xl border border-line bg-surface">
                {tracks.map((track) => (
                  <li key={track.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {track.filename}
                        </p>
                        <p className="mt-0.5 text-xs text-faint">
                          {formatBytes(track.sizeBytes)}
                        </p>
                      </div>
                      <a
                        href={`${asset(track.id)}?download`}
                        className={actionPill}
                      >
                        Download
                      </a>
                    </div>

                    {/*
                      The player preloads metadata only, so a page with six
                      tracks fetches six headers rather than six masters. The
                      route answers Range requests, so playback starts on the
                      first chunk and seeking jumps straight to the offset.
                    */}
                    <div className="mt-3">
                      <TrackPlayer
                        src={asset(track.id)}
                        title={track.filename}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {photos.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Press photos
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo) => (
                  <figure key={photo.id} className="min-w-0">
                    <a
                      href={`${asset(photo.id)}?size=lg`}
                      target="_blank"
                      rel="noreferrer"
                      className={`block overflow-hidden rounded-3xl ${focusable}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${asset(photo.id)}?size=md`}
                        alt={photo.filename}
                        className="aspect-4/3 w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </a>
                    <figcaption className="mt-3 flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-xs text-muted">
                        {photo.caption ?? photo.filename}
                      </span>
                      <a
                        href={`${asset(photo.id)}?download`}
                        className={actionPill}
                      >
                        Download
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {documents.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Documents
              </h2>
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-4xl border border-line bg-surface">
                {documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {document.filename}
                      </p>
                      <p className="mt-0.5 text-xs text-faint">
                        {formatBytes(document.sizeBytes)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={asset(document.id)} target="_blank" rel="noreferrer" className={actionPill}>
                        Open
                      </a>
                      <a
                        href={`${asset(document.id)}?download`}
                        className={actionPill}
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {assets.length === 0 && (
            <p className="mt-14 rounded-4xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
              Material for this release is on its way.
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
