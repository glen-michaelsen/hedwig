"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { focusable } from "./ui";

/**
 * An in-text link to a feature's own page. On that page itself it stays
 * plain text: a link to where you already are helps nobody.
 *
 * A client component only for usePathname. It still renders on the server,
 * so the link is in the HTML search engines read.
 */
export function TermLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === href) return <>{children}</>;

  return (
    <Link
      href={href}
      className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
    >
      {children}
    </Link>
  );
}
