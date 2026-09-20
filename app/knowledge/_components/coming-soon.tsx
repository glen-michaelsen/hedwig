import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { buttonGhost, containerNarrow } from "@/app/_components/ui";

/**
 * Every Knowledge pillar page is this same shell until it has real guides —
 * one component so the "coming soon" treatment changes in one place, not
 * eleven, as pages fill in one at a time.
 */
export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <SiteHeader />

      <main className="relative isolate flex-1 overflow-hidden py-20 sm:py-28">
        <div className="brand-wash" />
        <div className={`${containerNarrow} text-center`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
            {eyebrow}
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {description}
          </p>

          <p className="mx-auto mt-9 inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong px-5 py-2.5 text-sm font-medium text-muted">
            Guides are on the way
          </p>

          <div className="mt-8">
            <Link href="/knowledge" className={buttonGhost}>
              ← All Knowledge guides
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
