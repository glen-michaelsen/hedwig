"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { studentLogoutAction } from "@/app/actions";
import { focusable } from "@/app/_components/ui";
import { DotsIcon, LessonsIcon, MaterialIcon, SearchIcon } from "./portal-icons";

const tabs = [
  { href: "/s", label: "Lessons", Icon: LessonsIcon },
  { href: "/s/shelf", label: "Material", Icon: MaterialIcon },
  { href: "/s/search", label: "Search", Icon: SearchIcon },
] as const;

/** Note pages live under a lesson, so they keep "Lessons" highlighted too. */
function isActive(pathname: string, href: string) {
  if (href === "/s") return pathname === "/s" || pathname.startsWith("/s/note");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Phone-sized app chrome for the student portal, mirroring the musician
 * dashboard's `DashboardMobileNav`. This portal has no desktop rail — the
 * top header and tab row cover larger screens — so this only renders below
 * `sm`, where most students actually use it.
 */
export function StudentBottomNav({
  studio,
  studentName,
}: {
  studio: string;
  studentName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

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

  return (
    <>
      <nav
        className="shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-float-up sm:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-2xl items-stretch">
          {tabs.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-muted hover:text-foreground"
                } ${focusable}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              open ? "text-foreground" : "text-muted hover:text-foreground"
            } ${focusable}`}
          >
            <DotsIcon className="h-5 w-5" />
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
          className="fixed inset-0 z-50 flex flex-col bg-background sm:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/70 px-5">
            <span className="truncate text-[15px] font-semibold tracking-tight">
              {studio}
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-foreground ${focusable}`}
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

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
            <p className="text-sm text-muted">Signed in as</p>
            <p className="mt-0.5 text-base font-medium">{studentName}</p>
          </div>

          <div className="border-t border-line/70 px-5 py-4">
            <form action={studentLogoutAction}>
              <button
                className={`w-full rounded-full border border-line px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted ${focusable}`}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
