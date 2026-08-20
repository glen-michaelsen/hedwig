import "server-only";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { gig, gigSet, setSong } from "@/db/schema";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";

/**
 * Every function takes `accountId` first and filters on it. Sets and songs
 * are reached through their gig, so an id from another account resolves to
 * nothing rather than to someone else's night.
 */

/* --------------------------------- gigs --------------------------------- */

export type GigInput = {
  name: string;
  date: string | null;
  location: string | null;
  notes: string | null;
};

export async function listGigs(accountId: string) {
  const db = await getDb();
  return db
    .select({
      id: gig.id,
      name: gig.name,
      date: gig.date,
      location: gig.location,
      setCount: sql<number>`(
        select count(*) from ${gigSet} where ${gigSet.gigId} = ${gig.id}
      )`.mapWith(Number),
      songCount: sql<number>`(
        select count(*) from ${setSong}
        where ${setSong.setId} in (
          select ${gigSet.id} from ${gigSet} where ${gigSet.gigId} = ${gig.id}
        )
      )`.mapWith(Number),
    })
    .from(gig)
    .where(eq(gig.accountId, accountId))
    // Upcoming first is what a musician wants; undated last, not on top.
    .orderBy(sql`${gig.date} is null`, desc(gig.date), desc(gig.createdAt));
}

export async function createGig(
  accountId: string,
  input: GigInput,
  sets: { name: string; targetMinutes: number }[],
): Promise<string> {
  const db = await getDb();
  const id = newId();

  await db.insert(gig).values({ id, accountId, ...input });

  if (sets.length > 0) {
    await db.insert(gigSet).values(
      sets.map((set, index) => ({
        id: newId(),
        gigId: id,
        name: set.name,
        targetMinutes: set.targetMinutes,
        position: index,
      })),
    );
  }

  return id;
}

export async function getGig(accountId: string, gigId: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(gig)
    .where(and(eq(gig.id, gigId), eq(gig.accountId, accountId)))
    .limit(1);

  return row ?? null;
}

export async function updateGig(
  accountId: string,
  gigId: string,
  input: GigInput,
) {
  const db = await getDb();
  await db
    .update(gig)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(gig.id, gigId), eq(gig.accountId, accountId)));
}

export async function deleteGig(accountId: string, gigId: string) {
  const db = await getDb();
  await db.delete(gig).where(and(eq(gig.id, gigId), eq(gig.accountId, accountId)));
}

/* ----------------------------- sets and songs ---------------------------- */

/** The whole setlist in one read: the editor shows all of it at once. */
export async function getSetlist(accountId: string, gigId: string) {
  const db = await getDb();

  const owned = await getGig(accountId, gigId);
  if (!owned) return null;

  const sets = await db
    .select()
    .from(gigSet)
    .where(eq(gigSet.gigId, gigId))
    .orderBy(asc(gigSet.position));

  const songs =
    sets.length === 0
      ? []
      : await db
          .select()
          .from(setSong)
          .where(
            inArray(
              setSong.setId,
              sets.map((set) => set.id),
            ),
          )
          .orderBy(asc(setSong.position));

  return {
    gig: owned,
    sets: sets.map((set) => ({
      ...set,
      songs: songs.filter((song) => song.setId === set.id),
    })),
  };
}

/** Proves the set belongs to this account before anything touches it. */
async function ownsSet(accountId: string, setId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: gigSet.id, gigId: gigSet.gigId })
    .from(gigSet)
    .innerJoin(gig, eq(gig.id, gigSet.gigId))
    .where(and(eq(gigSet.id, setId), eq(gig.accountId, accountId)))
    .limit(1);

  return row ?? null;
}

export async function addSet(
  accountId: string,
  gigId: string,
  input: { name: string; targetMinutes: number },
) {
  const db = await getDb();

  const owned = await getGig(accountId, gigId);
  if (!owned) return;

  const [{ next } = { next: 0 }] = await db
    .select({
      next: sql<number>`coalesce(max(${gigSet.position}), -1) + 1`.mapWith(Number),
    })
    .from(gigSet)
    .where(eq(gigSet.gigId, gigId));

  await db
    .insert(gigSet)
    .values({ id: newId(), gigId, position: next, ...input });
}

export async function updateSet(
  accountId: string,
  setId: string,
  input: { name: string; targetMinutes: number },
) {
  const db = await getDb();
  if (!(await ownsSet(accountId, setId))) return;

  await db.update(gigSet).set(input).where(eq(gigSet.id, setId));
}

export async function deleteSet(accountId: string, setId: string) {
  const db = await getDb();
  if (!(await ownsSet(accountId, setId))) return;

  await db.delete(gigSet).where(eq(gigSet.id, setId));
}

