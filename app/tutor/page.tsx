import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { getDashboard } from "@/lib/dal/tutor";
import {
  Empty,
  Panel,
  PanelList,
  PageHeader,
  SectionTitle,
  buttonGhost,
  panelRow,
} from "@/app/_components/ui";

function StatCard({
  value,
  label,
  href,
  cta,
}: {
  value: number;
  label: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <p className="text-5xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted">{label}</p>
      <Link className={`${buttonGhost} mt-7`} href={href}>
        {cta}
      </Link>
    </div>
  );
}

export const metadata = { title: "Tutor" };

export default async function DashboardPage() {
  const tutor = await requireAccount("/tutor");
  const { studentCount, materialCount, recentNotes } = await getDashboard(
    tutor.id,
  );

  return (
    <>
      <PageHeader
        title={tutor.studioName || tutor.name}
        subtitle="Everything your students see comes from a lesson note or their shelf."
      />

      <div className="mb-14 grid gap-6 sm:grid-cols-2">
        <StatCard
          value={studentCount}
          label={studentCount === 1 ? "student" : "students"}
          href="/tutor/students"
          cta="Manage students"
        />
        <StatCard
          value={materialCount}
          label={`${materialCount === 1 ? "item" : "items"} in your library`}
          href="/tutor/library"
          cta="Open library"
        />
      </div>

      <SectionTitle>Recent lessons</SectionTitle>
      {recentNotes.length === 0 ? (
        <Empty>
          No lesson notes yet. Add a student, then write up your first lesson.
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
    </>
  );
}
