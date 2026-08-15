import { requireAccount } from "@/lib/auth";
import { AppShell } from "@/app/_components/app-shell";

export default async function BioLayout({ children }: LayoutProps<"/bio">) {
  const account = await requireAccount();

  return (
    <AppShell tool="Link in Bio" email={account.email}>
      {children}
    </AppShell>
  );
}
