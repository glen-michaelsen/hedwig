import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container, focusable } from "@/app/_components/ui";
import {
  COMPARISONS,
  TOOL_META,
  comparisonTitle,
  type CompareTool,
} from "@/lib/compare";

const PAGE_DESCRIPTION =
  "Honest comparisons between Trenodo and other tools musicians use. Link in bio, press kits, music teaching and setlists, including where the other tool is the better choice.";

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

const TOOL_ORDER: CompareTool[] = ["link-in-bio", "press-kit", "tutor", "setlist"];

export default function ComparePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
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
          </div>
        </section>

        <div className={`${container} space-y-16 pb-24 sm:pb-32`}>
          {TOOL_ORDER.map((tool) => {
            const items = COMPARISONS.filter((item) => item.tool === tool);
            if (items.length === 0) return null;

            return (
              <section key={tool}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
                  {TOOL_META[tool].label}
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/compare/${item.slug}`}
                      className={`group flex flex-col rounded-4xl bg-surface p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable} ${
                        item.kind === "roundup" ? "border-2 border-brand-500/40" : "border border-line"
                      }`}
                    >
                      {item.kind === "roundup" && (
                        <span className="mb-2 text-xs font-medium text-muted">
                          Overview
                        </span>
                      )}
                      <h3 className="text-lg font-semibold tracking-tight">
                        {comparisonTitle(item)}
                      </h3>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted text-pretty">
                        {item.description}
                      </p>
                      <span className="mt-5 text-sm font-medium text-brand-600">
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
              </section>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
