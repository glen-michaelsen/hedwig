import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/account/actions";
import { getAccount, isAdmin } from "@/lib/auth";
import {
  DashboardMobileNav,
  DashboardSidebar,
  type ShellGroup,
  type ShellItem,
} from "./dashboard-nav";
import { SubmitButton } from "./submit-button";
import { Wordmark, focusable } from "./ui";
import { ViewportLock } from "./viewport-lock";

/**
 * Chrome for everything a signed-in musician sees.
 *
 * The rail is grouped rather than flat: tools are the reason to be here and
 * grow over time, while Admin is a different kind of thing entirely and only
 * exists for one account — putting it in its own group keeps it from reading
 * as another feature of the product.
 */
export async function DashboardShell({ children }: { children: ReactNode }) {
  // Deliberately getAccount rather than requireAccount: this is a layout,
  // so it renders above the page and its redirect would fire first — losing
  // the return path the page builds from its own params.
  //
  // The children still have to be rendered, though. Returning null here
  // means the page never runs, so its redirect never happens and the
  // visitor gets a blank screen. Rendering them without the chrome lets the
  // page redirect with the path it knows; nothing is painted either way,
  // because that redirect throws before anything reaches the browser.
  const account = await getAccount();
  if (!account) return <>{children}</>;
  const admin = await isAdmin(account);

  const toolItems: ShellItem[] = [
    { href: "/tutor", label: "Tutor", icon: "tutor" },
    { href: "/bio", label: "Link in Bio", icon: "bio" },
    { href: "/press", label: "Press Kit", icon: "press" },
    { href: "/setlists", label: "Setlists", icon: "setlists" },
  ];

  const groups: ShellGroup[] = [
    {
      items: [
        { href: "/account", label: "Home", exact: true, icon: "home" },
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
                icon: "spotlight",
              },
              { href: "/account/ideas", label: "Ideas", icon: "ideas" },
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
          icon: "settings",
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
        <SubmitButton
          className={`mt-1.5 rounded-full text-xs text-muted transition-colors hover:text-foreground ${focusable}`}
          pendingLabel="Signing out…"
        >
          Sign out
        </SubmitButton>
      </form>
    </div>
  );

  return (
    // Fixed to the screen, with only `main` scrolling inside it — not the
    // page. A fixed/sticky bar pinned to a scrolling page gets dragged
    // around as Safari's own toolbar collapses and expands during scroll;
    // chrome that's simply outside the scroll region never has that problem.
    <div className="flex h-[var(--app-vh,100dvh)] overflow-hidden">
      <ViewportLock />
      <DashboardSidebar groups={groups} footer={footer} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-line/70 bg-background/80 px-5 backdrop-blur-xl lg:hidden">
          <Link href="/account" className={`block ${focusable}`}>
            <Wordmark className="h-7" />
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
            {children}
          </div>
        </main>

        <DashboardMobileNav tools={toolItems} groups={groups} footer={footer} />
      </div>
    </div>
  );
}
