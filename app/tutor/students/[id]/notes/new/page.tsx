import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { getStudent, listMaterials } from "@/lib/dal/tutor";
import { PageHeader } from "@/app/_components/ui";
import { NoteForm } from "../../_components/note-form";

/** Only accept a date the calendar could have produced. */
function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function generateMetadata({
  params,
}: PageProps<"/tutor/students/[id]/notes/new">) {
  const { id } = await params;
  const tutor = await requireAccount(`/tutor/students/${id}/notes/new`);
  const student = await getStudent(tutor.id, id);
  return { title: student ? `New lesson: ${student.name}` : "New lesson" };
}

export default async function NewNotePage({
  params,
  searchParams,
}: PageProps<"/tutor/students/[id]/notes/new">) {
  const { id } = await params;
  const { date } = await searchParams;
  const tutor = await requireAccount(`/tutor/students/${id}/notes/new`);

  const student = await getStudent(tutor.id, id);
  if (!student) notFound();

  const [materials, today] = await Promise.all([
    listMaterials(tutor.id),
    todayIso(),
  ]);

  return (
    <>
      <PageHeader
        title={`Lesson with ${student.name}`}
        subtitle="What you write in the shared section is what they'll see in their feed."
      />
      <NoteForm
        studentId={id}
        materials={materials}
        defaultDate={validDate(date) ? date : today}
      />
    </>
  );
}
