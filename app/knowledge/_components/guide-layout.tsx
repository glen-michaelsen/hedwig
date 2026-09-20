import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { containerNarrow, focusable } from "@/app/_components/ui";

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
  category: string;
  categoryHref: string;
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
            <span aria-hidden="true">/</span>
            <Link
              href={categoryHref}
              className={`transition-colors hover:text-foreground ${focusable} rounded`}
            >
              {category}
            </Link>
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
              href={categoryHref}
              className={`text-sm font-medium text-muted transition-colors hover:text-foreground ${focusable} rounded`}
            >
              ← Back to {category}
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

export function GuideFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">
        Frequently asked questions
      </h2>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.q}>
            <h3 className="text-base font-semibold">{item.q}</h3>
            <p className="mt-1.5 text-base leading-relaxed text-muted text-pretty">
              {item.a}
            </p>
          </div>
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
