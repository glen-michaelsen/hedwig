import { DashboardShell } from "@/app/_components/dashboard-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

export default async function BioLayout({ children }: LayoutProps<"/bio">) {
  return <DashboardShell>{children}</DashboardShell>;
}
