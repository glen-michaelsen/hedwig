import { redirect } from "next/navigation";
import { getFeed, getStudentLibrary } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { PageHeader } from "@/app/_components/ui";
import { StudentSearch } from "@/app/s/_components/student-search";

export default async function SearchPage() {
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const [notes, { onShelf, fromLessons }] = await Promise.all([
    getFeed(student.id),
    getStudentLibrary(student.id),
  ]);

  return (
    <>
      <PageHeader
        title="Search"
        subtitle="Find a lesson or a piece of material."
      />
      <StudentSearch notes={notes} onShelf={onShelf} fromLessons={fromLessons} />
    </>
  );
}
