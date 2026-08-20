import { DashboardShell } from "@/app/_components/dashboard-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

export default async function TutorLayout({
  children,
}: LayoutProps<"/tutor">) {
  return <DashboardShell>{children}</DashboardShell>;
}
