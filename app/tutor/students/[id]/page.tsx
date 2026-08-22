import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import {
  getPhoneSiblings,
  getShelf,
  getStudent,
  getTagsForMaterials,
  listMaterials,
  listNotes,
} from "@/lib/dal/tutor";
import { todayIso } from "@/lib/clock";
import { formatPhone } from "@/lib/phone";
import { EditStudentModal } from "./_components/edit-student-modal";
import { LessonNotes } from "./_components/lesson-notes";
import { PinMaterialModal } from "./_components/pin-material-modal";
import {
  Empty,
  KindBadge,
  Panel,
  PanelList,
  PageHeader,
  SectionTitle,
  button,
  panelRow,
} from "@/app/_components/ui";
import { deleteStudentAction, unpinFromShelfAction } from "../../actions";
import { AccessPanel } from "./_components/access-panel";

export async function generateMetadata({
  params,
}: PageProps<"/tutor/students/[id]">) {
  const { id } = await params;
  const tutor = await requireAccount(`/tutor/students/${id}`);
  const student = await getStudent(tutor.id, id);
  return { title: student ? `Student: ${student.name}` : "Students" };
}

export default async function StudentPage({
  params,
}: PageProps<"/tutor/students/[id]">) {
  const { id } = await params;
  const tutor = await requireAccount(`/tutor/students/${id}`);

  const student = await getStudent(tutor.id, id);
  if (!student) notFound();

  const [notes, shelf, materials, siblings, today] = await Promise.all([
    listNotes(tutor.id, id),
    getShelf(tutor.id, id),
    listMaterials(tutor.id),
    student.phone ? getPhoneSiblings(tutor.id, id, student.phone) : [],
    todayIso(),
  ]);

  // Tags come along so the picker can filter without another round trip.
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
        title={student.name}
        subtitle={
          [student.instrument, student.level].filter(Boolean).join(" · ") ||
          undefined
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            <EditStudentModal
              student={{
                id,
                name: student.name,
                phone: student.phone,
                instrument: student.instrument,
                level: student.level,
                parentEmail: student.parentEmail,
                active: student.active,
              }}
            />
            <Link className={button} href={`/tutor/students/${id}/notes/new`}>
              Write lesson note
            </Link>
          </div>
        }
      />

      <div className="space-y-14">
        <AccessPanel
          studentId={id}
          phone={student.phone ? formatPhone(student.phone) : null}
          lockedUntilLabel={student.lockedUntilLabel}
          siblings={siblings}
        />

        <section>
          <LessonNotes
            studentId={id}
            today={today}
            notes={notes.map((note) => ({
              id: note.id,
              date: note.date,
              summaryShared: note.summaryShared,
              // The private half never crosses into a client component.
              hasHomework: Boolean(note.homework),
              materialCount: note.materialCount,
            }))}
          />
        </section>

        <section>
          <SectionTitle
            hint={`Always available to ${student.name}, regardless of which lesson it came from.`}
          >
            Shelf
          </SectionTitle>

          {shelf.length === 0 ? (
            <Empty>Nothing pinned.</Empty>
          ) : (
            <Panel className="mb-5">
              <PanelList>
                {shelf.map((m) => (
                  <li key={m.id} className={panelRow}>
                    <KindBadge kind={m.kind} />
                    <span className="flex-1 truncate text-sm">{m.title}</span>
                    <form action={unpinFromShelfAction}>
                      <input type="hidden" name="studentId" value={id} />
                      <input type="hidden" name="materialId" value={m.id} />
                      <button className="text-xs text-faint transition-colors hover:text-foreground">
                        Unpin
                      </button>
                    </form>
                  </li>
                ))}
              </PanelList>
            </Panel>
          )}

          <PinMaterialModal
            studentId={id}
            studentName={student.name}
            materials={materials.map((m) => ({
              id: m.id,
              kind: m.kind,
              title: m.title,
              description: m.description,
              tags: tagsByMaterial.get(m.id) ?? [],
            }))}
            pinnedIds={shelf.map((m) => m.id)}
          />
        </section>

        <section className="border-t border-line pt-8">
          <form action={deleteStudentAction}>
            <input type="hidden" name="studentId" value={id} />
            <button className="text-sm text-rose-600 transition-opacity hover:opacity-70 dark:text-rose-400">
              Delete {student.name} and all their lesson notes
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
