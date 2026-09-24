import { containerNarrow, focusable } from "@/app/_components/ui";
import { linkTerms } from "@/app/_components/linked-terms";

/**
 * The "Before you ask" block on the marketing pages. Every question folds
 * in and out, same as GuideFaq in the Knowledge guides. Native
 * <details>/<summary>, so it needs no client JS, works with the keyboard,
 * and the answers stay in the HTML for search engines and the JSON-LD.
 */
export function FaqSection({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  // Shared by every answer, so a feature links once per FAQ.
  const used = new Set<string>();

  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={containerNarrow}>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
          Questions
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
          Before you ask
        </h2>

        <div className="mt-12 space-y-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-3xl border border-line bg-surface shadow-soft"
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 text-lg font-semibold tracking-tight text-balance [&::-webkit-details-marker]:hidden ${focusable}`}
              >
                {item.q}
                <svg
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-open:rotate-180"
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
              <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted text-pretty">
                {linkTerms(item.a, used)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
