import { isAdmin, requireAccount } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { PageHeader } from "@/app/_components/ui";
import { ChangeEmailForm } from "./_components/change-email-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { ClaudeConnections } from "./_components/claude-connections";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const tutor = await requireAccount("/account/settings");
  const [admin, env] = await Promise.all([isAdmin(tutor), getEnv()]);

  return (
    <>
      <PageHeader title="Settings" />

      <div className="grid gap-6 sm:grid-cols-2">
        <ChangeEmailForm currentEmail={tutor.email} />
        <ChangePasswordForm />
        {admin && <ClaudeConnections adminId={tutor.id} appUrl={env.APP_URL} />}
      </div>
    </>
  );
}
