import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listWaitlist } from "@/lib/dal/waitlist";
import { WAITLIST_FEATURES } from "@/lib/waitlist";
import { Empty, PageHeader, Panel, PanelList, focusable } from "@/app/_components/ui";

// Same reasoning as the Musicians page itself — nothing revalidates this
// path when someone joins the waitlist, so it has to read fresh every visit.
export const dynamic = "force-dynamic";

export const metadata = { title: "Waitlist" };

const FEATURE_LABELS = Object.fromEntries(
  WAITLIST_FEATURES.map((feature) => [feature.key, feature.label]),
);

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function WaitlistPage() {
  await requireAdmin("/account/musicians/waitlist");
  const rows = await listWaitlist();

  return (
    <>
      <Link
        href="/account/musicians"
        className={`inline-flex items-center gap-2 rounded-full px-1 text-sm text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        ← Musicians
      </Link>

      <PageHeader
        title="Waitlist"
        subtitle={
          rows.length === 0
            ? "Nobody's joined yet."
            : `${rows.length} ${rows.length === 1 ? "person" : "people"} waiting, most recent first.`
        }
      />

      {rows.length === 0 ? (
        <Empty>Nobody&rsquo;s joined the waitlist yet.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {rows.map((row) => (
              <li key={row.id} className="px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{row.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      <a
                        href={`mailto:${row.email}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {row.email}
                      </a>
                      {row.phone && (
                        <>
                          {" · "}
                          <a
                            href={`tel:${row.phone}`}
                            className="transition-colors hover:text-foreground"
                          >
                            {row.phone}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-faint">
                    Joined {formatDate(row.createdAt)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {row.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted"
                    >
                      {FEATURE_LABELS[feature] ?? feature}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
