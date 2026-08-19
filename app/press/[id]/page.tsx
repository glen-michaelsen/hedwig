import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { CopyLink } from "../_components/copy-link";
import { toggleReleasePublishedAction } from "../actions";
import { getRelease, listAssets, type ReleaseAssetRow } from "@/lib/dal/press";
import { ASSET_RULES, formatBytes, type AssetKind } from "@/lib/press/assets";
import {
  Card,
  PageHeader,
  actionPill,
  button,
  buttonGhost,
  focusable,
} from "@/app/_components/ui";
import { TrackPlayer } from "@/app/_components/track-player";
import { DeleteAssetButton } from "./_components/delete-asset-button";
import { Uploader } from "./_components/uploader";

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

const deletePill = `${actionPill} hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-700`;

function Section({
  title,
  releaseId,
  kind,
  children,
}: {
  title: string;
  releaseId: string;
  kind: AssetKind;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        {title}
      </h2>
      <Card className="mt-4">
        {children}
        <div className="mt-6 border-t border-line pt-6">
          <Uploader releaseId={releaseId} kind={kind} />
        </div>
      </Card>
    </section>
  );
}

function FileRow({
  asset,
  releaseId,
  children,
}: {
  asset: ReleaseAssetRow;
  releaseId: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{asset.filename}</p>
        <p className="mt-0.5 text-xs text-faint">
          {formatBytes(asset.sizeBytes)}
        </p>
        {children}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={`/press/${releaseId}/asset/${asset.id}?download`}
          className={actionPill}
        >
          Download
        </a>
        <DeleteAssetButton
          releaseId={releaseId}
          assetId={asset.id}
          filename={asset.filename}
          className={deletePill}
        />
      </div>
    </li>
  );
}

export default async function ReleasePage({
  params,
}: PageProps<"/press/[id]">) {
  const { id } = await params;
  const account = await requireAccount();

  const release = await getRelease(account.id, id);
  if (!release) notFound();

  const assets = await listAssets(account.id, id);
  const byKind = (kind: AssetKind) =>
    assets.filter((asset) => asset.kind === kind);

  const cover = byKind("cover")[0];
  const photos = byKind("photo");
  const tracks = byKind("track");
  const documents = byKind("document");

  const date = formatDate(release.releaseDate);

  // Built from APP_URL rather than the request, so the copied link is the
  // public address even when the admin is on a workers.dev host.
  const { APP_URL } = await getEnv();
  const shareUrl = release.slug ? `${APP_URL}/kit/${release.slug}` : null;

  return (
    <>
      <PageHeader
        title={release.title}
        subtitle={
          <>
            {release.artistName} · {KIND_LABELS[release.kind]}
            {date && ` · ${date}`}
            {release.url && (
              <>
                {" · "}
                <a
                  href={release.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-700 transition-colors hover:text-brand-600 dark:text-brand-300"
                >
                  Link
                </a>
              </>
            )}
          </>
        }
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link className={buttonGhost} href={`/press/${id}/edit`}>
              Edit details
            </Link>
            <form action={toggleReleasePublishedAction}>
              <input type="hidden" name="releaseId" value={id} />
              <input
                type="hidden"
                name="published"
                value={release.published ? "0" : "1"}
              />
              <button className={release.published ? buttonGhost : button}>
                {release.published ? "Unpublish" : "Publish"}
              </button>
            </form>
          </div>
        }
      />

      <Card className={release.published ? "" : "border-dashed"}>
        {release.published && shareUrl ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-300">
                Public
              </p>
              <p className="mt-1.5 truncate text-sm text-muted">{shareUrl}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CopyLink url={shareUrl} />
              <a
                href={`/kit/${release.slug}`}
                target="_blank"
                rel="noreferrer"
                className={actionPill}
              >
                Open
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                Not shared
              </p>
              <p className="mt-1.5 text-sm text-muted text-pretty">
                Publish to get a link you can send to press. Nothing here is
                reachable until you do.
              </p>
            </div>
          </div>
        )}
      </Card>

      {release.notes && (
        <Card className="mt-6">
          <p className="text-sm leading-relaxed text-muted text-pretty">
            {release.notes}
          </p>
        </Card>
      )}

      <Section title={ASSET_RULES.cover.plural} releaseId={id} kind="cover">
        {cover ? (
          <div className="flex flex-wrap items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/press/${id}/asset/${cover.id}?size=sm`}
              alt="Album cover"
              className="h-32 w-32 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{cover.filename}</p>
              <p className="mt-0.5 text-xs text-faint">
                {formatBytes(cover.sizeBytes)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href={`/press/${id}/asset/${cover.id}?download`}
                  className={actionPill}
                >
                  Download
                </a>
                <DeleteAssetButton
                  releaseId={id}
                  assetId={cover.id}
                  filename={cover.filename}
                  className={deletePill}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">No cover yet.</p>
        )}
      </Section>

      <Section title={ASSET_RULES.photo.plural} releaseId={id} kind="photo">
        {photos.length === 0 ? (
          <p className="text-sm text-muted">No press photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo) => (
              <figure key={photo.id} className="min-w-0">
                <a
                  href={`/press/${id}/asset/${photo.id}?size=lg`}
                  target="_blank"
                  rel="noreferrer"
                  className={`block overflow-hidden rounded-2xl ${focusable}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/press/${id}/asset/${photo.id}?size=md`}
                    alt={photo.filename}
                    className="aspect-[4/3] w-full object-cover transition-transform hover:scale-[1.02]"
                  />
                </a>
                <figcaption className="mt-2 min-w-0">
                  <p className="truncate text-xs text-muted">
                    {photo.filename}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <a
                      href={`/press/${id}/asset/${photo.id}?download`}
                      className={actionPill}
                    >
                      Download
                    </a>
                    <DeleteAssetButton
                      releaseId={id}
                      assetId={photo.id}
                      filename={photo.filename}
                      className={deletePill}
                    />
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>

      <Section title={ASSET_RULES.track.plural} releaseId={id} kind="track">
        {tracks.length === 0 ? (
          <p className="text-sm text-muted">No audio yet.</p>
        ) : (
          <ul>
            {tracks.map((track) => (
              <FileRow key={track.id} asset={track} releaseId={id}>
                <div className="mt-3 max-w-lg">
                  <TrackPlayer
                    src={`/press/${id}/asset/${track.id}`}
                    title={track.filename}
                  />
                </div>
              </FileRow>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={ASSET_RULES.document.plural}
        releaseId={id}
        kind="document"
      >
        {documents.length === 0 ? (
          <p className="text-sm text-muted">No documents yet.</p>
        ) : (
          <ul>
            {documents.map((document) => (
              <FileRow key={document.id} asset={document} releaseId={id} />
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
