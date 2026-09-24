import Link from "next/link";
import { linkTerms } from "@/app/_components/linked-terms";
import {
  button,
  buttonGhost,
  buttonLarge,
  containerNarrow,
  focusable,
} from "@/app/_components/ui";
import { TOOL_META, type CompareTool, type Source } from "@/lib/compare";

/** Pieces both compare templates share. */

export function CompareBadge() {
  return (
    <Link
      href="/compare"
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft transition-colors hover:text-foreground ${focusable}`}
    >
      <span aria-hidden>⚖️</span>
      Compare
    </Link>
  );
}

export function CheckList({ items }: { items: readonly string[] }) {
  const used = new Set<string>();

  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
          <span
            aria-hidden
            className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
              <path
                d="m5 10.5 3 3 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>{linkTerms(item, used)}</span>
        </li>
      ))}
    </ul>
  );
}

export function SourcesSection({
  sources,
  names,
}: {
  sources: readonly Source[];
  /** The other tools on the page, for the trademark line. */
  names: string[];
}) {
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

  return (
    <section className={`${containerNarrow} py-16`}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
        Sources
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`text-brand-700 hover:underline ${focusable} rounded`}
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-muted text-pretty">
        Spotted something that&rsquo;s out of date? Tell us on the{" "}
        <Link href="/ideas" className={`text-brand-700 hover:underline ${focusable} rounded`}>
          Ideas page
        </Link>
        , and we fix it. {list} {names.length === 1 ? "is a trademark" : "are trademarks"} of
        their owners. Trenodo is not connected to {names.length === 1 ? "it" : "them"} in any way.
      </p>
    </section>
  );
}

export function CompareCta({ tool }: { tool: CompareTool }) {
  const meta = TOOL_META[tool];

  return (
    <section className={`${containerNarrow} pb-24 sm:pb-32`}>
      <div className="brand-wash-clip relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
        <div className="brand-wash" />
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          {meta.ctaTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          {meta.ctaBody}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Create your free account
          </Link>
          <Link href={meta.href} className={`${buttonGhost} ${buttonLarge}`}>
            See {meta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
