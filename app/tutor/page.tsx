import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { getDashboard, listTags } from "@/lib/dal/tutor";
import { RecentMaterialsPanel } from "./_components/recent-materials-panel";
import {
  Empty,
  Panel,
  PanelList,
  PageHeader,
  SectionTitle,
  actionPill,
  actionPillBrand,
  panelRow,
} from "@/app/_components/ui";

const STUDENT_ROWS = 5;

export const metadata = { title: "Tutor" };

export default async function DashboardPage() {
  const tutor = await requireAccount("/tutor");
  const [{ students, recentMaterials, recentNotes }, tags] = await Promise.all(
    [getDashboard(tutor.id), listTags(tutor.id)],
  );

  const shownStudents = students.slice(0, STUDENT_ROWS);

  return (
    <>
      <PageHeader
        title={tutor.studioName || tutor.name}
        subtitle="Everything your students see comes from a lesson note or their shelf."
      />

      <section className="mb-14">
        <SectionTitle>Students</SectionTitle>

        {students.length === 0 ? (
          <Empty>
            No students yet. Add one, then write up your first lesson.
          </Empty>
        ) : (
          <Panel>
            <PanelList>
              {shownStudents.map((s) => (
                <li key={s.id} className={panelRow}>
                  <Link
                    href={`/tutor/students/${s.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/12 text-sm font-semibold text-brand-700 dark:text-brand-300">
                      {s.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {s.name}
                        {!s.active && (
                          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-faint">
                            inactive
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block truncate text-xs text-faint">
                        {[s.instrument, s.level].filter(Boolean).join(" · ") ||
                          "No details yet"}
                      </span>
                    </span>
                  </Link>

                  <div className="flex shrink-0 items-center gap-2">
                    {s.latestNoteId ? (
                      <Link
                        href={`/tutor/students/${s.id}/notes/${s.latestNoteId}`}
                        className={actionPill}
                      >
                        Last lesson
                      </Link>
                    ) : (
                      <span className={`${actionPill} pointer-events-none opacity-40`}>
                        No lessons yet
                      </span>
                    )}
                    <Link
                      href={`/tutor/students/${s.id}/notes/new`}
                      className={actionPillBrand}
                    >
                      New note
                    </Link>
                  </div>
                </li>
              ))}

              {students.length > STUDENT_ROWS && (
                <li>
                  <Link
                    href="/tutor/students"
                    className="block px-6 py-3 text-center text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    View all {students.length} students
                  </Link>
                </li>
              )}
            </PanelList>
          </Panel>
        )}
      </section>

      <div className="grid gap-14 lg:grid-cols-2">
        <section>
          <SectionTitle>Recent lessons</SectionTitle>
          {recentNotes.length === 0 ? (
            <Empty>
              No lesson notes yet. Add a student, then write up your first
              lesson.
            </Empty>
          ) : (
            <Panel>
              <PanelList>
                {recentNotes.map((note) => (
                  <li key={note.id}>
                    <Link
                      href={`/tutor/students/${note.studentId}/notes/${note.id}`}
                      className={panelRow}
                    >
                      <span className="flex-1 text-sm font-medium">
                        {note.studentName}
                      </span>
                      <span className="text-sm tabular-nums text-faint">
                        {note.date}
                      </span>
                    </Link>
                  </li>
                ))}
              </PanelList>
            </Panel>
          )}
        </section>

        <RecentMaterialsPanel
          materials={recentMaterials}
          allTags={tags.map((t) => t.name)}
        />
      </div>
    </>
  );
}
