import "server-only";
import { and, asc, desc, eq, gte, isNotNull, isNull, lte, ne, or, sql } from "drizzle-orm";
import {
  artist,
  discoverPage,
  pressRelease,
  releaseAsset,
  spotlight,
  spotlightNudge,
  spotlightPlan,
  spotlightSkip,
  user,
} from "@/db/schema";
import { todayIso } from "@/lib/clock";
import { newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { serializeQuotes } from "@/lib/spotlight/quotes";
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

/**
 * Every release on the platform, each carrying the decision made about it:
 * written (has a spotlight), skipped, or neither. The page groups on these
 * rather than running three queries.
 */
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
      spotlightPublished: sql<number | null>`(
        select ${spotlight.published} from ${spotlight}
        where ${spotlight.releaseId} = ${pressRelease.id}
        limit 1
      )`,
      skipped: sql<number>`exists (
        select 1 from ${spotlightSkip}
        where ${spotlightSkip.releaseId} = ${pressRelease.id}
      )`.mapWith(Number),
      planned: sql<number>`exists (
        select 1 from ${spotlightPlan}
        where ${spotlightPlan.releaseId} = ${pressRelease.id}
      )`.mapWith(Boolean),
    })
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .orderBy(desc(pressRelease.createdAt));
}

export async function skipRelease(releaseId: string) {
  const db = await getDb();
  await db
    .insert(spotlightSkip)
    .values({ releaseId })
    // Skipping something already skipped is a no-op, not an error — two
    // clicks on a slow connection shouldn't surface as one.
    .onConflictDoNothing();
}

export async function unskipRelease(releaseId: string) {
  const db = await getDb();
  await db.delete(spotlightSkip).where(eq(spotlightSkip.releaseId, releaseId));
}

/* --------------------------- admin: the board -------------------------- */

/** What the board needs to sort a release into Needs info, Ready or Planned to write. */
const boardColumns = {
  id: pressRelease.id,
  title: pressRelease.title,
  kind: pressRelease.kind,
  releaseDate: pressRelease.releaseDate,
  createdAt: pressRelease.createdAt,
  url: pressRelease.url,
  genre: pressRelease.genre,
  mood: pressRelease.mood,
  country: pressRelease.country,
  language: pressRelease.language,
  labelStatus: pressRelease.labelStatus,
  gender: pressRelease.gender,
  artistName: artist.name,
  ownerName: user.name,
  ownerEmail: user.email,
  coverAssetId: sql<string | null>`(
    select ${releaseAsset.id} from ${releaseAsset}
    where ${releaseAsset.releaseId} = ${pressRelease.id}
      and ${releaseAsset.kind} = 'cover'
    limit 1
  )`,
  photoCount: sql<number>`(
    select count(*) from ${releaseAsset}
    where ${releaseAsset.releaseId} = ${pressRelease.id}
      and ${releaseAsset.kind} = 'photo'
  )`.mapWith(Number),
  planned: sql<number>`exists (
    select 1 from ${spotlightPlan}
    where ${spotlightPlan.releaseId} = ${pressRelease.id}
  )`.mapWith(Boolean),
  nudgedAt: sql<number | null>`(
    select ${spotlightNudge.sentAt} from ${spotlightNudge}
    where ${spotlightNudge.releaseId} = ${pressRelease.id}
  )`.mapWith((value: number | null) => (value === null ? null : new Date(value * 1000))),
};

/**
 * Every release still waiting for a decision: no Spotlight article yet
 * (planned or published) and not skipped. Admin only, across accounts.
 */
export async function listReleasesForBoard() {
  const db = await getDb();
  return db
    .select(boardColumns)
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .innerJoin(user, eq(user.id, pressRelease.accountId))
    .where(
      sql`not exists (select 1 from ${spotlight} where ${spotlight.releaseId} = ${pressRelease.id})
        and not exists (select 1 from ${spotlightSkip} where ${spotlightSkip.releaseId} = ${pressRelease.id})`,
    );
}

/** One release as the board sees it, for the email preview. */
export async function getBoardRelease(releaseId: string) {
  const db = await getDb();
  const [row] = await db
    .select(boardColumns)
    .from(pressRelease)
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .innerJoin(user, eq(user.id, pressRelease.accountId))
    .where(eq(pressRelease.id, releaseId))
    .limit(1);
  return row ?? null;
}

