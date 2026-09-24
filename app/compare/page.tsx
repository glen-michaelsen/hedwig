import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Honest comparisons between Trenodo and other tools musicians use. Including where the other tool is the better choice.";

export const metadata: Metadata = {
  title: "Compare Trenodo With Other Music Tools | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare Trenodo With Other Music Tools",
    description: PAGE_DESCRIPTION,
    url: "/compare",
    siteName: "Trenodo",
    type: "website",
  },
};

/** One entry per comparison page. More tools join as their pages are written. */
const COMPARISONS = [
  {
    href: "/compare/linktree",
    tool: "Link in Bio",
    title: "Trenodo vs Linktree",
    body: "Price, music features, branding, analytics and fees. And where Linktree is the better pick.",
  },
];

export default function ComparePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="brand-wash" />
          <div className={container}>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
                <span aria-hidden>⚖️</span>
                Compare
              </span>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
                Honest comparisons.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
                How Trenodo stacks up against other tools musicians use. Every
                fact about the other tool is linked to its source. And when
                the other tool is the better choice for you, we say so.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {COMPARISONS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
                    {item.tool}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted text-pretty">
                    {item.body}
                  </p>
                  <span className="mt-6 text-sm font-medium text-brand-600">
                    Read the comparison{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
