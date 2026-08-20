import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { listArtists } from "@/lib/dal/press";
import { Card, PageHeader, buttonQuiet } from "@/app/_components/ui";
import { createReleaseAction } from "../actions";
import { ReleaseForm } from "../_components/release-form";

export const metadata = { title: "New release" };

export default async function NewReleasePage() {
  const account = await requireAccount();
  const artists = await listArtists(account.id);

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
          submitLabel="Create release"
        />
      </Card>
    </>
  );
}
