import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getNoteForStudent } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { MaterialList } from "@/app/s/_components/material-list";
import { SectionTitle, focusable } from "@/app/_components/ui";

export default async function NotePage({ params }: PageProps<"/s/note/[id]">) {
  const { id } = await params;
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const note = await getNoteForStudent(student.id, id);
  if (!note) notFound();

  return (
    <>
      <Link
        href="/s"
        className={`inline-flex items-center gap-2 rounded-full px-1 text-sm text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        ← All lessons
      </Link>

      <h1 className="mt-5 mb-10 text-3xl font-semibold tracking-tight tabular-nums">
        {note.date}
      </h1>

      <div className="space-y-10">
        {note.summaryShared && (
          <section>
            <SectionTitle>What we covered</SectionTitle>
            <p className="whitespace-pre-wrap leading-relaxed text-pretty">
              {note.summaryShared}
            </p>
          </section>
        )}

        {note.homework && (
          <section className="rounded-4xl border border-brand-300/50 bg-brand-500/[0.06] p-7 shadow-soft dark:border-brand-700/50 sm:p-8">
            <SectionTitle>Homework</SectionTitle>
            <p className="whitespace-pre-wrap leading-relaxed text-pretty">
              {note.homework}
            </p>
          </section>
        )}

        {note.materials.length > 0 && (
          <section>
            <SectionTitle>From this lesson</SectionTitle>
            <MaterialList materials={note.materials} />
          </section>
        )}
      </div>
    </>
  );
}
