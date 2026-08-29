import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { listArtists, getLatestReleaseTagsForArtist } from "@/lib/dal/press";
import { Card, PageHeader, buttonQuiet } from "@/app/_components/ui";
import { createReleaseAction } from "../actions";
import { ReleaseForm } from "../_components/release-form";

export const metadata = { title: "New release" };

export default async function NewReleasePage() {
  const account = await requireAccount("/press/new");
  const artists = await listArtists(account.id);

  // So picking an existing artist can prefill country/city/label status from
  // their last release — that stuff rarely changes release to release,
  // unlike genre and mood, which stay blank for a new one.
  const artistDefaults = Object.fromEntries(
    await Promise.all(
      artists.map(async (a) => [a.id, await getLatestReleaseTagsForArtist(a.id)] as const),
    ),
  );

  return (
    <>
      <PageHeader
        title="New release"
        subtitle="The details first — cover, photos, tracks and documents come next."
        action={
          <Link className={buttonQuiet} href="/press">
            Cancel
          </Link>
        }
      />

      <Card>
        <ReleaseForm
          action={createReleaseAction}
          artists={artists.map(({ id, name }) => ({ id, name }))}
          artistDefaults={artistDefaults}
          submitLabel="Create release"
        />
      </Card>
    </>
  );
}
