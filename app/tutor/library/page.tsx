import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { getTagsForMaterials, listMaterials, listTags } from "@/lib/dal/tutor";
import {
  Empty,
  KindBadge,
  Panel,
  PanelList,
  PageHeader,
  Pill,
  actionPill,
  actionPillBrand,
  button,
  buttonGhost,
  input,
} from "@/app/_components/ui";
import { DeleteMaterialButton } from "./_components/delete-material-button";

export default async function LibraryPage({
  searchParams,
}: PageProps<"/tutor/library">) {
  const { q, tag } = await searchParams;
  const tutor = await requireAccount();

  const query = typeof q === "string" ? q : undefined;
  const tagId = typeof tag === "string" ? tag : undefined;

  const [materials, tags] = await Promise.all([
    listMaterials(tutor.id, { q: query, tagId }),
    listTags(tutor.id),
  ]);
  const materialTags = await getTagsForMaterials(materials.map((m) => m.id));

  const tagsByMaterial = new Map<string, string[]>();
  for (const row of materialTags) {
    const list = tagsByMaterial.get(row.materialId) ?? [];
    list.push(row.name);
    tagsByMaterial.set(row.materialId, list);
  }

  return (
    <>
      <PageHeader
        title="Library"
        subtitle="PDFs, chord and theory links, and videos — tagged, not foldered."
        action={
          <Link className={button} href="/tutor/library/new">
            Add material
          </Link>
        }
      />

      <form className="mb-5 flex gap-3">
        <input
          className={input}
          name="q"
          placeholder="Search titles and descriptions"
          defaultValue={query ?? ""}
        />
        {tagId && <input type="hidden" name="tag" value={tagId} />}
        <button className={buttonGhost}>Search</button>
      </form>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/tutor/library">
            <Pill active={!tagId}>All</Pill>
          </Link>
          {tags.map((t) => (
            <Link key={t.id} href={`/tutor/library?tag=${t.id}`}>
              <Pill active={tagId === t.id}>
                {t.name}
                <span className="opacity-50 tabular-nums">{t.count}</span>
              </Pill>
            </Link>
          ))}
        </div>
      )}

      {materials.length === 0 ? (
        <Empty>Nothing here yet.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {materials.map((m) => (
              <li key={m.id} className="flex items-start gap-4 px-6 py-5">
                <span className="pt-0.5">
                  <KindBadge kind={m.kind} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    <Link
                      href={`/tutor/library/${m.id}`}
                      className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {m.title}
                    </Link>
                    {m.linkOk === false && (
                      <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        link may be dead
                      </span>
                    )}
                  </p>
                  {m.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted">
                      {m.description}
                    </p>
                  )}
                  {tagsByMaterial.get(m.id) && (
                    <p className="mt-2 text-xs text-faint">
                      {tagsByMaterial.get(m.id)!.join(" · ")}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {m.kind === "pdf" ? (
                    // PDFs get an in-app preview; the file itself is behind
                    // an ownership check, so it can't just be linked to.
                    <Link
                      href={`/tutor/library/${m.id}/view`}
                      className={actionPill}
                    >
                      Open
                    </Link>
                  ) : (
                    m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={actionPill}
                      >
                        Open
                      </a>
                    )
                  )}
                  <Link
                    href={`/tutor/library/${m.id}`}
                    className={actionPillBrand}
                  >
                    Edit
                  </Link>
                  <DeleteMaterialButton
                    materialId={m.id}
                    title={m.title}
                    lessonCount={m.lessonCount}
                    shelfCount={m.shelfCount}
                    className={`${actionPill} hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-700`}
                  />
                </div>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
