import { AuthShell } from "@/app/_components/auth-shell";

/** Wraps /account/login and /account/signup — the dashboard has its own chrome. */
export default function AdminAuthLayout({
  children,
}: LayoutProps<"/tutor">) {
  return <AuthShell>{children}</AuthShell>;
}
