import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { containerNarrow, focusable } from "@/app/_components/ui";
import { linkTerms } from "@/app/_components/linked-terms";

/**
 * Shared shell for every long-form guide under /knowledge — breadcrumb,
 * title, intro, then whatever sections the page passes in. One place for
 * the article's typography so forty guides don't each reinvent it.
 */
export function GuideLayout({
  category,
  categoryHref,
  title,
  intro,
  children,
}: {
  /** The pillar the guide belongs to. Leave both out for a guide that sits straight under Knowledge. */
  category?: string;
  categoryHref?: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-14 sm:py-20">
        <article className={containerNarrow}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-faint">
            <Link
              href="/knowledge"
              className={`transition-colors hover:text-foreground ${focusable} rounded`}
            >
              Knowledge
            </Link>
            {category && categoryHref && (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={categoryHref}
                  className={`transition-colors hover:text-foreground ${focusable} rounded`}
                >
                  {category}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            {intro}
          </p>

          <div className="mt-12 space-y-12">{children}</div>

          <div className="mt-16 border-t border-line pt-8">
            <Link
              href={categoryHref ?? "/knowledge"}
              className={`text-sm font-medium text-muted transition-colors hover:text-foreground ${focusable} rounded`}
            >
              ← Back to {category ?? "Knowledge"}
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}

export function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted text-pretty">
        {children}
      </div>
    </section>
  );
}

/**
 * A numbered step with an icon, for how-to guides. Consecutive steps are
 * joined by a thin rail from one icon to the next, so the page reads as a
 * route rather than a stack of sections. Leave `rail` off the last step.
 */
export function GuideStep({
  step,
  icon,
  title,
  rail = true,
  id,
  children,
}: {
  step?: number;
  icon: ReactNode;
  title: string;
  rail?: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 sm:pl-20">
      {rail && (
        <span
          aria-hidden="true"
          className="absolute -bottom-12 left-7 top-16 hidden w-px bg-linear-to-b from-brand-500/30 to-line sm:block"
        />
      )}
      {/* Icon beside the heading on a phone; in its own column, on the rail, from sm up. */}
      <div className="flex items-center gap-4 sm:block">
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-700 ring-1 ring-brand-500/15 sm:absolute sm:left-0 sm:top-0 sm:h-14 sm:w-14">
          {icon}
          {step !== undefined && (
            <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white ring-2 ring-background">
              {step}
            </span>
          )}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-balance sm:pt-3">{title}</h2>
      </div>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted text-pretty">{children}</div>
    </section>
  );
}

/**
 * Native <details>/<summary> rather than a React-state accordion — the
 * disclosure behaviour, keyboard support and screen-reader semantics all
 * come from the browser for free, and every guide page stays a plain
 * server component with no client JS shipped just to fold a question shut.
 */
export function GuideFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const used = new Set<string>();

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Frequently asked questions
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line open:bg-surface-muted/60"
          >
            <summary
              className={`flex list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden ${focusable} cursor-pointer rounded-2xl`}
            >
              {item.q}
              <svg
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="h-3 w-3 shrink-0 text-muted transition-transform group-open:rotate-180"
              >
                <path
                  d="M2.5 4.5 6 8l3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="px-5 pb-4 text-base leading-relaxed text-muted text-pretty">
              {linkTerms(item.a, used)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** A related-guide card, used at the bottom of an article to keep readers moving through the instrument's other guides. */
export function GuideCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-4xl border border-line bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
    >
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        {body}
      </p>
    </Link>
  );
}
