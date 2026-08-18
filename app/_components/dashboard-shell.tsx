import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/account/actions";
import { isAdmin, requireAccount } from "@/lib/auth";
import {
  DashboardMobileNav,
  DashboardSidebar,
  type ShellGroup,
  type ShellItem,
} from "./dashboard-nav";
import {
  HomeIcon,
  IdeasIcon,
  LinkInBioIcon,
  PressKitIcon,
  SettingsIcon,
  SpotlightIcon,
  TutorIcon,
} from "./nav-icons";
import { Wordmark, focusable } from "./ui";

/**
 * Chrome for everything a signed-in musician sees.
 *
 * The rail is grouped rather than flat: tools are the reason to be here and
 * grow over time, while Admin is a different kind of thing entirely and only
 * exists for one account — putting it in its own group keeps it from reading
 * as another feature of the product.
 */
export async function DashboardShell({ children }: { children: ReactNode }) {
  const account = await requireAccount();
  const admin = await isAdmin(account);

  const toolItems: ShellItem[] = [
    { href: "/tutor", label: "Tutor", icon: <TutorIcon /> },
    { href: "/bio", label: "Link in Bio", icon: <LinkInBioIcon /> },
    { href: "/press", label: "Press Kit", icon: <PressKitIcon /> },
  ];

  const groups: ShellGroup[] = [
    {
      items: [
        { href: "/account", label: "Home", exact: true, icon: <HomeIcon /> },
      ],
    },
    { title: "Tools", items: toolItems },
    ...(admin
      ? [
          {
            title: "Admin",
            items: [
              {
                href: "/account/spotlight",
                label: "Spotlight",
                icon: <SpotlightIcon />,
              },
              { href: "/account/ideas", label: "Ideas", icon: <IdeasIcon /> },
            ],
          } satisfies ShellGroup,
        ]
      : []),
    {
      title: "Account",
      items: [
        {
          href: "/account/settings",
          label: "Settings",
          icon: <SettingsIcon />,
        },
      ],
    },
  ];

  const footer = (
    <div className="px-3">
      <p className="truncate text-xs text-faint" title={account.email}>
        {account.email}
      </p>
      <form action={signOutAction}>
        <button
          className={`mt-1.5 rounded-full text-xs text-muted transition-colors hover:text-foreground ${focusable}`}
        >
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-1">
      <DashboardSidebar groups={groups} footer={footer} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-line/70 bg-background/80 px-5 backdrop-blur-xl lg:hidden">
          <Link href="/account" className={`block ${focusable}`}>
            <Wordmark className="h-7" />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 pb-28 sm:px-8 sm:py-14 sm:pb-32 lg:pb-14">
          {children}
        </main>

        <DashboardMobileNav tools={toolItems} groups={groups} footer={footer} />
      </div>
    </div>
  );
}
