import "server-only";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import {
  bioPage,
  gig,
  invite,
  pressRelease,
  session,
  student,
  user,
} from "@/db/schema";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";

const INVITE_LIFETIME_DAYS = 14;

/* -------------------------------- invites -------------------------------- */

export async function createInvite(invitedBy: string, email: string) {
  const db = await getDb();
  const id = newId();
  const expiresAt = new Date(
    Date.now() + INVITE_LIFETIME_DAYS * 24 * 60 * 60 * 1000,
  );

  await db.insert(invite).values({ id, email, invitedBy, expiresAt });
  return id;
}

export async function revokeInvite(invitedBy: string, id: string) {
  const db = await getDb();
  await db
    .update(invite)
    .set({ revokedAt: new Date() })
    .where(and(eq(invite.id, id), eq(invite.invitedBy, invitedBy)));
}

export async function listInvites(invitedBy: string) {
  const db = await getDb();
  return db
    .select()
    .from(invite)
    .where(eq(invite.invitedBy, invitedBy))
    .orderBy(desc(invite.createdAt))
    .limit(200);
}

export type InviteRow = Awaited<ReturnType<typeof listInvites>>[number];

/**
 * The signup gate. A valid invite is unrevoked, unaccepted and unexpired —
 * every other state, including "no row with this id", returns the same
 * null, so a guessed signup link learns nothing about what it guessed.
 */
export async function getOpenInvite(id: string) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(invite)
    .where(
      and(
        eq(invite.id, id),
        isNull(invite.acceptedAt),
        isNull(invite.revokedAt),
      ),
    )
    .limit(1);

  if (!row || row.expiresAt.getTime() < Date.now()) return null;
  return row;
}

export async function acceptInvite(id: string, userId: string) {
  const db = await getDb();
  await db
    .update(invite)
    .set({ acceptedAt: new Date(), acceptedUserId: userId })
    .where(eq(invite.id, id));
}

/* ------------------------------- musicians -------------------------------- */

/**
 * Everyone with an account except the admin themselves, with just enough
 * activity to tell an active studio from someone who signed up and never
 * came back. Every count is a correlated subquery scoped to that one
 * musician — cheap at this scale, and it means a new signal later is one
 * more subquery, not a schema change.
 */
export async function listMusicians(excludeAccountId: string) {
  const db = await getDb();

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      studioName: user.studioName,
      createdAt: user.createdAt,
      // Raw seconds — bypasses the column's own Date mapping since this is
      // a correlated subquery, not a direct column select.
      lastSeenSeconds: sql<number | null>`(
        select max(${session.updatedAt}) from ${session} where ${session.userId} = ${user.id}
      )`,
      releaseCount: sql<number>`(
        select count(*) from ${pressRelease} where ${pressRelease.accountId} = ${user.id}
      )`.mapWith(Number),
      gigCount: sql<number>`(
        select count(*) from ${gig} where ${gig.accountId} = ${user.id}
      )`.mapWith(Number),
      studentCount: sql<number>`(
        select count(*) from ${student} where ${student.tutorId} = ${user.id}
      )`.mapWith(Number),
      // bioPage.accountId is unique, so this is a one-row-or-none join, not
      // a fan-out — a draft page (unpublished) has nothing public to link
      // to, so it's dropped in the map below rather than shown as if live.
      bioHandle: bioPage.handle,
      bioPublished: bioPage.published,
    })
    .from(user)
    .leftJoin(bioPage, eq(bioPage.accountId, user.id))
    .orderBy(desc(user.createdAt));

  return rows
    .filter((row) => row.id !== excludeAccountId)
    .map(({ lastSeenSeconds, bioHandle, bioPublished, ...row }) => ({
      ...row,
      lastSeen: lastSeenSeconds ? new Date(lastSeenSeconds * 1000) : null,
      bioHandle: bioPublished ? bioHandle : null,
    }));
}

export type MusicianRow = Awaited<ReturnType<typeof listMusicians>>[number];
