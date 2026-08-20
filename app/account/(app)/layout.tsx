import { DashboardShell } from "@/app/_components/dashboard-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

/** Wraps /account and everything under it — the auth pages have their own shell. */
export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  return <DashboardShell>{children}</DashboardShell>;
}
