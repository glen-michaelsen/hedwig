import { requireAccount } from "@/lib/auth";
import { AppShell } from "@/app/_components/app-shell";

/** Wraps /account and /account/settings — the auth pages have their own shell. */
export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  const account = await requireAccount();

  return (
    <AppShell email={account.email} nav={[{ href: "/account/settings", label: "Settings" }]}>
      {children}
    </AppShell>
  );
}