/** A copy of the set and everything in it, dropped in right after. */
export async function duplicateSet(accountId: string, setId: string) {
  const db = await getDb();

  const owned = await ownsSet(accountId, setId);
  if (!owned) return;

  const [source] = await db
    .select()
    .from(gigSet)
    .where(eq(gigSet.id, setId))
    .limit(1);
  if (!source) return;

  const songs = await db
    .select()
    .from(setSong)
    .where(eq(setSong.setId, setId))
    .orderBy(asc(setSong.position));

  const newSetId = newId();

  // Everything after the source shifts down, so the copy lands beside it
  // rather than at the end where it would have to be dragged back.
  await db
    .update(gigSet)
    .set({ position: sql`${gigSet.position} + 1` })
    .where(
      and(eq(gigSet.gigId, source.gigId), sql`${gigSet.position} > ${source.position}`),
    );

  await db.insert(gigSet).values({
    id: newSetId,
    gigId: source.gigId,
    name: `${source.name} (copy)`,
    targetMinutes: source.targetMinutes,
    position: source.position + 1,
  });

  if (songs.length > 0) {
    await db.insert(setSong).values(
      songs.map((song, index) => ({
        id: newId(),
        setId: newSetId,
        title: song.title,
        artist: song.artist,
        durationSeconds: song.durationSeconds,
        note: song.note,
        position: index,
      })),
    );
  }
}

export type SongInput = {
  title: string;
  artist: string | null;
  durationSeconds: number | null;
  note: string | null;
};

export async function addSong(
  accountId: string,
  setId: string,
  input: SongInput,
) {
  const db = await getDb();
  if (!(await ownsSet(accountId, setId))) return;

  const [{ next } = { next: 0 }] = await db
    .select({
      next: sql<number>`coalesce(max(${setSong.position}), -1) + 1`.mapWith(Number),
    })
    .from(setSong)
    .where(eq(setSong.setId, setId));

  await db.insert(setSong).values({ id: newId(), setId, position: next, ...input });
}

/** Ownership for a song, via its set and gig. */
async function ownsSong(accountId: string, songId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: setSong.id, setId: setSong.setId, position: setSong.position })
    .from(setSong)
    .innerJoin(gigSet, eq(gigSet.id, setSong.setId))
    .innerJoin(gig, eq(gig.id, gigSet.gigId))
    .where(and(eq(setSong.id, songId), eq(gig.accountId, accountId)))
    .limit(1);

  return row ?? null;
}

export async function updateSong(
  accountId: string,
  songId: string,
  input: SongInput,
) {
  const db = await getDb();
  if (!(await ownsSong(accountId, songId))) return;

  await db.update(setSong).set(input).where(eq(setSong.id, songId));
}

export async function deleteSong(accountId: string, songId: string) {
  const db = await getDb();
  if (!(await ownsSong(accountId, songId))) return;

  await db.delete(setSong).where(eq(setSong.id, songId));
}

export async function duplicateSong(accountId: string, songId: string) {
  const db = await getDb();

  const owned = await ownsSong(accountId, songId);
  if (!owned) return;

  const [source] = await db
    .select()
    .from(setSong)
    .where(eq(setSong.id, songId))
    .limit(1);
  if (!source) return;

  await db
    .update(setSong)
    .set({ position: sql`${setSong.position} + 1` })
    .where(
      and(
        eq(setSong.setId, source.setId),
        sql`${setSong.position} > ${source.position}`,
      ),
    );

  await db.insert(setSong).values({
    id: newId(),
    setId: source.setId,
    title: source.title,
    artist: source.artist,
    durationSeconds: source.durationSeconds,
    note: source.note,
    position: source.position + 1,
  });
}

/**
 * The whole arrangement after a drag: which songs are in which set, in what
 * order. Saved in one call rather than per-song, so a drop is one round trip
 * and can't half-apply.
 */
export async function saveArrangement(
  accountId: string,
  gigId: string,
  arrangement: { setId: string; songIds: string[] }[],
) {
  const db = await getDb();

  const owned = await getGig(accountId, gigId);
  if (!owned) return;

  // Every set named must belong to this gig, and every song to this gig's
  // sets — otherwise a crafted payload could move someone else's songs.
  const sets = await db
    .select({ id: gigSet.id })
    .from(gigSet)
    .where(eq(gigSet.gigId, gigId));
  const setIds = new Set(sets.map((set) => set.id));

  const songs =
    setIds.size === 0
      ? []
      : await db
          .select({ id: setSong.id })
          .from(setSong)
          .where(inArray(setSong.setId, [...setIds]));
  const songIds = new Set(songs.map((song) => song.id));

  for (const group of arrangement) {
    if (!setIds.has(group.setId)) continue;

    for (const [index, songId] of group.songIds.entries()) {
      if (!songIds.has(songId)) continue;

      await db
        .update(setSong)
        .set({ setId: group.setId, position: index })
        .where(eq(setSong.id, songId));
    }
  }

  await db.update(gig).set({ updatedAt: new Date() }).where(eq(gig.id, gigId));
}

export type SetlistData = NonNullable<Awaited<ReturnType<typeof getSetlist>>>;
export type GigRow = Awaited<ReturnType<typeof listGigs>>[number];
