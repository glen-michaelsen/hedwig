import { PhoneFrame } from "@/app/_components/mockup/phone-frame";

/**
 * A phone showing a set mid-build. The real board (`app/setlists/[id]/_components/setlist-board.tsx`)
 * is drag-and-drop-coupled to dnd-kit's context and fires real server
 * actions on every change, so importing it here with fake data would
 * either throw outside its DndContext or write to the database — this
 * hand-replicates its set-card and song-row markup (same classNames)
 * instead, as a static, inert picture.
 */

const DragHandleIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
    <path
      d="M7 5h.01M7 10h.01M7 15h.01M13 5h.01M13 10h.01M13 15h.01"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const SONGS = [
  { title: "Nordlys", artist: "Glen", duration: "3:45" },
  { title: "Skyggeland", artist: "Glen", duration: "4:00" },
  { title: "Ude af syne", artist: "Glen", duration: "3:30" },
  { title: "Hjemad", artist: "Glen", duration: "3:55" },
];

export function SetlistMockup() {
  return (
    <PhoneFrame
      screenClassName="bg-background"
      frameWidth={252}
      screenHeight={480}
      nativeWidth={330}
      scale={0.66}
    >
      <div className="px-5 pt-14 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-faint">
          Thu, 24 Sept
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-balance">
          Vega, Copenhagen
        </h1>

        <div className="mt-6 flex min-w-0 flex-col rounded-4xl border border-line bg-surface-muted/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold tracking-tight">Set 1</span>
            <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              About right
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-[97%] rounded-full bg-brand-500" />
          </div>
          <p className="mt-1.5 text-xs tabular-nums text-faint">
            15:10 of 15 min
          </p>

          <ul className="mt-4 space-y-2">
            {SONGS.map((song) => (
              <li
                key={song.title}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl border border-line bg-surface px-3 py-2.5"
              >
                <span className="text-faint">
                  <DragHandleIcon />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {song.title}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {song.artist}
                  </span>
                </span>
                <span className="shrink-0 text-sm tabular-nums text-muted">
                  {song.duration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PhoneFrame>
  );
}
