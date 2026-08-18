import "server-only";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import {
  artist,
  pressRelease,
  releaseAsset,
  spotlight,
} from "@/db/schema";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { slugify } from "@/lib/spotlight/slug";

/**
 * Spotlight is editorial: the platform admin writes about a release, gives it
 * hearts, and publishes it. That makes it the one part of the app with no
 * tenant key — an article about somebody else's record is the whole point.
 *
 * Everything here marked "admin" is therefore unscoped by account and MUST be
 * called behind requireAdmin(). The published* functions below are the only
 * ones safe to reach from a public page, and they return nothing unpublished.
 */

/* --------------------------- admin: the picker -------------------------- */

/** Every release on the platform, for choosing what to write about. */
export async function listReleasesForPicker() {
  const db = await getDb();
  return db
    .select({
      id: pressRelease.id,
      title: pressRelease.title,
      kind: pressRelease.kind,
      releaseDate: pressRelease.releaseDate,
      artistName: artist.name,
      coverAssetId: sql<string | null>`(
        select ${releaseAsset.id} from ${releaseAsset}
        where ${releaseAsset.releaseId} = ${pressRelease.id}
          and ${releaseAsset.kind} = 'cover'
        limit 1
      )`,
      spotlightId: sql<string | null>`(
        select ${spotlight.id} from ${spotlight}
        where ${spotlight.releaseId} = ${pressRelease.id}
        limit 1
      )`,
    })
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .orderBy(desc(pressRelease.createdAt));
}

/** The press photos of one release, for picking the header image. */
export async function listPhotosForRelease(releaseId: string) {
  const db = await getDb();
  return db
    .select({
      id: releaseAsset.id,
      filename: releaseAsset.filename,
    })
    .from(releaseAsset)
    .where(
      and(
        eq(releaseAsset.releaseId, releaseId),
        eq(releaseAsset.kind, "photo"),
      ),
    )
    .orderBy(asc(releaseAsset.position), asc(releaseAsset.createdAt));
}

/* ----------------------------- admin: articles -------------------------- */

const articleColumns = {
  id: spotlight.id,
  slug: spotlight.slug,
  headline: spotlight.headline,
  body: spotlight.body,
  rating: spotlight.rating,
  headerAssetId: spotlight.headerAssetId,
  published: spotlight.published,
  publishedAt: spotlight.publishedAt,
  createdAt: spotlight.createdAt,
  releaseId: pressRelease.id,
  releaseTitle: pressRelease.title,
  releaseKind: pressRelease.kind,
  releaseDate: pressRelease.releaseDate,
  releaseUrl: pressRelease.url,
  artistName: artist.name,
  coverAssetId: sql<string | null>`(
    select ${releaseAsset.id} from ${releaseAsset}
    where ${releaseAsset.releaseId} = ${pressRelease.id}
      and ${releaseAsset.kind} = 'cover'
    limit 1
  )`,
};

export async function listSpotlights() {
  const db = await getDb();
  return db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .orderBy(desc(spotlight.createdAt));
}

export async function getSpotlight(id: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(eq(spotlight.id, id))
    .limit(1);

  return row ?? null;
}

/**
 * Slugs must be unique and they come from a headline someone typed, so two
 * articles can easily want the same one. Append -2, -3 … rather than a random
 * suffix: the URL stays readable, which is the only reason to have a slug.
 */
async function uniqueSlug(headline: string, exceptId?: string) {
  const db = await getDb();
  const base = slugify(headline);

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;

    const clash = await db
      .select({ id: spotlight.id })
      .from(spotlight)
      .where(
        exceptId
          ? and(eq(spotlight.slug, candidate), ne(spotlight.id, exceptId))
          : eq(spotlight.slug, candidate),
      )
      .limit(1);

    if (clash.length === 0) return candidate;
  }

  // 50 articles with the same headline is not a real case, but a collision
  // that silently overwrote one would be.
  return `${base}-${newId().slice(0, 8)}`;
}

export type SpotlightInput = {
  releaseId: string;
  headline: string;
  body: string;
  rating: number;
  headerAssetId: string | null;
};

export async function createSpotlight(input: SpotlightInput): Promise<string> {
  const db = await getDb();
  const id = newId();

  await db.insert(spotlight).values({
    id,
    ...input,
    slug: await uniqueSlug(input.headline),
  });

  return id;
}

export async function updateSpotlight(id: string, input: SpotlightInput) {
  const db = await getDb();
  await db
    .update(spotlight)
    .set({
      headline: input.headline,
      body: input.body,
      rating: input.rating,
      headerAssetId: input.headerAssetId,
      slug: await uniqueSlug(input.headline, id),
      updatedAt: new Date(),
    })
    .where(eq(spotlight.id, id));
}

export async function setSpotlightPublished(id: string, published: boolean) {
  const db = await getDb();
  await db
    .update(spotlight)
    .set({
      published,
      // First publish stamps the date; unpublishing keeps it, so putting an
      // article back up doesn't reorder it to the top of the index.
      publishedAt: published ? sql`coalesce(published_at, unixepoch())` : sql`published_at`,
      updatedAt: new Date(),
    })
    .where(eq(spotlight.id, id));
}

export async function deleteSpotlight(id: string) {
  const db = await getDb();
  await db.delete(spotlight).where(eq(spotlight.id, id));
}

/* ------------------------------- public --------------------------------- */

export async function listPublishedSpotlights() {
  const db = await getDb();
  return db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(eq(spotlight.published, true))
    .orderBy(desc(spotlight.publishedAt), desc(spotlight.createdAt))
    .limit(100);
}

export async function getPublishedSpotlight(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(eq(spotlight.slug, slug), eq(spotlight.published, true)))
    .limit(1);

  return row ?? null;
}

/**
 * By slug, published or not — for the admin previewing a draft at its real
 * URL. The page must check isAdmin() before calling this.
 */
export async function getSpotlightBySlugForAdmin(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(eq(spotlight.slug, slug))
    .limit(1);

  return row ?? null;
}

/**
 * Resolves an image for the public article route.
 *
 * A press kit is private, so this deliberately answers for exactly two
 * assets per article — the release's cover and the chosen header — and only
 * while that article is published. Every other file on the release stays
 * invisible.
 */
export async function getPublicSpotlightImage(assetId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      r2Key: releaseAsset.r2Key,
      contentType: releaseAsset.contentType,
      kind: releaseAsset.kind,
      headerAssetId: spotlight.headerAssetId,
    })
    .from(releaseAsset)
    .innerJoin(spotlight, eq(spotlight.releaseId, releaseAsset.releaseId))
    .where(and(eq(releaseAsset.id, assetId), eq(spotlight.published, true)))
    .limit(1);

  if (!row) return null;
  if (row.kind !== "cover" && row.headerAssetId !== assetId) return null;

  return { r2Key: row.r2Key, contentType: row.contentType };
}

/** For the admin preview, where nothing is published yet. */
export async function getAnySpotlightImage(assetId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      r2Key: releaseAsset.r2Key,
      contentType: releaseAsset.contentType,
    })
    .from(releaseAsset)
    .where(eq(releaseAsset.id, assetId))
    .limit(1);

  return row ?? null;
}

export type SpotlightRow = Awaited<ReturnType<typeof listSpotlights>>[number];
export type ReleaseOption = Awaited<
  ReturnType<typeof listReleasesForPicker>
>[number];
