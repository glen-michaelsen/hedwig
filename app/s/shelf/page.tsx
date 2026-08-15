import { redirect } from "next/navigation";
import { getStudentLibrary } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { PageHeader } from "@/app/_components/ui";
import { StudentLibrary } from "@/app/s/_components/student-library";

export default async function ShelfPage() {
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const { onShelf, fromLessons } = await getStudentLibrary(student.id);

  return (
    <>
      <PageHeader
        title="My material"
        subtitle="Everything your teacher has shared with you, in one place."
      />
      <StudentLibrary onShelf={onShelf} fromLessons={fromLessons} />
    </>
  );
}
