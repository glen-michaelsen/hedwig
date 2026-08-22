import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getNote, getStudent, listMaterials } from "@/lib/dal/tutor";
import { PageHeader } from "@/app/_components/ui";
import { deleteNoteAction } from "../../../../actions";
import { NoteForm } from "../../_components/note-form";

export async function generateMetadata({
  params,
}: PageProps<"/tutor/students/[id]/notes/[noteId]">) {
  const { id, noteId } = await params;
  const tutor = await requireAccount(`/tutor/students/${id}/notes/${noteId}`);
  const [student, note] = await Promise.all([
    getStudent(tutor.id, id),
    getNote(tutor.id, noteId),
  ]);
  if (!student || !note || note.studentId !== id) return { title: "Lesson note" };
  return { title: `${student.name} — ${note.date}` };
}

export default async function EditNotePage({
  params,
}: PageProps<"/tutor/students/[id]/notes/[noteId]">) {
  const { id, noteId } = await params;
  const tutor = await requireAccount(`/tutor/students/${id}/notes/${noteId}`);

  const [student, note] = await Promise.all([
    getStudent(tutor.id, id),
    getNote(tutor.id, noteId),
  ]);
  if (!student || !note || note.studentId !== id) notFound();

  const materials = await listMaterials(tutor.id);

  return (
    <>
      <PageHeader title={`${student.name} — ${note.date}`} />

      <NoteForm
        studentId={id}
        materials={materials}
        note={{
          id: note.id,
          date: note.date,
          summaryShared: note.summaryShared,
          homework: note.homework,
          notesPrivate: note.notesPrivate,
          materialIds: note.materials.map((m) => m.id),
        }}
      />

      <form action={deleteNoteAction} className="mt-12 border-t border-line pt-8">
        <input type="hidden" name="studentId" value={id} />
        <input type="hidden" name="noteId" value={noteId} />
        <button className="text-sm text-rose-600 transition-opacity hover:opacity-70 dark:text-rose-400">
          Delete this lesson note
        </button>
      </form>
    </>
  );
}
