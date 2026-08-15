import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/account/actions";
import { NavLink, Wordmark, container, focusable } from "./ui";

export type ShellNavItem = { href: string; label: string };

/**
 * Chrome for every signed-in page. The wordmark goes to the tool dashboard
 * rather than the marketing page — once you're inside, "home" means your
 * tools, not the pitch.
 */
export function AppShell({
  tool,
  nav,
  email,
  children,
}: {
  /** Name of the current tool, shown next to the wordmark. */
  tool?: string;
  nav?: ShellNavItem[];
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
        <div className={`${container} flex h-18 items-center gap-1`}>
          <Link href="/account" className={`rounded-xl ${focusable}`}>
            <Wordmark />
          </Link>

          {tool && (
            <span className="ml-3 hidden items-center gap-3 sm:flex">
              <span aria-hidden className="text-faint">
                /
              </span>
              <span className="text-[15px] font-medium">{tool}</span>
            </span>
          )}

          {nav && nav.length > 0 && (
            <nav className="ml-5 flex items-center gap-0.5">
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          <form action={signOutAction} className="ml-auto">
            <button
              className={`rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground ${focusable}`}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className={`${container} flex-1 py-12 sm:py-16`}>{children}</main>

      <footer className={`${container} py-10 text-xs text-faint`}>
        Signed in as {email}
      </footer>
    </div>
  );
}
