import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import { getSetlist } from "@/lib/dal/setlist";
import { formatDuration, formatLength } from "@/lib/setlist/duration";
import { actionPill } from "@/app/_components/ui";

/**
 * The version that goes on the stage floor: big type, no chrome, black on
 * white. Deliberately not the dashboard shell — a rail and a nav bar are
 * wasted ink and wasted space at arm's length in the dark.
 */
export default async function SetlistPrintPage({
  params,
}: PageProps<"/setlists/[id]/print">) {
  const { id } = await params;
  const account = await requireAccount();

  const data = await getSetlist(account.id, id);
  if (!data) notFound();

  const { gig, sets } = data;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
        <Link href={`/setlists/${id}`} className={actionPill}>
          ← Back to editor
        </Link>
        <p className="text-xs text-faint">Use your browser&rsquo;s print dialog</p>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{gig.name}</h1>
      {(gig.date ?? gig.location) && (
        <p className="mt-1 text-sm text-muted print:text-black">
          {[gig.date, gig.location].filter(Boolean).join(" · ")}
        </p>
      )}

      {sets.map((set) => {
        const played = set.songs.reduce(
          (sum, song) => sum + (song.durationSeconds ?? 0),
          0,
        );

        return (
          <section key={set.id} className="mt-10 break-inside-avoid">
            <div className="flex items-baseline justify-between border-b-2 border-black/80 pb-1.5">
              <h2 className="text-xl font-bold">{set.name}</h2>
              <span className="text-sm tabular-nums">
                {formatLength(played)} / {set.targetMinutes} min
              </span>
            </div>

            <ol className="mt-3">
              {set.songs.map((song, index) => (
                <li
                  key={song.id}
                  className="flex items-baseline gap-3 border-b border-black/10 py-2"
                >
                  <span className="w-6 shrink-0 text-sm tabular-nums text-muted print:text-black">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-lg font-semibold leading-tight">
                    {song.title}
                    {song.artist && (
                      <span className="ml-2 text-sm font-normal text-muted print:text-black">
                        {song.artist}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatDuration(song.durationSeconds)}
                  </span>
                </li>
              ))}
            </ol>

            {set.songs.length === 0 && (
              <p className="mt-3 text-sm text-muted">Nothing in this set yet.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
