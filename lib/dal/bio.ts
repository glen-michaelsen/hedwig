import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import {
  bioBlock,
  bioClick,
  bioHandleHistory,
  bioPage,
  bioSocial,
  bioView,
} from "@/db/schema";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";

/**
 * One page per account in v1. Everything here is scoped by `accountId`
 * except the public lookups, which are scoped by handle and published state.
 */

export async function getPageForAccount(accountId: string) {
  const db = await getDb();
  return db
    .select()
    .from(bioPage)
    .where(eq(bioPage.accountId, accountId))
    .get();
}

export async function handleTaken(handle: string, exceptPageId?: string) {
  const db = await getDb();

  const page = await db
    .select({ id: bioPage.id })
    .from(bioPage)
    .where(eq(bioPage.handle, handle))
    .get();
  if (page && page.id !== exceptPageId) return true;

  // A handle someone previously used still points at their page.
  const history = await db
    .select({ pageId: bioHandleHistory.pageId })
    .from(bioHandleHistory)
    .where(eq(bioHandleHistory.handle, handle))
    .get();
  return Boolean(history && history.pageId !== exceptPageId);
}

export async function createPage(
  accountId: string,
  data: { handle: string; title: string },
) {
  const db = await getDb();
  const id = newId();
  await db.insert(bioPage).values({
    id,
    accountId,
    handle: data.handle,
    title: data.title,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

export async function updatePage(
  accountId: string,
  data: Partial<{
    title: string;
    tagline: string | null;
    avatarKey: string | null;
    themePreset: string;
    accentColor: string | null;
    backgroundKind: "preset" | "solid" | "gradient" | "image";
    backgroundValue: string | null;
    published: boolean;
  }>,
) {
  const db = await getDb();
  await db
    .update(bioPage)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(bioPage.accountId, accountId));
}

/** Leaves the old handle behind as a redirect. */
export async function changeHandle(
  accountId: string,
  pageId: string,
  oldHandle: string,
  newHandle: string,
) {
  const db = await getDb();

  await db
    .insert(bioHandleHistory)
    .values({ handle: oldHandle, pageId, changedAt: new Date() })
    .onConflictDoNothing();

  await db
    .update(bioPage)
    .set({ handle: newHandle, updatedAt: new Date() })
    .where(eq(bioPage.accountId, accountId));
}

/* -------------------------------- blocks ------------------------------- */

async function ownedPageId(accountId: string) {
  const page = await getPageForAccount(accountId);
  return page?.id ?? null;
}

export async function listBlocks(pageId: string) {
  const db = await getDb();
  return db
    .select()
    .from(bioBlock)
    .where(eq(bioBlock.pageId, pageId))
    .orderBy(asc(bioBlock.position));
}

export async function addBlock(
  accountId: string,
  kind: string,
  config: unknown,
) {
  const db = await getDb();
  const pageId = await ownedPageId(accountId);
  if (!pageId) return null;

  const existing = await listBlocks(pageId);
  const id = newId();

  await db.insert(bioBlock).values({
    id,
    pageId,
    kind: kind as "link",
    position: existing.length,
    config: JSON.stringify(config),
  });
  return id;
}

export async function updateBlock(
  accountId: string,
  blockId: string,
  config: unknown,
) {
  const db = await getDb();
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  await db
    .update(bioBlock)
    .set({ config: JSON.stringify(config) })
    .where(and(eq(bioBlock.id, blockId), eq(bioBlock.pageId, pageId)));
}

export async function setBlockVisible(
  accountId: string,
  blockId: string,
  visible: boolean,
) {
  const db = await getDb();
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  await db
    .update(bioBlock)
    .set({ visible })
    .where(and(eq(bioBlock.id, blockId), eq(bioBlock.pageId, pageId)));
}

export async function deleteBlock(accountId: string, blockId: string) {
  const db = await getDb();
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  await db
    .delete(bioBlock)
    .where(and(eq(bioBlock.id, blockId), eq(bioBlock.pageId, pageId)));
  await reindex(pageId);
}

/** Moves one block by a step and rewrites every position. */
export async function moveBlock(
  accountId: string,
  blockId: string,
  direction: -1 | 1,
) {
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  const blocks = await listBlocks(pageId);
  const index = blocks.findIndex((b) => b.id === blockId);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= blocks.length) return;

  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];

  const db = await getDb();
  // A page has tens of blocks; rewriting them all is simpler than fractional
  // indexing and cheap at this size.
  for (const [position, block] of blocks.entries()) {
    await db
      .update(bioBlock)
      .set({ position })
      .where(eq(bioBlock.id, block.id));
  }
}

/**
 * Applies a full ordering from the editor. Refuses anything that isn't a
 * complete permutation of this page's blocks, so a stale or tampered list
 * can't drop or import a block.
 */
