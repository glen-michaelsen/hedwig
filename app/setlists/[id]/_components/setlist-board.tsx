"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useTransition } from "react";
import {
  addSetAction,
  addSongAction,
  deleteSetAction,
  deleteSongAction,
  duplicateSetAction,
  duplicateSongAction,
  saveArrangementAction,
  updateSetAction,
  updateSongAction,
} from "../../actions";
import {
  actionPill,
  actionPillBrand,
  buttonGhost,
  focusable,
  inputBase,
} from "@/app/_components/ui";
import {
  fitVerdict,
  formatDuration,
  formatLength,
} from "@/lib/setlist/duration";

export type BoardSong = {
  id: string;
  title: string;
  artist: string | null;
  durationSeconds: number | null;
  note: string | null;
};

export type BoardSet = {
  id: string;
  name: string;
  targetMinutes: number;
  songs: BoardSong[];
};

/* -------------------------------- helpers ------------------------------- */

function totalSeconds(songs: BoardSong[]) {
  return songs.reduce((sum, song) => sum + (song.durationSeconds ?? 0), 0);
}

const TONE_STYLES = {
  under: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  close: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  over: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
} as const;

/* --------------------------------- song --------------------------------- */

function SongRow({
  song,
  setId,
  gigId,
  onChanged,
}: {
  song: BoardSong;
  setId: string;
  gigId: string;
  onChanged: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: song.id, data: { setId } });
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();

  function act(action: (formData: FormData) => Promise<void>, extra: Record<string, string>) {
    const formData = new FormData();
    formData.set("gigId", gigId);
    for (const [key, value] of Object.entries(extra)) formData.set(key, value);
    startTransition(async () => {
      await action(formData);
      onChanged();
    });
  }

  if (editing) {
    return (
      <li
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="rounded-2xl border border-brand-400 bg-surface p-3"
      >
        <form
          action={(formData) => {
            formData.set("gigId", gigId);
            formData.set("songId", song.id);
            startTransition(async () => {
              await updateSongAction(formData);
              setEditing(false);
              onChanged();
            });
          }}
          className="grid gap-2 sm:grid-cols-[1fr_1fr_5rem]"
        >
          <input
            className={`${inputBase} w-full !py-2 text-sm`}
            name="title"
            defaultValue={song.title}
            placeholder="Title"
            required
            autoFocus
          />
          <input
            className={`${inputBase} w-full !py-2 text-sm`}
            name="artist"
            defaultValue={song.artist ?? ""}
            placeholder="Artist"
          />
          <input
            className={`${inputBase} w-full !py-2 text-sm`}
            name="duration"
            defaultValue={
              song.durationSeconds === null ? "" : formatDuration(song.durationSeconds)
            }
            placeholder="3:45"
          />
          <div className="flex items-center gap-2 sm:col-span-3">
            <button className={actionPillBrand}>Save</button>
            <button
              type="button"
              className={actionPill}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2.5 ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <button
        type="button"
        className={`cursor-grab touch-none text-faint hover:text-foreground ${focusable}`}
        aria-label={`Reorder ${song.title}`}
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <path
            d="M7 5h.01M7 10h.01M7 15h.01M13 5h.01M13 10h.01M13 15h.01"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{song.title}</p>
        {song.artist && (
          <p className="truncate text-xs text-muted">{song.artist}</p>
        )}
      </div>

      <span className="shrink-0 text-sm tabular-nums text-muted">
        {formatDuration(song.durationSeconds)}
      </span>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          className={actionPill}
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className={actionPill}
          onClick={() => act(duplicateSongAction, { songId: song.id })}
        >
          Copy
        </button>
        <button
          type="button"
          className={`${actionPill} hover:text-rose-700`}
          onClick={() => act(deleteSongAction, { songId: song.id })}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

/* ---------------------------------- set --------------------------------- */

function SetColumn({
  set,
  gigId,
  onChanged,
}: {
  set: BoardSet;
  gigId: string;
  onChanged: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `set:${set.id}`,
    data: { setId: set.id },
  });
  const [editingSet, setEditingSet] = useState(false);
  const [, startTransition] = useTransition();

  const played = totalSeconds(set.songs);
  const verdict = fitVerdict(played, set.targetMinutes);
  const untimed = set.songs.filter((song) => song.durationSeconds === null).length;

  function act(action: (formData: FormData) => Promise<void>, extra: Record<string, string>) {
    const formData = new FormData();
    formData.set("gigId", gigId);
    for (const [key, value] of Object.entries(extra)) formData.set(key, value);
    startTransition(async () => {
      await action(formData);
      onChanged();
    });
  }

  return (
    <div className="flex min-w-0 flex-col rounded-4xl border border-line bg-surface-muted/40 p-4">
      <div className="flex items-start justify-between gap-3">
        {editingSet ? (
          <form
            action={(formData) => {
              formData.set("gigId", gigId);
              formData.set("setId", set.id);
              startTransition(async () => {
                await updateSetAction(formData);
                setEditingSet(false);
                onChanged();
              });
            }}
            className="flex flex-1 items-center gap-2"
          >
            <input
              className={`${inputBase} w-full !py-1.5 text-sm`}
              name="name"
              defaultValue={set.name}
              autoFocus
            />
            <input
              className={`${inputBase} w-20 !py-1.5 text-sm`}
              name="targetMinutes"
              type="number"
              min={5}
              max={300}
              defaultValue={set.targetMinutes}
              aria-label="Minutes"
            />
            <button className={actionPillBrand}>Save</button>
          </form>
        ) : (
          <>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold">{set.name}</h3>
              <p className="mt-0.5 text-xs text-muted">
                {set.songs.length} {set.songs.length === 1 ? "song" : "songs"} ·{" "}
                {formatLength(played)} of {set.targetMinutes} min
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className={actionPill}
                onClick={() => setEditingSet(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className={actionPill}
                onClick={() => act(duplicateSetAction, { setId: set.id })}
              >
                Copy
              </button>
              <button
                type="button"
                className={`${actionPill} hover:text-rose-700`}
                onClick={() => act(deleteSetAction, { setId: set.id })}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONE_STYLES[verdict.tone]}`}
        >
          {verdict.label}
        </span>
        {untimed > 0 && (
          <span className="text-[11px] text-faint">
            {untimed} without a length
          </span>
        )}
      </div>

      {/* The bar reads as "how full is this slot", which is the question
          being asked while dragging songs about. */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${
            verdict.tone === "over" ? "bg-rose-500" : "bg-brand-500"
          }`}
          style={{
            width: `${Math.min(100, (played / (set.targetMinutes * 60)) * 100)}%`,
          }}
        />
      </div>

      <div
        ref={setNodeRef}
        className={`mt-4 min-h-16 flex-1 rounded-3xl transition-colors ${
          isOver ? "bg-brand-500/10" : ""
        }`}
      >
        <SortableContext
          items={set.songs.map((song) => song.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {set.songs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                setId={set.id}
                gigId={gigId}
                onChanged={onChanged}
              />
            ))}
          </ul>
        </SortableContext>

        {set.songs.length === 0 && (
          <p className="px-3 py-4 text-xs text-faint">
            Empty — add a song, or drag one here.
          </p>
        )}
      </div>

      <form
        action={(formData) => {
          formData.set("gigId", gigId);
          formData.set("setId", set.id);
          const form = document.getElementById(
            `add-song-${set.id}`,
          ) as HTMLFormElement | null;
          startTransition(async () => {
            await addSongAction(formData);
            form?.reset();
            onChanged();
          });
        }}
        id={`add-song-${set.id}`}
        className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_4.5rem]"
      >
        <input
          className={`${inputBase} w-full !py-2 text-sm`}
          name="title"
          placeholder="Song"
          required
        />
        <input
          className={`${inputBase} w-full !py-2 text-sm`}
          name="artist"
          placeholder="Artist"
        />
        <input
          className={`${inputBase} w-full !py-2 text-sm`}
          name="duration"
          placeholder="3:45"
        />
        <button className={`${actionPillBrand} sm:col-span-3`}>Add song</button>
      </form>
    </div>
  );
}

/* --------------------------------- board -------------------------------- */

export function SetlistBoard({
  gigId,
  sets: initialSets,
}: {
  gigId: string;
  sets: BoardSet[];
}) {
  const [sets, setSets] = useState(initialSets);
  const [dragging, setDragging] = useState<BoardSong | null>(null);
  const [, startTransition] = useTransition();

  // The server is the source of truth; after any action the page revalidates
  // and hands down fresh sets, which are adopted here unless a drag is in
  // flight.
  const [lastServer, setLastServer] = useState(initialSets);
  if (initialSets !== lastServer) {
    setLastServer(initialSets);
    setSets(initialSets);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function findSet(songId: string) {
    return sets.find((set) => set.songs.some((song) => song.id === songId));
  }

  function onDragStart(event: DragStartEvent) {
    const song = sets
      .flatMap((set) => set.songs)
      .find((entry) => entry.id === event.active.id);
    setDragging(song ?? null);
  }

  /** Moving between columns has to happen during the drag, or the song
   *  snaps back to its old column while the pointer is over the new one. */
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeSet = findSet(String(active.id));
    if (!activeSet) return;

    const overId = String(over.id);
    const targetSet = overId.startsWith("set:")
      ? sets.find((set) => set.id === overId.slice(4))
      : findSet(overId);

    if (!targetSet || targetSet.id === activeSet.id) return;

    setSets((current) => {
      const song = activeSet.songs.find((entry) => entry.id === active.id);
      if (!song) return current;

      return current.map((set) => {
        if (set.id === activeSet.id) {
          return {
            ...set,
            songs: set.songs.filter((entry) => entry.id !== song.id),
          };
        }
        if (set.id === targetSet.id) {
          const overIndex = set.songs.findIndex((entry) => entry.id === overId);
          const next = [...set.songs];
          next.splice(overIndex >= 0 ? overIndex : next.length, 0, song);
          return { ...set, songs: next };
        }
        return set;
      });
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setDragging(null);
    if (!over) return;

    const set = findSet(String(active.id));
    if (!set) return;

    const overId = String(over.id);
    let next = sets;

    if (!overId.startsWith("set:")) {
      const from = set.songs.findIndex((song) => song.id === active.id);
      const to = set.songs.findIndex((song) => song.id === overId);
      if (from !== -1 && to !== -1 && from !== to) {
        next = sets.map((entry) =>
          entry.id === set.id
            ? { ...entry, songs: arrayMove(entry.songs, from, to) }
            : entry,
        );
        setSets(next);
      }
    }

    const arrangement = next.map((entry) => ({
      setId: entry.id,
      songIds: entry.songs.map((song) => song.id),
    }));

    startTransition(() => saveArrangementAction(gigId, arrangement));
  }

  const wholeShow = sets.reduce((sum, set) => sum + totalSeconds(set.songs), 0);
  const wholeTarget = sets.reduce((sum, set) => sum + set.targetMinutes, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-3xl border border-line bg-surface px-5 py-4">
        <div>
          <p className="text-xl font-semibold tabular-nums">
            {formatLength(wholeShow)}
          </p>
          <p className="text-xs text-muted">
            of {wholeTarget} min booked · {sets.reduce((n, s) => n + s.songs.length, 0)} songs
          </p>
        </div>

        <form
          action={(formData) => {
            formData.set("gigId", gigId);
            startTransition(() => addSetAction(formData));
          }}
          className="ml-auto flex items-center gap-2"
        >
          <input
            className={`${inputBase} w-28 !py-2 text-sm`}
            name="name"
            placeholder={`Set ${sets.length + 1}`}
            defaultValue={`Set ${sets.length + 1}`}
            aria-label="Set name"
          />
          <input
            className={`${inputBase} w-20 !py-2 text-sm`}
            name="targetMinutes"
            type="number"
            min={5}
            max={300}
            defaultValue={45}
            aria-label="Minutes"
          />
          <button className={buttonGhost}>Add set</button>
        </form>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {sets.map((set) => (
            <SetColumn
              key={set.id}
              set={set}
              gigId={gigId}
              onChanged={() => {}}
            />
          ))}
        </div>

        <DragOverlay>
          {dragging && (
            <div className="flex items-center gap-3 rounded-2xl border border-brand-400 bg-surface px-3 py-2.5 shadow-float">
              <span className="text-sm font-medium">{dragging.title}</span>
              <span className="text-sm tabular-nums text-muted">
                {formatDuration(dragging.durationSeconds)}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
