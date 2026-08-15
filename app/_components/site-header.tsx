import Link from "next/link";
import { Wordmark, button, buttonGhost, container, focusable } from "./ui";

/**
 * Public header. The two sign-in doors are always visible and always in the
 * same place — a student on a shared family phone shouldn't have to work out
 * which one is theirs.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
      <div className={`${container} flex h-18 items-center justify-between`}>
        <Link href="/" className={`rounded-xl ${focusable}`}>
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-2.5">
          <Link href="/login" className={buttonGhost}>
            Student
          </Link>
          {/* "Musician", not "Tutor" — the account may never teach. */}
          <Link href="/account/login" className={button}>
            Musician
          </Link>
        </nav>
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
        <Wordmark className="opacity-70" />
        <nav className="flex flex-wrap items-center gap-6 text-sm text-muted">
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
