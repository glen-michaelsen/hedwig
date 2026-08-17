import Link from "next/link";
import { featureItems } from "./nav-items";
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

export function SiteFooter() {
  return (
    <footer className="border-t border-line/70 py-12">
      <div
        className={`${container} flex flex-wrap items-center justify-between gap-6`}
      >
        <Wordmark className="h-7 opacity-70" />
        <nav className="flex flex-wrap items-center gap-6 text-sm text-muted">
          {featureItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/ideas" className="transition-colors hover:text-foreground">
            Ideas
          </Link>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Student sign in
          </Link>
          <Link
            href="/account/login"
            className="transition-colors hover:text-foreground"
          >
            Musician sign in
          </Link>
          <Link
            href="/account/signup"
            className="transition-colors hover:text-foreground"
          >
            Create an account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
