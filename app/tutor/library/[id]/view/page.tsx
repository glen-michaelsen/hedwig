import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getMaterial } from "@/lib/dal/tutor";
import {
  KindBadge,
  actionPill,
  actionPillBrand,
  focusable,
} from "@/app/_components/ui";

export async function generateMetadata({
  params,
}: PageProps<"/tutor/library/[id]/view">) {
  const { id } = await params;
  const tutor = await requireAccount(`/tutor/library/${id}/view`);
  const material = await getMaterial(tutor.id, id);
  return { title: material ? material.title : "Library" };
}

export default async function ViewMaterialPage({
  params,
}: PageProps<"/tutor/library/[id]/view">) {
  const { id } = await params;
  const tutor = await requireAccount(`/tutor/library/${id}/view`);

  const material = await getMaterial(tutor.id, id);
  if (!material) notFound();

  // Only PDFs are previewed in-app; everything else lives at its own URL.
  if (material.kind !== "pdf") {
    if (material.url) redirect(material.url);
    notFound();
  }

  return (
    <>
      <Link
        href="/tutor/library"
        className={`inline-flex items-center gap-2 rounded-full px-1 text-sm text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        ← Library
      </Link>

      <div className="mt-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <KindBadge kind={material.kind} />
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {material.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/tutor/library/${id}/file`}
            target="_blank"
            rel="noreferrer"
            className={actionPill}
          >
            Open in new tab
          </a>
          <Link href={`/tutor/library/${id}`} className={actionPillBrand}>
            Edit
          </Link>
        </div>
      </div>

      {material.description && (
        <p className="mb-6 text-sm leading-relaxed text-muted">
          {material.description}
        </p>
      )}

      <div className="overflow-hidden rounded-4xl border border-line bg-surface-muted shadow-soft">
        <iframe
          src={`/tutor/library/${id}/file`}
          title={material.title}
          className="h-[78vh] w-full"
        />
      </div>

      <p className="mt-4 text-xs text-faint">
        Not showing? Some browsers block embedded PDFs — use “Open in new tab”.
      </p>
    </>
  );
}
