import type { ReactNode } from "react";
import { container } from "@/app/_components/ui";
import { linkTerms } from "@/app/_components/linked-terms";

/**
 * The numbered "how it works" steps on each tool page. Same dark purple
 * treatment as the tools section on the front page: white cards with a
 * deep shadow, so the three steps pop off the page.
 */
export function StepsSection({
  title,
  children,
  steps,
}: {
  title: string;
  /** The intro line under the heading. */
  children: ReactNode;
  steps: readonly { n: string; title: string; body: string }[];
}) {
  const used = new Set<string>();

  return (
    <section className="bg-linear-to-br from-brand-700 via-brand-800 to-brand-900 py-24 sm:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-200">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white text-balance">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75 text-pretty">
            {children}
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/35"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/12 font-mono text-sm font-semibold text-brand-600">
                {step.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted text-pretty">
                {linkTerms(step.body, used)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