export async function setBlockOrder(accountId: string, orderedIds: string[]) {
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  const blocks = await listBlocks(pageId);
  const owned = new Set(blocks.map((b) => b.id));
  const ids = [...new Set(orderedIds)].filter((id) => owned.has(id));
  if (ids.length !== blocks.length) return;

  const db = await getDb();
  for (const [position, id] of ids.entries()) {
    await db
      .update(bioBlock)
      .set({ position })
      .where(and(eq(bioBlock.id, id), eq(bioBlock.pageId, pageId)));
  }
}

async function reindex(pageId: string) {
  const db = await getDb();
  const blocks = await listBlocks(pageId);
  for (const [position, block] of blocks.entries()) {
    if (block.position === position) continue;
    await db
      .update(bioBlock)
      .set({ position })
      .where(eq(bioBlock.id, block.id));
  }
}

/* -------------------------------- socials ------------------------------ */

export async function listSocials(pageId: string) {
  const db = await getDb();
  return db
    .select()
    .from(bioSocial)
    .where(eq(bioSocial.pageId, pageId))
    .orderBy(asc(bioSocial.position));
}

export async function replaceSocials(
  accountId: string,
  socials: { platform: string; url: string }[],
) {
  const db = await getDb();
  const pageId = await ownedPageId(accountId);
  if (!pageId) return;

  await db.delete(bioSocial).where(eq(bioSocial.pageId, pageId));
  if (socials.length === 0) return;

  await db.insert(bioSocial).values(
    socials.map((social, position) => ({
      id: newId(),
      pageId,
      platform: social.platform,
      url: social.url,
      position,
    })),
  );
}

/* --------------------------------- public ------------------------------ */

/**
 * Public lookup. Returns the page only when published; an unpublished page
 * is a 404 to everyone but its owner.
 */
export async function getPublicPage(handle: string) {
  const db = await getDb();

  const page = await db
    .select()
    .from(bioPage)
    .where(and(eq(bioPage.handle, handle), eq(bioPage.published, true)))
    .get();

  if (!page) return null;

  const [blocks, socials] = await Promise.all([
    listBlocks(page.id),
    listSocials(page.id),
  ]);

  return { page, blocks: blocks.filter((b) => b.visible), socials };
}

/**
 * Preview lookup for an owner viewing their own unpublished page. Scoped by
 * accountId, not just handle, so a preview link never leaks another
 * account's draft.
 */
export async function getPreviewPage(handle: string, accountId: string) {
  const db = await getDb();

  const page = await db
    .select()
    .from(bioPage)
    .where(and(eq(bioPage.handle, handle), eq(bioPage.accountId, accountId)))
    .get();

  if (!page) return null;

  const [blocks, socials] = await Promise.all([
    listBlocks(page.id),
    listSocials(page.id),
  ]);

  return { page, blocks: blocks.filter((b) => b.visible), socials };
}

/** An old handle resolves to the current one so the URL can redirect. */
export async function resolveOldHandle(handle: string) {
  const db = await getDb();
  const row = await db
    .select({ handle: bioPage.handle, published: bioPage.published })
    .from(bioHandleHistory)
    .innerJoin(bioPage, eq(bioPage.id, bioHandleHistory.pageId))
    .where(eq(bioHandleHistory.handle, handle))
    .get();
  return row?.published ? row.handle : null;
}

/* ------------------------------- analytics ----------------------------- */

export async function recordView(pageId: string, day: string) {
  const db = await getDb();
  await db
    .insert(bioView)
    .values({ pageId, day, count: 1 })
    .onConflictDoUpdate({
      target: [bioView.pageId, bioView.day],
      set: { count: sql`${bioView.count} + 1` },
    });
}

export async function recordClick(blockId: string, day: string) {
  const db = await getDb();
  await db
    .insert(bioClick)
    .values({ blockId, day, count: 1 })
    .onConflictDoUpdate({
      target: [bioClick.blockId, bioClick.day],
      set: { count: sql`${bioClick.count} + 1` },
    });
}

export async function getStats(pageId: string) {
  const db = await getDb();
  const [views, clicks] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(sum(${bioView.count}), 0)` })
      .from(bioView)
      .where(eq(bioView.pageId, pageId))
      .get(),
    db
      .select({
        blockId: bioClick.blockId,
        total: sql<number>`sum(${bioClick.count})`,
      })
      .from(bioClick)
      .innerJoin(bioBlock, eq(bioBlock.id, bioClick.blockId))
      .where(eq(bioBlock.pageId, pageId))
      .groupBy(bioClick.blockId),
  ]);

  return {
    views: views?.total ?? 0,
    clicksByBlock: new Map(clicks.map((c) => [c.blockId, c.total])),
  };
}
