import { DashboardShell } from "@/app/_components/dashboard-shell";

export default async function TutorLayout({
  children,
}: LayoutProps<"/tutor">) {
  return <DashboardShell>{children}</DashboardShell>;
}