/** Log that the owner was emailed about what's missing (latest send wins). */
export async function markReleaseNudged(releaseId: string) {
  const db = await getDb();
  const sentAt = new Date();
  await db
    .insert(spotlightNudge)
    .values({ releaseId, sentAt })
    .onConflictDoUpdate({ target: spotlightNudge.releaseId, set: { sentAt } });
}

export type BoardRelease = Awaited<ReturnType<typeof listReleasesForBoard>>[number];

export async function planRelease(releaseId: string) {
  const db = await getDb();
  await db.insert(spotlightPlan).values({ releaseId }).onConflictDoNothing();
}

export async function unplanRelease(releaseId: string) {
  const db = await getDb();
  await db.delete(spotlightPlan).where(eq(spotlightPlan.releaseId, releaseId));
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

/** What a card needs: everything but the body, which can run to pages. */
const cardColumns = {
  id: spotlight.id,
  slug: spotlight.slug,
  headline: spotlight.headline,
  rating: spotlight.rating,
  headerAssetId: spotlight.headerAssetId,
  headerFocusX: spotlight.headerFocusX,
  headerFocusY: spotlight.headerFocusY,
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

const articleColumns = {
  ...cardColumns,
  body: spotlight.body,
  quotes: spotlight.quotes,
  // For the "If you like" story.
  releaseGenre: pressRelease.genre,
  releaseMood: pressRelease.mood,
};

export async function listSpotlights() {
  const db = await getDb();
  return db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    // By release date, undated last, same as the public listing — Planned
    // articles (future dates) surface above older published ones.
    .orderBy(
      sql`${pressRelease.releaseDate} is null`,
      desc(pressRelease.releaseDate),
      desc(spotlight.createdAt),
    );
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
  headerFocusX: number;
  headerFocusY: number;
  /** For the Instagram stories; stored as JSON. */
  quotes: string[];
};

export async function createSpotlight(input: SpotlightInput): Promise<string> {
  const db = await getDb();
  const id = newId();

  await db.insert(spotlight).values({
    id,
    ...input,
    quotes: serializeQuotes(input.quotes),
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
      headerFocusX: input.headerFocusX,
      headerFocusY: input.headerFocusY,
      quotes: serializeQuotes(input.quotes),
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

/**
 * `published` says an admin approved this to go out — it doesn't say the
 * release has actually happened yet. A future release date holds an
 * article back regardless of that flag; this is the one place that rule
 * lives, so every public query stays in sync automatically (the sitemap
 * included, since it reads through listPublishedSpotlights).
 */
async function isPubliclyVisible() {
  const today = await todayIso();
  return and(
    eq(spotlight.published, true),
    or(isNull(pressRelease.releaseDate), lte(pressRelease.releaseDate, today)),
  );
}

export async function listPublishedSpotlights() {
  const db = await getDb();
  return db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(await isPubliclyVisible())
    // By the record's release date, not by when the piece was written: the
    // page reads as a run of new music. Undated releases fall to the end
    // instead of the top, where a missing date would look like today.
    .orderBy(
      sql`${pressRelease.releaseDate} is null`,
      desc(pressRelease.releaseDate),
      desc(spotlight.publishedAt),
    )
    .limit(100);
}

/**
 * Every live Spotlight with its release's tags, for the Discover pages
 * (lib/discover/pages.ts). No limit: a Discover page counts all of them.
 * Ordered like the Spotlight index, newest release first.
 */
export async function listDiscoverArticles() {
  const db = await getDb();
  return db
    .select({
      ...cardColumns,
      genre: pressRelease.genre,
      mood: pressRelease.mood,
      country: pressRelease.country,
      language: pressRelease.language,
      gender: pressRelease.gender,
    })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(await isPubliclyVisible())
    .orderBy(
      sql`${pressRelease.releaseDate} is null`,
      desc(pressRelease.releaseDate),
      desc(spotlight.publishedAt),
    );
}

export type DiscoverArticleRow = Awaited<ReturnType<typeof listDiscoverArticles>>[number];

/** Discover pages that have crossed the go-live line before. */
export async function listDiscoverWentLive() {
  const db = await getDb();
  const rows = await db.select({ slug: discoverPage.slug }).from(discoverPage);
  return new Set(rows.map((row) => row.slug));
}

export async function recordDiscoverLive(slugs: string[]) {
  if (slugs.length === 0) return;
  const db = await getDb();
  // D1 caps bound parameters per statement, so a first run that finds many
  // pages over the line at once goes in batches.
  for (let i = 0; i < slugs.length; i += 50) {
    await db
      .insert(discoverPage)
      .values(slugs.slice(i, i + 50).map((slug) => ({ slug })))
      .onConflictDoNothing();
  }
}

/**
 * Real press kits to learn from, for the press kit guide in Knowledge: the
 * newest releases with a live Spotlight article. The kit itself may be
 * private. Then the guide shows only what the article already shows (cover,
 * title, genre) plus a count of what's in the kit, and no link: the files
 * of a private kit are never reachable from here. `kitPublished` says which.
 */
export async function listSpotlightPressKits(limit = 3) {
  const db = await getDb();
  const assetCount = (kind: "photo" | "track" | "document") =>
    sql<number>`(
      select count(*) from ${releaseAsset}
      where ${releaseAsset.releaseId} = ${pressRelease.id}
        and ${releaseAsset.kind} = ${kind}
    )`.mapWith(Number);

  return db
    .select({
      spotlightSlug: spotlight.slug,
      rating: spotlight.rating,
      releaseTitle: pressRelease.title,
      releaseKind: pressRelease.kind,
      genre: pressRelease.genre,
      kitSlug: pressRelease.slug,
      kitPublished: pressRelease.published,
      artistName: artist.name,
      coverAssetId: articleColumns.coverAssetId,
      photos: assetCount("photo"),
      tracks: assetCount("track"),
      documents: assetCount("document"),
    })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(await isPubliclyVisible())
    .orderBy(desc(spotlight.publishedAt), desc(spotlight.createdAt))
    .limit(limit);
}

/** The newest live articles, by when they went up, for the carousel PDF. */
export async function listRecentLiveSpotlightIds(limit: number) {
  const db = await getDb();
  const rows = await db
    .select({ id: spotlight.id })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(await isPubliclyVisible())
    .orderBy(desc(spotlight.publishedAt), desc(spotlight.createdAt))
    .limit(limit);
  return rows.map((row) => row.id);
}

/** The most recent other published articles, for the "keep reading" widget. */
export async function listRelatedSpotlights(excludeId: string, limit = 3) {
  const db = await getDb();
  return db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(await isPubliclyVisible(), ne(spotlight.id, excludeId)))
    .orderBy(desc(spotlight.publishedAt), desc(spotlight.createdAt))
    .limit(limit);
}

export async function getPublishedSpotlight(slug: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(eq(spotlight.slug, slug), await isPubliclyVisible()))
    .limit(1);

  return row ?? null;
}

/**
 * An article for its public asset library (/spotlight/assets/<id>): any
 * published one, Planned included, so the artist can get their release-day
 * posts ready. `live` says whether the article itself is up yet; the
 * badges link to it, so they wait for that. Drafts resolve to nothing.
 */
export async function getSpotlightForAssets(id: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(eq(spotlight.id, id), eq(spotlight.published, true)))
    .limit(1);
  if (!row) return null;
  const today = await todayIso();
  return { ...row, live: row.releaseDate === null || row.releaseDate <= today };
}

/**
 * The live article about one of this account's own releases, if there is
 * one, for the Spotlight button and the Coverage list on the release page. Scoped by account like
 * everything in lib/dal/press.ts, and only once the article is public, so a
 * musician never gets a link that doesn't work yet.
 */
export async function getLiveSpotlightForRelease(
  accountId: string,
  releaseId: string,
) {
  const db = await getDb();
  const [row] = await db
    .select({
      slug: spotlight.slug,
      headline: spotlight.headline,
      rating: spotlight.rating,
      publishedAt: spotlight.publishedAt,
      releaseDate: pressRelease.releaseDate,
    })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(
      and(
        eq(pressRelease.id, releaseId),
        eq(pressRelease.accountId, accountId),
        await isPubliclyVisible(),
      ),
    )
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
 * By slug and a matching preview token — for a musician with a shared link
 * but no account. Deliberately not gated on `published` at all: showing
 * something not public yet is the entire point of this link.
 */
export async function getSpotlightByPreviewToken(slug: string, token: string) {
  const db = await getDb();
  const [row] = await db
    .select(articleColumns)
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(artist, eq(artist.id, pressRelease.artistId))
    .where(and(eq(spotlight.slug, slug), eq(spotlight.previewToken, token)))
    .limit(1);

  return row ?? null;
}

/**
 * Generated once, on first request, not at creation — an article nobody
 * ever previews externally never needs one. Stable after that: the same
 * link keeps working even once the article goes properly live (it just
 * resolves through the normal public path by then).
 */
export async function ensurePreviewToken(id: string): Promise<string | null> {
  const db = await getDb();
  const [existing] = await db
    .select({ previewToken: spotlight.previewToken })
    .from(spotlight)
    .where(eq(spotlight.id, id))
    .limit(1);

  if (!existing) return null;
  if (existing.previewToken) return existing.previewToken;

  const token = newId();
  await db
    .update(spotlight)
    .set({ previewToken: token })
    .where(eq(spotlight.id, id));

  return token;
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
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(and(eq(releaseAsset.id, assetId), await isPubliclyVisible()))
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

/** Same idea as getSpotlightByPreviewToken, for the header/cover image
 *  request that page's <img> tags make — not gated on published either. */
export async function getSpotlightImageByPreviewToken(
  assetId: string,
  token: string,
) {
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
    .where(
      and(eq(releaseAsset.id, assetId), eq(spotlight.previewToken, token)),
    )
    .limit(1);

  if (!row) return null;
  if (row.kind !== "cover" && row.headerAssetId !== assetId) return null;

  return { r2Key: row.r2Key, contentType: row.contentType };
}

export type SpotlightRow = Awaited<ReturnType<typeof listSpotlights>>[number];
export type ReleaseOption = Awaited<
  ReturnType<typeof listReleasesForPicker>
>[number];

/* --------------------------- emails to the owner --------------------------- */

export type SpotlightEmailKind = "planned" | "published" | "reminder";

/**
 * Who a Spotlight email goes to: the account that owns the release's press
 * kit. Spotlight has no tenant key, so this crosses from the admin's side to
 * the musician's on purpose. Only admin actions and the cron call it.
 */
export async function getSpotlightOwner(spotlightId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ name: user.name, email: user.email })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .innerJoin(user, eq(user.id, pressRelease.accountId))
    .where(eq(spotlight.id, spotlightId))
    .limit(1);

  return row ?? null;
}

/** Whether this account owns the release the article is about. */
export async function isSpotlightOwner(spotlightId: string, accountId: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: spotlight.id })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(and(eq(spotlight.id, spotlightId), eq(pressRelease.accountId, accountId)))
    .limit(1);

  return Boolean(row);
}

