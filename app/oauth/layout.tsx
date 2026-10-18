import { AuthShell } from "@/app/_components/auth-shell";

export { dashboardMetadata as metadata } from "@/lib/metadata";

export default function OAuthLayout({ children }: LayoutProps<"/oauth">) {
  return <AuthShell>{children}</AuthShell>;
}
