import "server-only";
import { and, desc, eq, gt } from "drizzle-orm";
import { idea } from "@/db/schema";
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
    })
    .from(idea)
    .where(eq(idea.published, true))
    .orderBy(desc(idea.createdAt))
    .limit(50);
}

export type PublishedIdea = Awaited<
  ReturnType<typeof listPublishedIdeas>
>[number];

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
