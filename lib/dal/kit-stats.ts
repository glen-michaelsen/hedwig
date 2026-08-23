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

/**
 * Daily counts per kind, for the chart. One query rather than one per
 * series: the rows are tiny and three round trips to D1 for the same table
 * would be three times the latency for no benefit.
 */
export async function getKitDaily(
  accountId: string,
  releaseId: string,
  since: string,
) {
  const db = await getDb();
  return db
    .select({
      day: kitEvent.day,
      kind: kitEvent.kind,
      count: sql<number>`sum(${kitEvent.count})`.mapWith(Number),
    })
    .from(kitEvent)
    .innerJoin(pressRelease, eq(pressRelease.id, kitEvent.releaseId))
    .where(
      and(
        eq(kitEvent.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
        gte(kitEvent.day, since),
      ),
    )
    .groupBy(kitEvent.day, kitEvent.kind)
    .orderBy(kitEvent.day);
}

/**
 * The files that got the most of one kind of attention — downloads, or
 * plays. Same shape either way, so the page can put two tables side by side.
 */
export async function getKitTopAssets(
  accountId: string,
  releaseId: string,
  kind: KitEventKind,
) {
  const db = await getDb();
  return db
    .select({
      assetId: kitEvent.assetId,
      filename: releaseAsset.filename,
      // The name the musician gave it, so the tables match the lists above
      // rather than showing a delivery filename nobody recognises.
      title: releaseAsset.title,
      assetKind: releaseAsset.kind,
      total: sql<number>`sum(${kitEvent.count})`.mapWith(Number),
    })
    .from(kitEvent)
    .innerJoin(pressRelease, eq(pressRelease.id, kitEvent.releaseId))
    .innerJoin(releaseAsset, eq(releaseAsset.id, kitEvent.assetId))
    .where(
      and(
        eq(kitEvent.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
        eq(kitEvent.kind, kind),
      ),
    )
    .groupBy(
      kitEvent.assetId,
      releaseAsset.filename,
      releaseAsset.title,
      releaseAsset.kind,
    )
    .orderBy(desc(sql`sum(${kitEvent.count})`))
    .limit(10);
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
export type TopAssetRow = Awaited<ReturnType<typeof getKitTopAssets>>[number];
export type DailyRow = Awaited<ReturnType<typeof getKitDaily>>[number];
