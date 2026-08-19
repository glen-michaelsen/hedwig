import "server-only";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { artist, pressRelease, releaseAsset } from "@/db/schema";
import { newId } from "@/lib/crypto";
import { slugify } from "@/lib/slug";
import { getDb } from "@/lib/db";
import type { AssetKind } from "@/lib/press/assets";

/**
 * Every function here takes `accountId` first and filters on it. Assets are
 * reached only through their release, so an asset id from another account
 * resolves to nothing rather than to someone else's master.
 */

/* -------------------------------- artists ------------------------------- */

export async function listArtists(accountId: string) {
  const db = await getDb();
  return db
    .select({
      id: artist.id,
      name: artist.name,
      releaseCount: sql<number>`(
        select count(*) from ${pressRelease}
        where ${pressRelease.artistId} = ${artist.id}
      )`.mapWith(Number),
    })
    .from(artist)
    .where(eq(artist.accountId, accountId))
    .orderBy(asc(artist.name));
}

/**
 * Find-or-create by name. Matching is case-insensitive so "The Bells" typed
 * a second time as "the bells" doesn't become a second artist, but the
 * original spelling is what's kept.
 */
export async function ensureArtist(
  accountId: string,
  name: string,
): Promise<string> {
  const db = await getDb();
  const trimmed = name.trim();

  const [existing] = await db
    .select({ id: artist.id })
    .from(artist)
    .where(
      and(
        eq(artist.accountId, accountId),
        sql`lower(${artist.name}) = lower(${trimmed})`,
      ),
    )
    .limit(1);

  if (existing) return existing.id;

  const id = newId();
  await db.insert(artist).values({ id, accountId, name: trimmed });
  return id;
}

/* ------------------------------- releases ------------------------------- */

export type ReleaseInput = {
  artistId: string;
  title: string;
  kind: "single" | "ep" | "album";
  url: string | null;
  releaseDate: string | null;
  notes: string | null;
};

/**
 * The public address of a release, from the artist and the title:
 * "ISSE" + "Nova Vita" becomes /kit/isse-nova-vita.
 *
 * A clash gets -2, -3 … rather than a random suffix, because the whole point
 * of a slug is that a human can read it off a link in an email.
 */
async function uniqueReleaseSlug(
  artistName: string,
  title: string,
  exceptId?: string,
): Promise<string> {
  const db = await getDb();
  const base = slugify(`${artistName} ${title}`);

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;

    const clash = await db
      .select({ id: pressRelease.id })
      .from(pressRelease)
      .where(
        exceptId
          ? and(eq(pressRelease.slug, candidate), ne(pressRelease.id, exceptId))
          : eq(pressRelease.slug, candidate),
      )
      .limit(1);

    if (clash.length === 0) return candidate;
  }

  return `${base}-${newId().slice(0, 8)}`;
}

export async function createRelease(
  accountId: string,
  input: ReleaseInput,
): Promise<string> {
  const db = await getDb();
  const id = newId();

  const [owner] = await db
    .select({ name: artist.name })
    .from(artist)
    .where(eq(artist.id, input.artistId))
    .limit(1);

  await db.insert(pressRelease).values({
    id,
    accountId,
    ...input,
    slug: await uniqueReleaseSlug(owner?.name ?? "release", input.title),
  });

  return id;
}

/**
 * Publishing opens /kit/<slug> to anyone with the link; unpublishing closes
 * it again. Spotlight is deliberately untouched by this — an article about a
 * release is the platform's, not the musician's, and pulling a press kit
 * shouldn't silently retract someone else's writing.
 */
export async function setReleasePublished(
  accountId: string,
  releaseId: string,
  published: boolean,
): Promise<string | null> {
  const db = await getDb();

  const release = await getRelease(accountId, releaseId);
  if (!release) return null;

  // Releases made before sharing existed have no slug; mint one on the way
  // out rather than at publish-time-minus-one, so the link is stable from
  // the first share onwards.
  const slug =
    release.slug ??
    (await uniqueReleaseSlug(release.artistName, release.title, releaseId));

  await db
    .update(pressRelease)
    .set({
      slug,
      published,
      publishedAt: published
        ? sql`coalesce(published_at, unixepoch())`
        : sql`published_at`,
      updatedAt: new Date(),
    })
    .where(
      and(eq(pressRelease.id, releaseId), eq(pressRelease.accountId, accountId)),
    );

  return slug;
}

