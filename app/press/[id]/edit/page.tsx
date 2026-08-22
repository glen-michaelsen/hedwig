import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getRelease, listArtists } from "@/lib/dal/press";
import { Card, PageHeader, buttonQuiet } from "@/app/_components/ui";
import { updateReleaseAction } from "../../actions";
import { ReleaseForm } from "../../_components/release-form";
import { DeleteReleaseButton } from "./_components/delete-release-button";

export async function generateMetadata({
  params,
}: PageProps<"/press/[id]/edit">) {
  const { id } = await params;
  const account = await requireAccount(`/press/${id}/edit`);
  const release = await getRelease(account.id, id);
  return { title: release ? `Edit release: ${release.title}` : "Edit release" };
}

export default async function EditReleasePage({
  params,
}: PageProps<"/press/[id]/edit">) {
  const { id } = await params;
  const account = await requireAccount(`/press/${id}/edit`);

  const [release, artists] = await Promise.all([
    getRelease(account.id, id),
    listArtists(account.id),
  ]);
  if (!release) notFound();

  return (
    <>
      <PageHeader
        title="Edit release"
        subtitle={release.title}
        action={
          <Link className={buttonQuiet} href={`/press/${id}`}>
            Cancel
          </Link>
        }
      />

      <Card>
        <ReleaseForm
          action={updateReleaseAction}
          artists={artists.map(({ id: artistId, name }) => ({
            id: artistId,
            name,
          }))}
          defaults={{
            id: release.id,
            artistId: release.artistId,
            title: release.title,
            kind: release.kind,
            url: release.url,
            releaseDate: release.releaseDate,
            notes: release.notes,
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
            Deleting this release removes every file attached to it — cover,
            photos, audio and documents — from storage as well.
          </p>
          <div className="mt-5">
            <DeleteReleaseButton releaseId={release.id} title={release.title} />
          </div>
        </Card>
      </section>
    </>
  );
}
