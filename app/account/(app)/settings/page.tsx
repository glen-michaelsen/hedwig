import { requireAccount } from "@/lib/auth";
import { PageHeader } from "@/app/_components/ui";
import { ChangeEmailForm } from "./_components/change-email-form";
import { ChangePasswordForm } from "./_components/change-password-form";

export default async function SettingsPage() {
  const tutor = await requireAccount();

  return (
    <>
      <PageHeader title="Settings" />

      <div className="grid gap-6 sm:grid-cols-2">
        <ChangeEmailForm currentEmail={tutor.email} />
        <ChangePasswordForm />
      </div>
    </>
  );
}
