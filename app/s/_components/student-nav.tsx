"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusable } from "@/app/_components/ui";

const items = [
  { href: "/s", label: "Lessons" },
  { href: "/s/shelf", label: "Material" },
] as const;

/** Note pages live under a lesson, so they keep "Lessons" highlighted too. */
function isActive(pathname: string, href: string) {
  if (href === "/s") return pathname === "/s" || pathname.startsWith("/s/note");
  return pathname === href || pathname.startsWith(`${href}/`);
}

const portalContainer = "mx-auto w-full max-w-2xl px-6 sm:px-8";

export function StudentNav() {
  const pathname = usePathname();

  return (
    <nav
      className={`${portalContainer} flex items-center gap-0.5 border-t border-line/70 py-1.5`}
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-2.5 py-2 text-xs transition-colors sm:px-4 sm:text-sm ${
              active
                ? "bg-surface-muted text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            } ${focusable}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
