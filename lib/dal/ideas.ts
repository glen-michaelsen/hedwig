import "server-only";
import { and, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { idea, ideaVote } from "@/db/schema";
import { hashIp, newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";

export type IdeaArea = "platform" | "link-in-bio" | "tutor";

export type NewIdea = {
  title: string;
  detail: string | null;
  name: string | null;
  email: string | null;
  area: IdeaArea;
  /** Raw address; hashed before it touches the database. */
  ip: string | null;
};

/** How many ideas one address can file per hour. */
const HOURLY_LIMIT = 5;

/**
 * Anyone can post here, so the cap is the only thing standing between the
 * table and a script. It counts by hashed IP rather than by session because
 * the form deliberately doesn't require an account.
 */
export async function submitIdea(input: NewIdea): Promise<
  { ok: true } | { ok: false; reason: "rate-limited" }
> {
  const db = await getDb();
  const ipHash = input.ip ? await hashIp(input.ip) : null;

  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ id: idea.id })
      .from(idea)
      .where(and(eq(idea.ipHash, ipHash), gt(idea.createdAt, since)))
      .limit(HOURLY_LIMIT);

    if (recent.length >= HOURLY_LIMIT) return { ok: false, reason: "rate-limited" };
  }

  await db.insert(idea).values({
    id: newId(),
    title: input.title,
    detail: input.detail,
    name: input.name,
    email: input.email,
    area: input.area,
    ipHash,
  });

  return { ok: true };
}

/**
 * The public board. Only rows explicitly published are returned, and never
 * the submitter's email or IP hash — this feeds a page anyone can read.
 */
export async function listPublishedIdeas() {
  const db = await getDb();
  return db
    .select({
      id: idea.id,
      title: idea.title,
      detail: idea.detail,
      name: idea.name,
      area: idea.area,
      status: idea.status,
      createdAt: idea.createdAt,
      // Counted on read rather than kept in a column on `idea`: a stored
      // counter and the rows it summarises drift apart the first time a
      // delete happens outside the one code path that decrements it.
      votes: sql<number>`(
        select count(*) from ${ideaVote} where ${ideaVote.ideaId} = ${idea.id}
      )`.mapWith(Number),
    })
    .from(idea)
    .where(eq(idea.published, true))
    // Most wanted first — the point of the votes is to change the order.
    // Ties fall back to newest, so a fresh idea with no votes yet still
    // appears above older ones nobody voted for either.
    .orderBy(
      desc(sql`(
        select count(*) from ${ideaVote} where ${ideaVote.ideaId} = ${idea.id}
      )`),
      desc(idea.createdAt),
    )
    .limit(50);
}

export type PublishedIdea = Awaited<
  ReturnType<typeof listPublishedIdeas>
>[number];

/* --------------------------------- votes -------------------------------- */

/** Which of these ideas this browser has already voted for. */
export async function votesByVoter(
  voterKey: string,
  ideaIds: string[],
): Promise<Set<string>> {
  if (ideaIds.length === 0) return new Set();

  const db = await getDb();
  const rows = await db
    .select({ ideaId: ideaVote.ideaId })
    .from(ideaVote)
    .where(
      and(
        eq(ideaVote.voterKey, voterKey),
        inArray(ideaVote.ideaId, ideaIds),
      ),
    );

  return new Set(rows.map((row) => row.ideaId));
}

/**
 * A clearable cookie is the dedupe, so it can't be the ceiling as well —
 * a script that drops its cookies has an unlimited supply of voter keys.
 * This caps how much any one address can add per hour regardless.
 */
const VOTES_PER_HOUR = 40;

export type VoteResult =
  | { ok: true; voted: boolean }
  | { ok: false; reason: "not-found" | "rate-limited" };

/** Votes are a toggle: pressing it again takes the vote back. */
export async function toggleVote(input: {
  ideaId: string;
  voterKey: string;
  ip: string | null;
}): Promise<VoteResult> {
  const db = await getDb();

  // Only published ideas can be voted on — an unpublished one isn't visible
  // anywhere, so a vote for it could only have been crafted by hand.
  const [target] = await db
    .select({ id: idea.id })
    .from(idea)
    .where(and(eq(idea.id, input.ideaId), eq(idea.published, true)))
    .limit(1);

  if (!target) return { ok: false, reason: "not-found" };

  const existing = await db
    .select({ ideaId: ideaVote.ideaId })
    .from(ideaVote)
    .where(
      and(
        eq(ideaVote.ideaId, input.ideaId),
        eq(ideaVote.voterKey, input.voterKey),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(ideaVote)
      .where(
        and(
          eq(ideaVote.ideaId, input.ideaId),
          eq(ideaVote.voterKey, input.voterKey),
        ),
      );
    return { ok: true, voted: false };
  }

  const ipHash = input.ip ? await hashIp(input.ip) : null;
  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ ideaId: ideaVote.ideaId })
      .from(ideaVote)
      .where(and(eq(ideaVote.ipHash, ipHash), gt(ideaVote.createdAt, since)))
      .limit(VOTES_PER_HOUR);

    if (recent.length >= VOTES_PER_HOUR) {
      return { ok: false, reason: "rate-limited" };
    }
  }

  await db
    .insert(ideaVote)
    .values({ ideaId: input.ideaId, voterKey: input.voterKey, ipHash })
    // The primary key already forbids a duplicate; this keeps a double
    // click from surfacing as an error rather than a no-op.
    .onConflictDoNothing();

  return { ok: true, voted: true };
}

/* --------------------------------- admin -------------------------------- */
/*
 * Everything below is for the platform admin only — see requireAdmin() in
 * lib/auth.ts. These functions have no tenant key by design: ideas belong to
 * the platform, not to an account, so there is nothing to scope them by.
 * That makes the auth check at the call site the only thing protecting them.
 */

export type IdeaStatus = "new" | "planned" | "shipped" | "declined";

/** Includes the email, which the public list deliberately never returns. */
export async function listAllIdeas() {
  const db = await getDb();
  return db
    .select({
      id: idea.id,
      title: idea.title,
      detail: idea.detail,
      name: idea.name,
      email: idea.email,
      area: idea.area,
      status: idea.status,
      published: idea.published,
      createdAt: idea.createdAt,
      votes: sql<number>`(
        select count(*) from ${ideaVote} where ${ideaVote.ideaId} = ${idea.id}
      )`.mapWith(Number),
    })
    .from(idea)
    .orderBy(desc(idea.createdAt))
    .limit(500);
}

export async function setIdeaStatus(id: string, status: IdeaStatus) {
  const db = await getDb();
  await db.update(idea).set({ status }).where(eq(idea.id, id));
}

export async function setIdeaPublished(id: string, published: boolean) {
  const db = await getDb();
  await db.update(idea).set({ published }).where(eq(idea.id, id));
}

export async function deleteIdea(id: string) {
  const db = await getDb();
  await db.delete(idea).where(eq(idea.id, id));
}

export type AdminIdea = Awaited<ReturnType<typeof listAllIdeas>>[number];
