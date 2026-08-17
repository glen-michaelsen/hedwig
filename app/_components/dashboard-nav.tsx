"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Wordmark, focusable } from "./ui";

export type ShellItem = {
  href: string;
  label: string;
  /**
   * Match this href exactly. Needed for section roots like /account, which
   * would otherwise light up on every page nested beneath them.
   */
  exact?: boolean;
  /** Revealed only while this tool is the one being used. */
  children?: { href: string; label: string }[];
};

export type ShellGroup = {
  /** Omitted for the first group, which needs no heading. */
  title?: string;
  items: ShellItem[];
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItems({ groups }: { groups: ShellGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-7">
      {groups.map((group, index) => (
        <div key={group.title ?? index}>
          {group.title && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
              {group.title}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : isActive(pathname, item.href);
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-500/12 text-brand-700 dark:text-brand-300"
                        : "text-muted hover:bg-surface-muted hover:text-foreground"
                    } ${focusable}`}
                  >
                    {item.label}
                  </Link>

                  {/* Sub-pages appear only inside their own tool — showing
                      every tool's pages at once turns the rail into a menu
                      of everything the app can do. */}
                  {active && item.children && item.children.length > 0 && (
                    <div className="mt-0.5 flex flex-col gap-0.5 border-l border-line pl-3 ml-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={
                            isActive(pathname, child.href) ? "page" : undefined
                          }
                          className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                            isActive(pathname, child.href)
                              ? "text-foreground"
                              : "text-muted hover:text-foreground"
                          } ${focusable}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

/** The rail itself, from lg up. */
export function DashboardSidebar({
  groups,
  footer,
}: {
  groups: ShellGroup[];
  footer: ReactNode;
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line/70 bg-surface/40 px-4 py-6 lg:flex">
      <Link href="/account" className={`mb-8 block px-3 ${focusable}`}>
        <Wordmark className="h-8" />
      </Link>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavItems groups={groups} />
      </div>

      <div className="border-t border-line/70 pt-4">{footer}</div>
    </aside>
  );
}

/** Below lg the rail becomes a drawer behind a button in the top bar. */
export function DashboardMobileNav({
  groups,
  footer,
}: {
  groups: ShellGroup[];
  footer: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  // Closed during render rather than in an effect, so the drawer is already
  // gone in the same pass that paints the page it navigated to.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-foreground ${focusable}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          {open ? (
            <path
              d="m5 5 10 10M15 5 5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-foreground/25 backdrop-blur-sm lg:hidden"
          />
          <div
            id={panelId}
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-line bg-surface px-4 py-6 shadow-float lg:hidden"
          >
            <Link href="/account" className={`mb-8 block px-3 ${focusable}`}>
              <Wordmark className="h-8" />
            </Link>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <NavItems groups={groups} />
            </div>

            <div className="border-t border-line/70 pt-4">{footer}</div>
          </div>
        </>
      )}
    </>
  );
}
