import { DashboardShell } from "@/app/_components/dashboard-shell";

export default async function BioLayout({ children }: LayoutProps<"/bio">) {
  return <DashboardShell>{children}</DashboardShell>;
}
