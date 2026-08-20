import { DashboardShell } from "@/app/_components/dashboard-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

export default async function PressLayout({
  children,
}: LayoutProps<"/press">) {
  return <DashboardShell>{children}</DashboardShell>;
}
