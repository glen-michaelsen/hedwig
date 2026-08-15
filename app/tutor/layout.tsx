import { requireAccount } from "@/lib/auth";
import { AppShell } from "@/app/_components/app-shell";

export default async function TutorLayout({
  children,
}: LayoutProps<"/tutor">) {
  const account = await requireAccount();

  return (
    <AppShell
      tool="Tutor"
      email={account.email}
      nav={[
        { href: "/tutor/students", label: "Students" },
        { href: "/tutor/library", label: "Library" },
      ]}
    >
      {children}
    </AppShell>
  );
}
