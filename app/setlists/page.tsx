import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { listGigs } from "@/lib/dal/setlist";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  button,
  focusable,
} from "@/app/_components/ui";

function formatDate(value: string | null) {
  if (!value) return "No date yet";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export const metadata = { title: "Setlists" };

export default async function SetlistsPage() {
  const account = await requireAccount();
  const gigs = await listGigs(account.id);

  return (
    <>
      <PageHeader
        title="Setlists"
        subtitle="A gig, its sets, and what you're playing in each."
        action={
          <Link className={button} href="/setlists/new">
            New gig
          </Link>
        }
      />

      {gigs.length === 0 ? (
        <Empty>No gigs yet. Add one and start building the sets.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {gigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/setlists/${gig.id}`}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted ${focusable}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{gig.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {formatDate(gig.date)}
                      {gig.location && ` · ${gig.location}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {gig.setCount} {gig.setCount === 1 ? "set" : "sets"} ·{" "}
                    {gig.songCount} {gig.songCount === 1 ? "song" : "songs"}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
