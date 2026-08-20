import { AuthShell } from "@/app/_components/auth-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

/** Wraps /account/login and /account/signup — the dashboard has its own chrome. */
export default function AdminAuthLayout({
  children,
}: LayoutProps<"/tutor">) {
  return <AuthShell>{children}</AuthShell>;
}
