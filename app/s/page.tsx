import Link from "next/link";
import { redirect } from "next/navigation";
import { getFeed } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { Empty, PageHeader } from "@/app/_components/ui";

export default async function FeedPage() {
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const notes = await getFeed(student.id);

  return (
    <>
      <PageHeader
        title={`Hi ${student.name.split(" ")[0]}`}
        subtitle={
          notes.length > 0
            ? "Your most recent lesson is at the top."
            : undefined
        }
      />

      {notes.length === 0 ? (
        <Empty>Nothing from your teacher yet.</Empty>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/s/note/${note.id}`}
                className="block rounded-4xl border border-line bg-surface p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] tabular-nums text-brand-600 dark:text-brand-400">
                  {note.date}
                </p>

                {note.summaryShared && (
                  <p className="mt-3 line-clamp-2 leading-relaxed text-pretty">
                    {note.summaryShared}
                  </p>
                )}

                {(note.homework || note.materialCount > 0) && (
                  <p className="mt-5 flex flex-wrap gap-2 text-xs">
                    {note.homework && (
                      <span className="rounded-full bg-surface-muted px-3 py-1.5 text-muted">
                        Homework
                      </span>
                    )}
                    {note.materialCount > 0 && (
                      <span className="rounded-full bg-surface-muted px-3 py-1.5 text-muted">
                        {note.materialCount}{" "}
                        {note.materialCount === 1 ? "item" : "items"}
                      </span>
                    )}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