export async function listReleases(accountId: string) {
  const db = await getDb();
  return db
    .select({
      id: pressRelease.id,
      title: pressRelease.title,
      kind: pressRelease.kind,
      releaseDate: pressRelease.releaseDate,
      slug: pressRelease.slug,
      published: pressRelease.published,
      artistName: artist.name,
      coverAssetId: sql<string | null>`(
        select ${releaseAsset.id} from ${releaseAsset}
        where ${releaseAsset.releaseId} = ${pressRelease.id}
          and ${releaseAsset.kind} = 'cover'
        limit 1
      )`,
      assetCount: sql<number>`(
        select count(*) from ${releaseAsset}
        where ${releaseAsset.releaseId} = ${pressRelease.id}
      )`.mapWith(Number),
    })
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(eq(pressRelease.accountId, accountId))
    // Newest release first, and anything undated after the dated ones
    // rather than at the top, where a missing date would look like today.
    .orderBy(sql`${pressRelease.releaseDate} is null`, desc(pressRelease.releaseDate), desc(pressRelease.createdAt));
}

/**
 * The fields a link-in-bio release block needs: which release, its title, the
 * smart link fans follow, and the date the copy switches from pre-save to
 * listen. Scoped by account like everything else here.
 */
export async function listReleaseLinks(accountId: string) {
  const db = await getDb();
  return db
    .select({
      id: pressRelease.id,
      title: pressRelease.title,
      url: pressRelease.url,
      releaseDate: pressRelease.releaseDate,
    })
    .from(pressRelease)
    .where(eq(pressRelease.accountId, accountId))
    .orderBy(
      sql`${pressRelease.releaseDate} is null`,
      desc(pressRelease.releaseDate),
      desc(pressRelease.createdAt),
    );
}

export async function getRelease(accountId: string, releaseId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      id: pressRelease.id,
      title: pressRelease.title,
      kind: pressRelease.kind,
      url: pressRelease.url,
      releaseDate: pressRelease.releaseDate,
      notes: pressRelease.notes,
      slug: pressRelease.slug,
      published: pressRelease.published,
      artistId: pressRelease.artistId,
      artistName: artist.name,
    })
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(
      and(eq(pressRelease.id, releaseId), eq(pressRelease.accountId, accountId)),
    )
    .limit(1);

  return row ?? null;
}

export async function updateRelease(
  accountId: string,
  releaseId: string,
  input: ReleaseInput,
) {
  const db = await getDb();
  await db
    .update(pressRelease)
    .set({ ...input, updatedAt: new Date() })
    .where(
      and(eq(pressRelease.id, releaseId), eq(pressRelease.accountId, accountId)),
    );
}

/** Returns the R2 keys the caller must delete once the rows are gone. */
export async function deleteRelease(
  accountId: string,
  releaseId: string,
): Promise<string[]> {
  const db = await getDb();

  const owned = await getRelease(accountId, releaseId);
  if (!owned) return [];

  const assets = await db
    .select({ r2Key: releaseAsset.r2Key })
    .from(releaseAsset)
    .where(eq(releaseAsset.releaseId, releaseId));

  // The assets cascade with the release; the objects in R2 do not.
  await db.delete(pressRelease).where(eq(pressRelease.id, releaseId));

  return assets.map((asset) => asset.r2Key);
}

/* -------------------------------- assets -------------------------------- */

export async function listAssets(accountId: string, releaseId: string) {
  const db = await getDb();
  return db
    .select({
      id: releaseAsset.id,
      kind: releaseAsset.kind,
      filename: releaseAsset.filename,
      contentType: releaseAsset.contentType,
      sizeBytes: releaseAsset.sizeBytes,
      caption: releaseAsset.caption,
      position: releaseAsset.position,
      createdAt: releaseAsset.createdAt,
    })
    .from(releaseAsset)
    .innerJoin(pressRelease, eq(pressRelease.id, releaseAsset.releaseId))
    .where(
      and(
        eq(releaseAsset.releaseId, releaseId),
        eq(pressRelease.accountId, accountId),
      ),
    )
    .orderBy(asc(releaseAsset.position), asc(releaseAsset.createdAt));
}

/**
 * Adds a finished upload. Returns the key of a replaced cover, if any, so
 * the caller can bin the object — a release has exactly one cover, and the
 * second upload is how you change it.
 */
