import { AuthShell } from "@/app/_components/auth-shell";

export default function StudentLoginLayout({
  children,
}: LayoutProps<"/login">) {
  return <AuthShell>{children}</AuthShell>;
}
