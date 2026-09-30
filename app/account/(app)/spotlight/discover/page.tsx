import Link from "next/link";
import { Card, Empty, PageHeader, buttonQuiet, focusable } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { getDiscover } from "@/lib/discover";
import { GO_LIVE_AT, STAY_LIVE_AT, type DiscoverStatus } from "@/lib/discover/pages";

export const metadata = { title: "Discover pages" };

const REASONS: Record<DiscoverStatus["reason"], string> = {
  live: "Live",
  "too-few": "Needs more",
  "same-as-parent": "Same list as a broader page",
  "one-country": "Only one Nordic country so far",
};

/**
 * Every Discover page with at least one Spotlight, and how close it is to
 * going live. The "Needs more" rows nearest the line are the ones one more
 * Spotlight would open up: a to-do list for who to feature next.
 */
export default async function DiscoverAdminPage() {
  await requireAdmin("/account/spotlight/discover");
  const { statuses } = await getDiscover();

  const rows = [...statuses].sort(
    (a, b) =>
      Number(b.live) - Number(a.live) ||
      Number(b.reason === "too-few") - Number(a.reason === "too-few") ||
      b.ids.length - a.ids.length ||
      a.page.words.length - b.page.words.length,
  );
  const liveCount = rows.filter((status) => status.live).length;

  return (
    <>
      <PageHeader
        title="Discover pages"
        subtitle={`${liveCount} live. A page opens at ${GO_LIVE_AT} Spotlights and stays open down to ${STAY_LIVE_AT}.`}
        action={
          <Link className={buttonQuiet} href="/account/spotlight">
            ← Spotlight
          </Link>
        }
      />

      {rows.length === 0 ? (
        <Empty>No live Spotlight has tags yet. Genre, country and gender on the release fill this in.</Empty>
      ) : (
        <Card>
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                <th scope="col" className="pb-2 pr-3 font-semibold">Page</th>
                <th scope="col" className="w-20 pb-2 pr-3 font-semibold">Spotlights</th>
                <th scope="col" className="hidden w-56 pb-2 font-semibold sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((status) => (
                <tr key={status.page.slug} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-3">
                    <Link
                      href={`/discover/${status.page.slug}`}
                      className={`rounded font-medium hover:text-brand-700 ${focusable}`}
                    >
                      {status.page.title}
                    </Link>
                    <span className="mt-0.5 block truncate text-xs text-faint">
                      /discover/{status.page.slug}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums">
                    {status.live ? status.ids.length : `${status.ids.length}/${GO_LIVE_AT}`}
                  </td>
                  <td className="hidden py-2.5 sm:table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        status.live
                          ? "bg-emerald-500/12 text-emerald-700"
                          : status.reason === "too-few"
                            ? "bg-brand-500/10 text-brand-700"
                            : "bg-surface-muted text-muted"
                      }`}
                    >
                      {REASONS[status.reason]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
