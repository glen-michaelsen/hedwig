import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import {
  getMaterial,
  getMaterialTagNames,
  getMaterialUsage,
  listTags,
} from "@/lib/dal/tutor";
import { PageHeader, actionPill, focusable } from "@/app/_components/ui";
import { DeleteMaterialButton } from "../_components/delete-material-button";
import { EditMaterialForm } from "./_components/edit-material-form";

export async function generateMetadata({
  params,
}: PageProps<"/tutor/library/[id]">) {
  const { id } = await params;
  const tutor = await requireAccount();
  const material = await getMaterial(tutor.id, id);
  return { title: material ? `Material: ${material.title}` : "Library" };
}

export default async function EditMaterialPage({
  params,
}: PageProps<"/tutor/library/[id]">) {
  const { id } = await params;
  const tutor = await requireAccount();

  const material = await getMaterial(tutor.id, id);
  if (!material) notFound();

  const [tags, selectedTags, usage] = await Promise.all([
    listTags(tutor.id),
    getMaterialTagNames(id),
    getMaterialUsage(id),
  ]);

  return (
    <>
      <Link
        href="/tutor/library"
        className={`inline-flex items-center gap-2 rounded-full px-1 text-sm text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        ← Library
      </Link>

      <div className="mt-5">
        <PageHeader
          title="Edit material"
          action={
            material.kind === "pdf" ? (
              <Link href={`/tutor/library/${id}/view`} className={actionPill}>
                Preview PDF
              </Link>
            ) : material.url ? (
              <a
                href={material.url}
                target="_blank"
                rel="noreferrer noopener"
                className={actionPill}
              >
                Open
              </a>
            ) : undefined
          }
        />
      </div>

      <EditMaterialForm
        material={{
          id: material.id,
          kind: material.kind,
          title: material.title,
          description: material.description,
          url: material.url,
          sizeBytes: material.sizeBytes,
        }}
        allTags={tags.map((t) => t.name)}
        selectedTags={selectedTags}
      />

      <div className="mt-12 border-t border-line pt-8">
        <DeleteMaterialButton
          materialId={id}
          title={material.title}
          lessonCount={usage.lessonCount}
          shelfCount={usage.shelfCount}
          label="Delete this material"
          className="text-sm text-rose-600 transition-opacity hover:opacity-70"
        />
        <p className="mt-2 text-xs text-faint">
          It disappears from every shelf and lesson note it was attached to.
        </p>
      </div>
    </>
  );
}
