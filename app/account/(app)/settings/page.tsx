import { requireAccount } from "@/lib/auth";
import { getDashboard } from "@/lib/dal/tutor";
import { Card, PageHeader, label } from "@/app/_components/ui";

export default async function SettingsPage() {
  const tutor = await requireAccount();
  const { studentCount, materialCount } = await getDashboard(tutor.id);

  return (
    <>
      <PageHeader title="Settings" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <p className={label}>Name students see</p>
          <p className="text-lg font-medium tracking-tight">
            {tutor.studioName || tutor.name}
          </p>
          <p className="mt-1.5 text-sm text-muted">{tutor.email}</p>
        </Card>

        <Card>
          <p className={label}>Usage</p>
          <p className="text-lg font-medium tracking-tight tabular-nums">
            {studentCount} students · {materialCount} library items
          </p>
          <p className="mt-1.5 text-xs text-faint">
            Storage quotas aren&rsquo;t enforced yet — see the README.
          </p>
        </Card>
      </div>
    </>
  );
}