export async function getSpotlightEmailLog(spotlightId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      plannedEmailSentAt: spotlight.plannedEmailSentAt,
      publishedEmailSentAt: spotlight.publishedEmailSentAt,
      reminderEmailSentAt: spotlight.reminderEmailSentAt,
    })
    .from(spotlight)
    .where(eq(spotlight.id, spotlightId))
    .limit(1);

  return row ?? null;
}

export async function markSpotlightEmailSent(
  spotlightId: string,
  kind: SpotlightEmailKind,
) {
  const db = await getDb();
  await db
    .update(spotlight)
    .set(
      kind === "planned"
        ? { plannedEmailSentAt: new Date() }
        : kind === "published"
          ? { publishedEmailSentAt: new Date() }
          : { reminderEmailSentAt: new Date() },
    )
    .where(eq(spotlight.id, spotlightId));
}

/**
 * Planned articles whose release day has come: live now, told "planned"
 * earlier, not yet told "published". Only articles that got the planned
 * email qualify, so turning this on never mails every article that was
 * already live before these emails existed.
 */
export async function listSpotlightsDueLiveEmail() {
  const db = await getDb();
  return db
    .select({ id: spotlight.id })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(
      and(
        await isPubliclyVisible(),
        isNotNull(spotlight.plannedEmailSentAt),
        isNull(spotlight.publishedEmailSentAt),
      ),
    );
}

const DAY_MS = 86_400_000;

/**
 * Articles due the "share it again" reminder: still live, told "published"
 * 7 to 9 days ago, not reminded yet. Timed from that email rather than the
 * release date, since an article can be written days after the release.
 * The two-day window gives the hourly cron room for a bad day, and keeps
 * articles that went live long before this email existed from all being
 * mailed at once.
 */
export async function listSpotlightsDueReminderEmail() {
  const db = await getDb();
  const now = Date.now();
  return db
    .select({ id: spotlight.id })
    .from(spotlight)
    .innerJoin(pressRelease, eq(pressRelease.id, spotlight.releaseId))
    .where(
      and(
        await isPubliclyVisible(),
        isNull(spotlight.reminderEmailSentAt),
        lte(spotlight.publishedEmailSentAt, new Date(now - 7 * DAY_MS)),
        gte(spotlight.publishedEmailSentAt, new Date(now - 9 * DAY_MS)),
      ),
    );
}
