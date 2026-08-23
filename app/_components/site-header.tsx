import Link from "next/link";
import type { NavItem } from "./nav-items";
import { featureItems, loginItems } from "./nav-items";
import { DesktopNav, MobileNav } from "./site-nav";
import { Wordmark, container, focusable } from "./ui";

/**
 * Public header. Both sign-in doors live under one "Log in" menu and are
 * always in the same order — a student on a shared family phone shouldn't
 * have to work out which one is theirs.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
      <div className={`${container} flex h-18 items-center justify-between`}>
        <Link href="/" className={`rounded-xl ${focusable}`}>
          <Wordmark className="h-10" />
        </Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}

/**
 * A column of footer links, e.g. "Features" or "Log in". More columns will
 * join these two as further tools ship — see nav-items.ts.
 */
function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-linear-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
      <div className={`${container} py-16 sm:py-20`}>
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Wordmark className="h-8" variant="white" />
            <p className="mt-4 text-sm leading-relaxed text-white/70 text-pretty">
              Making life simpler and more efficient for musicians.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <FooterColumn title="Features" items={featureItems} />
            <FooterColumn title="Log in" items={loginItems} />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Trenodo</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/ideas" className="transition-colors hover:text-white">
              Ideas
            </Link>
            <Link
              href="/account/signup"
              className="transition-colors hover:text-white"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
