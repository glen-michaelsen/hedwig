import Link from "next/link";
import type { ReactNode } from "react";
import { requireAccount } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { getPageForAccount } from "@/lib/dal/bio";
import { listReleases } from "@/lib/dal/press";
import { listGigs } from "@/lib/dal/setlist";
import { getDashboard } from "@/lib/dal/tutor";
import { PageHeader, focusable } from "@/app/_components/ui";

/* --------------------------------- icons --------------------------------- */

function Icon({ path }: { path: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {path}
    </svg>
  );
}

const tutorIcon = (
  <Icon
    path={
      <>
        <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h8.4L19 7.1v12.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5z" />
        <path d="M14.5 3v4.5H19" />
        <path d="M8.5 12h7M8.5 15.5h4.5" />
      </>
    }
  />
);

const bioIcon = (
  <Icon
    path={
      <>
        <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7l-1.1 1.1" />
        <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.1-1.1" />
      </>
    }
  />
);

const pressIcon = (
  <Icon
    path={
      <>
        <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l.9-1.8A1 1 0 0 1 9.5 4.6h5a1 1 0 0 1 .9.6L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
        <circle cx="12" cy="12.5" r="3" />
      </>
    }
  />
);

const setlistIcon = (
  <Icon
    path={
      <>
        <path d="M5 6.5h14M5 11h14M5 15.5h8" />
        <circle cx="17" cy="15.5" r="1.8" />
      </>
    }
  />
);

export const metadata = { title: "Home" };

export default async function AccountHomePage() {
  const account = await requireAccount();
  const [{ studentCount, materialCount }, bioPage, releases, gigs, today] =
    await Promise.all([
      getDashboard(account.id),
      getPageForAccount(account.id),
      listReleases(account.id),
      listGigs(account.id),
      todayIso(),
    ]);
  const upcomingGigCount = gigs.filter(
    (gig) => gig.date === null || gig.date >= today,
  ).length;

  return (
    <>
      <PageHeader
        title={`Hello, ${account.name.split(" ")[0]}`}
        subtitle="Your tools. More are on the way."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/tutor"
          className={`group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
            {tutorIcon}
          </span>
          <h2 className="mt-6 text-lg font-semibold tracking-tight">Tutor</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            Your students, your library, and a lesson note for every session.
          </p>
          <p className="mt-5 text-sm tabular-nums text-faint">
            {studentCount} {studentCount === 1 ? "student" : "students"} ·{" "}
            {materialCount} {materialCount === 1 ? "item" : "items"}
          </p>
        </Link>

        <Link
          href="/bio"
          className={`group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
            {bioIcon}
          </span>
          <h2 className="mt-6 text-lg font-semibold tracking-tight">
            Link in Bio
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            One page for everything you point people at — your music, your
            links, your lessons.
          </p>
          <p className="mt-5 text-sm text-faint">
            {bioPage
              ? bioPage.published
                ? `Live at /@${bioPage.handle}`
                : `Draft at /@${bioPage.handle}`
              : "Not set up yet"}
          </p>
        </Link>

        <Link
          href="/press"
          className={`group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
            {pressIcon}
          </span>
          <h2 className="mt-6 text-lg font-semibold tracking-tight">
            Press Kit
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            Cover art, photos, masters and the paperwork — organised by
            release, ready to send.
          </p>
          <p className="mt-5 text-sm tabular-nums text-faint">
            {releases.length === 0
              ? "Not set up yet"
              : `${releases.length} ${releases.length === 1 ? "release" : "releases"}`}
          </p>
        </Link>

        <Link
          href="/setlists"
          className={`group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${focusable}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
            {setlistIcon}
          </span>
          <h2 className="mt-6 text-lg font-semibold tracking-tight">
            Setlists
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            A gig, its sets, and what you&apos;re playing in each.
          </p>
          <p className="mt-5 text-sm tabular-nums text-faint">
            {gigs.length === 0
              ? "Not set up yet"
              : `${upcomingGigCount} upcoming · ${gigs.length} ${gigs.length === 1 ? "gig" : "gigs"}`}
          </p>
        </Link>
      </div>
    </>
  );
}
