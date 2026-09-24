import { FaqSection } from "@/app/_components/marketing/faq-section";
import { linkTerms } from "@/app/_components/linked-terms";
import { container } from "@/app/_components/ui";
import type { Versus } from "@/lib/compare";
import { CheckList, CompareBadge, CompareCta, SourcesSection } from "./compare-parts";

/** "Trenodo vs X": the short answer, the feature table, where each wins. */
export function VersusView({ item }: { item: Versus }) {
  // One set for the whole table, so each feature links once in it.
  const used = new Set<string>();

  return (
    <>
      <section className="relative isolate overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="brand-wash" />
        <div className={container}>
          <div className="max-w-2xl">
            <CompareBadge />
            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              Trenodo vs {item.competitor}
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

      <section className="border-y border-line/70 bg-surface-muted/40 py-20 sm:py-24">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            The short answer
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-4xl border border-line bg-surface p-8 shadow-soft">
              <h2 className="text-xl font-semibold tracking-tight">
                Choose {item.competitor} if…
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                {item.chooseThem}
              </p>
            </div>
            <div className="rounded-4xl border-2 border-brand-500/40 bg-surface p-8 shadow-soft">
              <h2 className="text-xl font-semibold tracking-tight">Choose Trenodo if…</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                {item.chooseUs}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${container} py-24 sm:py-32`}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            Side by side
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Feature by feature
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-4xl border border-line bg-surface shadow-soft">
          <div className="grid grid-cols-2 border-b border-line bg-surface-muted/60 text-sm font-semibold sm:grid-cols-[1.1fr_1fr_1fr]">
            <div className="hidden px-6 py-4 text-muted sm:block">Feature</div>
            <div className="px-5 py-4 text-brand-700 sm:px-6">Trenodo</div>
            <div className="px-5 py-4 sm:px-6">{item.competitor}</div>
          </div>

          {item.rows.map((group) => (
            <div key={group.group}>
              <div className="border-b border-line bg-surface-muted/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:px-6">
                {group.group}
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-2 border-b border-line last:border-b-0 sm:grid-cols-[1.1fr_1fr_1fr]"
                >
                  <div className="col-span-2 px-5 pt-4 text-[15px] font-semibold sm:col-span-1 sm:px-6 sm:py-4">
                    {row.feature}
                  </div>
                  <div className="px-5 py-3 text-sm leading-relaxed text-foreground text-pretty sm:px-6 sm:py-4">
                    {linkTerms(row.trenodo, used)}
                  </div>
                  <div className="px-5 py-3 text-sm leading-relaxed text-muted text-pretty sm:px-6 sm:py-4">
                    {row.them}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-br from-brand-700 via-brand-800 to-brand-900 py-24 sm:py-32">
        <div className={container}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-200">
              Credit where it&rsquo;s due
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white text-balance">
              Where each one wins
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/35">
              <h3 className="text-lg font-semibold tracking-tight">
                {item.competitor} is stronger at
              </h3>
              <CheckList items={item.theyWin} />
            </div>
            <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/35">
              <h3 className="text-lg font-semibold tracking-tight">Trenodo is stronger at</h3>
              <CheckList items={item.weWin} />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={item.faqs} />

      <SourcesSection sources={item.sources} names={[item.competitor]} />

      <CompareCta tool={item.tool} />
    </>
  );
}