export async function addAsset(
  accountId: string,
  releaseId: string,
  input: {
    kind: AssetKind;
    r2Key: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
  },
): Promise<{ id: string; replacedKey: string | null } | null> {
  const db = await getDb();

  const owned = await getRelease(accountId, releaseId);
  if (!owned) return null;

  let replacedKey: string | null = null;

  if (input.kind === "cover") {
    const existing = await db
      .select({ id: releaseAsset.id, r2Key: releaseAsset.r2Key })
      .from(releaseAsset)
      .where(
        and(eq(releaseAsset.releaseId, releaseId), eq(releaseAsset.kind, "cover")),
      );

    if (existing.length > 0) {
      replacedKey = existing[0].r2Key;
      await db
        .delete(releaseAsset)
        .where(
          and(
            eq(releaseAsset.releaseId, releaseId),
            eq(releaseAsset.kind, "cover"),
          ),
        );
    }
  }

  const [{ next } = { next: 0 }] = await db
    .select({
      next: sql<number>`coalesce(max(${releaseAsset.position}), -1) + 1`.mapWith(
        Number,
      ),
    })
    .from(releaseAsset)
    .where(
      and(
        eq(releaseAsset.releaseId, releaseId),
        eq(releaseAsset.kind, input.kind),
      ),
    );

  const id = newId();
  await db
    .insert(releaseAsset)
    .values({ id, releaseId, position: next, ...input });

  return { id, replacedKey };
}

/** Ownership is proved by the join, never by the id alone. */
export async function getAsset(accountId: string, assetId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      id: releaseAsset.id,
      releaseId: releaseAsset.releaseId,
      kind: releaseAsset.kind,
      r2Key: releaseAsset.r2Key,
      filename: releaseAsset.filename,
      contentType: releaseAsset.contentType,
      sizeBytes: releaseAsset.sizeBytes,
    })
    .from(releaseAsset)
    .innerJoin(pressRelease, eq(pressRelease.id, releaseAsset.releaseId))
    .where(
      and(eq(releaseAsset.id, assetId), eq(pressRelease.accountId, accountId)),
    )
    .limit(1);

  return row ?? null;
}

export async function deleteAsset(
  accountId: string,
  assetId: string,
): Promise<string | null> {
  const db = await getDb();

  const asset = await getAsset(accountId, assetId);
  if (!asset) return null;

  await db.delete(releaseAsset).where(eq(releaseAsset.id, assetId));
  return asset.r2Key;
}

export type ReleaseSummary = Awaited<ReturnType<typeof listReleases>>[number];
export type ReleaseAssetRow = Awaited<ReturnType<typeof listAssets>>[number];
export type ReleaseLink = Awaited<ReturnType<typeof listReleaseLinks>>[number];

/* -------------------------------- public -------------------------------- */
/*
 * Reached from /kit/<slug> with no session at all. Both functions filter on
 * `published`, so unpublishing a release closes the page and every file on
 * it in the same instant.
 */

export async function getPublicRelease(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      id: pressRelease.id,
      title: pressRelease.title,
      kind: pressRelease.kind,
      url: pressRelease.url,
      releaseDate: pressRelease.releaseDate,
      notes: pressRelease.notes,
      slug: pressRelease.slug,
      artistName: artist.name,
    })
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(eq(pressRelease.slug, slug), eq(pressRelease.published, true)))
    .limit(1);

  return row ?? null;
}

export async function listPublicAssets(releaseId: string) {
  const db = await getDb();
  return db
    .select({
      id: releaseAsset.id,
      kind: releaseAsset.kind,
      filename: releaseAsset.filename,
      contentType: releaseAsset.contentType,
      sizeBytes: releaseAsset.sizeBytes,
      caption: releaseAsset.caption,
    })
    .from(releaseAsset)
    .innerJoin(pressRelease, eq(pressRelease.id, releaseAsset.releaseId))
    .where(
      and(
        eq(releaseAsset.releaseId, releaseId),
        eq(pressRelease.published, true),
      ),
    )
    .orderBy(asc(releaseAsset.position), asc(releaseAsset.createdAt));
}

/** One file, proved to belong to a published release by the join. */
export async function getPublicAsset(slug: string, assetId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      id: releaseAsset.id,
      kind: releaseAsset.kind,
      r2Key: releaseAsset.r2Key,
      filename: releaseAsset.filename,
      contentType: releaseAsset.contentType,
      sizeBytes: releaseAsset.sizeBytes,
    })
    .from(releaseAsset)
    .innerJoin(pressRelease, eq(pressRelease.id, releaseAsset.releaseId))
    .where(
      and(
        eq(releaseAsset.id, assetId),
        eq(pressRelease.slug, slug),
        eq(pressRelease.published, true),
      ),
    )
    .limit(1);

  return row ?? null;
}

export type PublicAsset = Awaited<ReturnType<typeof listPublicAssets>>[number];
