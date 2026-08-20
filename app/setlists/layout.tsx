import { DashboardShell } from "@/app/_components/dashboard-shell";

export default async function SetlistsLayout({
  children,
}: LayoutProps<"/setlists">) {
  return <DashboardShell>{children}</DashboardShell>;
}
