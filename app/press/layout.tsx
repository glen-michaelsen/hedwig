import { DashboardShell } from "@/app/_components/dashboard-shell";

export default async function PressLayout({
  children,
}: LayoutProps<"/press">) {
  return <DashboardShell>{children}</DashboardShell>;
}
