"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Wordmark, focusable } from "./ui";
import {
  HomeIcon,
  IdeasIcon,
  LinkInBioIcon,
  MoreIcon,
  PressKitIcon,
  SetlistIcon,
  SettingsIcon,
  SpotlightIcon,
  TutorIcon,
} from "./nav-icons";

/**
 * Icons are named here rather than passed in.
 *
 * The shell that builds this menu is a server component and these are client
 * components, so anything crossing that boundary has to survive being
 * serialised. A React element does; a component function does not — it throws
 * at render, which is exactly what a earlier version of this file did.
 */
const ICONS = {
  home: HomeIcon,
  tutor: TutorIcon,
  bio: LinkInBioIcon,
  press: PressKitIcon,
  spotlight: SpotlightIcon,
  ideas: IdeasIcon,
  setlists: SetlistIcon,
  settings: SettingsIcon,
} as const;

export type IconName = keyof typeof ICONS;

export type ShellItem = {
  href: string;
  label: string;
  /**
   * Match this href exactly. Needed for section roots like /account, which
   * would otherwise light up on every page nested beneath them.
   */
  exact?: boolean;
  /**
   * Which icon, by name. The rail draws it at 16px and the bottom bar at
   * 20px: naming it lets each place ask for the size it needs, where passing
   * a pre-rendered element would only allow a wrapper that lies about it.
   */
  icon?: IconName;
};

export type ShellGroup = {
  /** Omitted for the first group, which needs no heading. */
  title?: string;
  items: ShellItem[];
};

function Glyph({ name, className }: { name: IconName; className: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}

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
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-500/12 text-brand-700 dark:text-brand-300"
                      : "text-muted hover:bg-surface-muted hover:text-foreground"
                  } ${focusable}`}
                >
                  {item.icon && <Glyph name={item.icon} className="h-4 w-4 shrink-0" />}
                  {item.label}
                </Link>
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

/**
 * Below lg the rail becomes a fixed bottom bar with the tool shortcuts plus
 * a "More" tab that opens a full-screen overlay of the whole menu.
 */
export function DashboardMobileNav({
  tools,
  groups,
  footer,
}: {
  /** The handful of tool shortcuts shown directly in the bottom bar. */
  tools: ShellItem[];
  /** The full menu, shown in the "More" overlay. */
  groups: ShellGroup[];
  footer: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  // Closed during render rather than in an effect, so the overlay is already
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

  const onATool = tools.some((item) => isActive(pathname, item.href));

  return (
    <>
      <nav
        className="shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-float-up lg:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-5xl items-stretch">
          {tools.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-muted hover:text-foreground"
                } ${focusable}`}
              >
                {item.icon && <Glyph name={item.icon} className="h-5 w-5" />}
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              open || !onATool
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            } ${focusable}`}
          >
            <MoreIcon className="h-5 w-5" />
            More
          </button>
        </div>
      </nav>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/70 px-5">
            <Link
              href="/account"
              className={`block ${focusable}`}
              onClick={() => setOpen(false)}
            >
              <Wordmark className="h-7" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-foreground ${focusable}`}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                <path
                  d="m5 5 10 10M15 5 5 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <NavItems groups={groups} />
          </div>

          <div className="border-t border-line/70 px-4 py-4">{footer}</div>
        </div>
      )}
    </>
  );
}
