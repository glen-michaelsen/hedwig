import "server-only";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { coverage, kitEvent, pressRelease, releaseAsset } from "@/db/schema";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";

export type KitEventKind = "view" | "play" | "download" | "photo" | "link";

/**
 * Counters for a public press kit, and the coverage it led to.
 *
 * Recording is deliberately cheap: one upsert into a daily counter, no row
 * per hit. A journalist scrubbing through a track would otherwise write
 * hundreds of rows for one listen.
 */

/* ------------------------------- recording ------------------------------ */

export async function recordKitEvent(input: {
  releaseId: string;
  kind: KitEventKind;
  assetId?: string | null;
  day: string;
}) {
  const db = await getDb();
  const assetId = input.assetId ?? "";

  await db
    .insert(kitEvent)
    .values({
      releaseId: input.releaseId,
      assetId,
      kind: input.kind,
      day: input.day,
      count: 1,
    })
    .onConflictDoUpdate({
      target: [kitEvent.releaseId, kitEvent.assetId, kitEvent.kind, kitEvent.day],
      set: { count: sql`${kitEvent.count} + 1` },
    });
}

/* -------------------------------- reading ------------------------------- */

/** Ownership is proved by the join — stats are as private as the release. */
export async function getKitStats(accountId: string, releaseId: string) {
  const db = await getDb();

  const totals = await db
    .select({
      kind: kitEvent.kind,
      total: sql<number>`sum(${kitEvent.count})`.mapWith(Number),
    })
    .from(kitEvent)
    .innerJoin(pressRelease, eq(pressRelease.id, kitEvent.releaseId))
    .where(
      and(
        eq(kitEvent.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
      ),
    )
    .groupBy(kitEvent.kind);

  const byKind: Record<KitEventKind, number> = {
    view: 0,
    play: 0,
    download: 0,
    photo: 0,
    link: 0,
  };
  for (const row of totals) byKind[row.kind] = row.total;

  return byKind;
}

/** Daily visit counts, for the little chart. */
export async function getKitDailyViews(
  accountId: string,
  releaseId: string,
  since: string,
) {
  const db = await getDb();
  return db
    .select({
      day: kitEvent.day,
      count: sql<number>`sum(${kitEvent.count})`.mapWith(Number),
    })
    .from(kitEvent)
    .innerJoin(pressRelease, eq(pressRelease.id, kitEvent.releaseId))
    .where(
      and(
        eq(kitEvent.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
        eq(kitEvent.kind, "view"),
        gte(kitEvent.day, since),
      ),
    )
    .groupBy(kitEvent.day)
    .orderBy(kitEvent.day);
}

/** Which files people actually took, most-taken first. */
export async function getKitDownloads(accountId: string, releaseId: string) {
  const db = await getDb();
  return db
    .select({
      assetId: kitEvent.assetId,
      filename: releaseAsset.filename,
      kind: releaseAsset.kind,
      total: sql<number>`sum(${kitEvent.count})`.mapWith(Number),
    })
    .from(kitEvent)
    .innerJoin(pressRelease, eq(pressRelease.id, kitEvent.releaseId))
    .innerJoin(releaseAsset, eq(releaseAsset.id, kitEvent.assetId))
    .where(
      and(
        eq(kitEvent.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
        eq(kitEvent.kind, "download"),
      ),
    )
    .groupBy(kitEvent.assetId, releaseAsset.filename, releaseAsset.kind)
    .orderBy(desc(sql`sum(${kitEvent.count})`))
    .limit(20);
}

/* ------------------------------- coverage ------------------------------- */

export type CoverageKind =
  | "review"
  | "feature"
  | "interview"
  | "playlist"
  | "radio"
  | "social"
  | "other";

export type CoverageInput = {
  url: string;
  title: string | null;
  outlet: string | null;
  kind: CoverageKind;
  note: string | null;
  publishedOn: string | null;
};

export async function listCoverage(accountId: string, releaseId: string) {
  const db = await getDb();
  return db
    .select({
      id: coverage.id,
      url: coverage.url,
      title: coverage.title,
      outlet: coverage.outlet,
      kind: coverage.kind,
      note: coverage.note,
      publishedOn: coverage.publishedOn,
      createdAt: coverage.createdAt,
    })
    .from(coverage)
    .innerJoin(pressRelease, eq(pressRelease.id, coverage.releaseId))
    .where(
      and(
        eq(coverage.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
      ),
    )
    // Newest coverage first; anything undated falls in by when it was added.
    .orderBy(desc(coverage.publishedOn), desc(coverage.createdAt));
}

export async function addCoverage(
  accountId: string,
  releaseId: string,
  input: CoverageInput,
): Promise<boolean> {
  const db = await getDb();

  const [owned] = await db
    .select({ id: pressRelease.id })
    .from(pressRelease)
    .where(
      and(eq(pressRelease.id, releaseId), eq(pressRelease.accountId, accountId)),
    )
    .limit(1);

  if (!owned) return false;

  await db.insert(coverage).values({ id: newId(), releaseId, ...input });
  return true;
}

export async function deleteCoverage(accountId: string, coverageId: string) {
  const db = await getDb();

  const [owned] = await db
    .select({ id: coverage.id })
    .from(coverage)
    .innerJoin(pressRelease, eq(pressRelease.id, coverage.releaseId))
    .where(
      and(eq(coverage.id, coverageId), eq(pressRelease.accountId, accountId)),
    )
    .limit(1);

  if (!owned) return;
  await db.delete(coverage).where(eq(coverage.id, coverageId));
}

export type CoverageRow = Awaited<ReturnType<typeof listCoverage>>[number];
export type DownloadRow = Awaited<ReturnType<typeof getKitDownloads>>[number];
