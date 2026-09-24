import Link from "next/link";
import { FaqSection } from "@/app/_components/marketing/faq-section";
import { linkTerms } from "@/app/_components/linked-terms";
import { container, focusable } from "@/app/_components/ui";
import { TOOL_META, getComparison, type Roundup } from "@/lib/compare";
import { CompareBadge, CompareCta, SourcesSection } from "./compare-parts";

/** "X alternatives" / "Y compared": a list of tools, Trenodo among them. */
export function RoundupView({ item }: { item: Roundup }) {
  const used = new Set<string>();
  const others = item.entries.filter((entry) => !entry.isTrenodo).map((entry) => entry.name);

  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="brand-wash" />
        <div className={container}>
          <div className="max-w-2xl">
            <CompareBadge />
            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              {item.intro}
            </p>
            <p className="mt-4 text-sm text-faint">
              Last checked {item.lastChecked}. Prices in US dollars.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line/70 bg-surface-muted/40 py-20 sm:py-24">
        <div className={container}>
          <ol className="space-y-6">
            {item.entries.map((entry, index) => {
              const versus = entry.compareSlug ? getComparison(entry.compareSlug) : null;

              return (
                <li
                  key={entry.name}
                  className={`rounded-4xl bg-surface p-8 shadow-soft ${
                    entry.isTrenodo ? "border-2 border-brand-500/40" : "border border-line"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium text-brand-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-xl font-semibold tracking-tight">{entry.name}</h2>
                      {entry.isTrenodo && (
                        <span className="rounded-full bg-brand-500/12 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                          That&rsquo;s us
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-muted">
                      {entry.price}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Best for: {entry.bestFor}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                    {entry.isTrenodo ? linkTerms(entry.body, used) : entry.body}
                  </p>
                  {entry.isTrenodo ? (
                    <Link
                      href={TOOL_META[item.tool].href}
                      className={`mt-5 inline-flex text-sm font-medium text-brand-600 hover:underline ${focusable} rounded`}
                    >
                      See {TOOL_META[item.tool].label} →
                    </Link>
                  ) : (
                    versus && (
                      <Link
                        href={`/compare/${versus.slug}`}
                        className={`mt-5 inline-flex text-sm font-medium text-brand-600 hover:underline ${focusable} rounded`}
                      >
                        Trenodo vs {entry.name}, in detail →
                      </Link>
                    )
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <FaqSection items={item.faqs} />

      <SourcesSection sources={item.sources} names={others} />

      <CompareCta tool={item.tool} />
    </>
  );
}
