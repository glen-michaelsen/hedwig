import { requireAccount } from "@/lib/auth";
import { listTags } from "@/lib/dal/tutor";
import { PageHeader } from "@/app/_components/ui";
import { MaterialForm } from "./_components/material-form";

export const metadata = { title: "Add material" };

export default async function NewMaterialPage() {
  const tutor = await requireAccount();
  const tags = await listTags(tutor.id);

  return (
    <>
      <PageHeader title="Add material" />
      <MaterialForm allTags={tags.map((t) => t.name)} />
    </>
  );
}
