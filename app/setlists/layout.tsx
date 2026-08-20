import { DashboardShell } from "@/app/_components/dashboard-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

export default async function SetlistsLayout({
  children,
}: LayoutProps<"/setlists">) {
  return <DashboardShell>{children}</DashboardShell>;
}
