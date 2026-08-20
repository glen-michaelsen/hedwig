import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getSetlist } from "@/lib/dal/setlist";
import { PageHeader, buttonGhost } from "@/app/_components/ui";
import { SetlistBoard } from "./_components/setlist-board";
import { GigDetails } from "./_components/gig-details";

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export async function generateMetadata({
  params,
}: PageProps<"/setlists/[id]">) {
  const { id } = await params;
  const account = await requireAccount();
  const data = await getSetlist(account.id, id);
  return { title: data ? `Setlist: ${data.gig.name}` : "Setlists" };
}

export default async function SetlistPage({
  params,
}: PageProps<"/setlists/[id]">) {
  const { id } = await params;
  const account = await requireAccount();

  const data = await getSetlist(account.id, id);
  if (!data) notFound();

  const { gig, sets } = data;
  const date = formatDate(gig.date);

  return (
    <>
      <PageHeader
        title={gig.name}
        subtitle={
          [date, gig.location].filter(Boolean).join(" · ") || "No date set"
        }
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link className={buttonGhost} href="/setlists">
              All gigs
            </Link>
            <Link className={buttonGhost} href={`/setlists/${id}/print`}>
              Print view
            </Link>
          </div>
        }
      />

      <GigDetails
        gigId={gig.id}
        name={gig.name}
        date={gig.date}
        location={gig.location}
        notes={gig.notes}
      />

      <div className="mt-8">
        <SetlistBoard
          gigId={gig.id}
          sets={sets.map((set) => ({
            id: set.id,
            name: set.name,
            targetMinutes: set.targetMinutes,
            songs: set.songs.map((song) => ({
              id: song.id,
              title: song.title,
              artist: song.artist,
              durationSeconds: song.durationSeconds,
              note: song.note,
            })),
          }))}
        />
      </div>
    </>
  );
}
