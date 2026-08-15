import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { listStudents } from "@/lib/dal/tutor";
import { formatPhone } from "@/lib/phone";
import {
  Empty,
  Panel,
  PanelList,
  PageHeader,
  SectionTitle,
  panelRow,
} from "@/app/_components/ui";
import { AddStudentForm } from "./_components/add-student-form";

function formatLastSeen(date: Date | null) {
  if (!date) return "never signed in";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "seen today";
  if (days === 1) return "seen yesterday";
  if (days < 30) return `seen ${days} days ago`;
  return `seen ${Math.floor(days / 30)} months ago`;
}

export default async function StudentsPage() {
  const tutor = await requireAccount();
  const students = await listStudents(tutor.id);

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Each student signs in with their phone number and a PIN — no email, no account."
      />

      {students.length === 0 ? (
        <Empty>No students yet.</Empty>
      ) : (
        <Panel className="mb-14">
          <PanelList>
            {students.map((s) => (
              <li key={s.id}>
                <Link href={`/tutor/students/${s.id}`} className={panelRow}>
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
                      {[
                        s.phone ? formatPhone(s.phone) : null,
                        s.instrument,
                        s.level,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "No details yet"}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-faint sm:block">
                    {formatLastSeen(s.lastSeenAt)}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}

      <SectionTitle>Add a student</SectionTitle>
      <AddStudentForm />
    </>
  );
}
