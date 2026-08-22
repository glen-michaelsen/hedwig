import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { Card, PageHeader, buttonQuiet } from "@/app/_components/ui";
import { GigForm } from "./_components/gig-form";

export const metadata = { title: "New gig" };

export default async function NewGigPage() {
  await requireAccount("/setlists/new");

  return (
    <>
      <PageHeader
        title="New gig"
        subtitle="Name the night and how long you're playing — songs come next."
        action={
          <Link className={buttonQuiet} href="/setlists">
            Cancel
          </Link>
        }
      />

      <Card>
        <GigForm />
      </Card>
    </>
  );
}
