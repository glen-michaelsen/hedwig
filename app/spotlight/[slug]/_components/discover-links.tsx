import Link from "next/link";
import { focusable } from "@/app/_components/ui";
import type { DiscoverStatus } from "@/lib/discover/pages";

/** The live Discover pages this article is on: "More Danish female singers →". */
export function DiscoverLinks({ pages }: { pages: DiscoverStatus[] }) {
  if (pages.length === 0) return null;

  return (
    <nav aria-label="More like this" className="mt-12">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        More like this
      </p>
      <ul className="flex flex-wrap gap-2">
        {pages.map((status) => (
          <li key={status.page.slug}>
            <Link
              href={`/discover/${status.page.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium transition-colors hover:border-line-strong ${focusable}`}
            >
              More {status.page.phrase} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
