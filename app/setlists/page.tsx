import Link from "next/link";
import { requireAccount } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { listGigs, type GigRow } from "@/lib/dal/setlist";
import { GigRowMenu } from "./_components/gig-row-menu";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  button,
  focusable,
} from "@/app/_components/ui";

export const metadata = { title: "Setlists" };

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

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

function GigList({ gigs }: { gigs: GigRow[] }) {
  return (
    <Panel>
      <PanelList>
        {gigs.map((gig) => (
          // The row is a "stretched link": the anchor covers the whole li so
          // the row stays clickable, and the row menu sits on top of it
          // (pointer-events re-enabled) rather than nested inside it, so
          // opening it can't also trigger the navigation underneath.
          <li key={gig.id} className="relative">
            <Link
              href={`/setlists/${gig.id}`}
              className={`absolute inset-0 transition-colors hover:bg-surface-muted ${focusable}`}
              aria-label={gig.name}
            />
            {/* `relative` matters: the stretched link above is a positioned
                element with a hover background, so static content paints
                *under* it and disappears the moment the row is hovered.
                Positioning the content puts it back on top; it stays
                pointer-events-none so clicks still reach the link. */}
            <div className="pointer-events-none relative flex items-center gap-4 px-6 py-4">
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
              <div className="pointer-events-auto shrink-0">
                <GigRowMenu gigId={gig.id} gigName={gig.name} />
              </div>
            </div>
          </li>
        ))}
      </PanelList>
    </Panel>
  );
}

export default async function SetlistsPage({
  searchParams,
}: PageProps<"/setlists">) {
  const account = await requireAccount("/setlists");
  const { show } = await searchParams;

  const [gigs, today] = await Promise.all([listGigs(account.id), todayIso()]);

  // A gig on today's date is still upcoming — you play it tonight. Undated
  // ones sit with upcoming too: they're plans, not history.
  const upcoming = gigs.filter((gig) => gig.date === null || gig.date >= today);
  // Most recent first, so last night's gig is at the top where it's most
  // likely to be reused.
  const past = gigs
    .filter((gig) => gig.date !== null && gig.date < today)
    .reverse();

  const tab: TabKey =
    typeof show === "string" && TABS.some((entry) => entry.key === show)
      ? (show as TabKey)
      : "upcoming";

  const shown = tab === "upcoming" ? upcoming : past;
  const counts = { upcoming: upcoming.length, past: past.length };

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

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((entry) => (
          <Link
            key={entry.key}
            href={`/setlists?show=${entry.key}`}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              tab === entry.key
                ? "border-transparent bg-brand-600 text-white"
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
            } ${focusable}`}
          >
            {entry.label}
            <span
              className={`tabular-nums ${
                tab === entry.key ? "text-white/70" : "text-faint"
              }`}
            >
              {counts[entry.key]}
            </span>
          </Link>
        ))}
      </div>

      {gigs.length === 0 ? (
        <Empty>No gigs yet. Add one and start building the sets.</Empty>
      ) : shown.length === 0 ? (
        <Empty>
          {tab === "upcoming" ? "Nothing booked yet." : "No past gigs."}
        </Empty>
      ) : (
        <GigList gigs={shown} />
      )}
    </>
  );
}
