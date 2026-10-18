import "server-only";
import { z } from "zod";
import { todayIso } from "@/lib/clock";
import { listAllIdeas } from "@/lib/dal/ideas";
import { listMusicians } from "@/lib/dal/musicians";
import { getRelease, listAllPressKits, listAssets, getReleaseOwnerId } from "@/lib/dal/press";
import {
  getSpotlight,
  getSpotlightBySlugForAdmin,
  listDiscoverArticles,
  listDiscoverWentLive,
  listReleasesForBoard,
  listSpotlights,
} from "@/lib/dal/spotlight";
import { evaluateDiscover } from "@/lib/discover/pages";
import { parseTagList } from "@/lib/press/taxonomy";
import { missingOf, readinessOf, type ReadinessInput } from "@/lib/spotlight/readiness";
import { computeSpotlightStatus } from "@/lib/spotlight/slug";

/**
 * What the admin MCP can do: read, and nothing else. Every tool crosses
 * accounts, which is why /api/mcp lets only the admin's tokens in.
 */

type Context = { appUrl: string; adminId: string };

type Tool<S extends z.ZodObject> = {
  name: string;
  title: string;
  description: string;
  input: S;
  run: (args: z.infer<S>, ctx: Context) => Promise<unknown>;
};

const tool = <S extends z.ZodObject>(definition: Tool<S>) => definition;

const contains = (needle: string | undefined, ...haystack: (string | null | undefined)[]) =>
  !needle || haystack.some((value) => value?.toLowerCase().includes(needle.toLowerCase()));

function readiness(input: ReadinessInput) {
  const { essentials, extras } = missingOf(readinessOf(input));
  return {
    ready: essentials.length === 0,
    missingEssentials: essentials.map((item) => item.label),
    missingExtras: extras.map((item) => item.label),
  };
}

function tags(row: {
  genre: string | null;
  mood: string | null;
  country: string | null;
  language: string | null;
  labelStatus: string | null;
  gender: string | null;
}) {
  return {
    genre: parseTagList(row.genre),
    mood: parseTagList(row.mood),
    country: row.country,
    language: row.language,
    labelStatus: row.labelStatus,
    gender: row.gender,
  };
}

const limit = z.number().int().min(1).max(500).default(100).describe("How many to return at most.");

export const TOOLS = [
  tool({
    name: "list_press_kits",
    title: "List press kits",
    description:
      "Every press kit (release) on Trenodo, across all musicians: title, artist, owner, release date, tags, and whether it's ready for a Spotlight. Newest release first.",
    input: z.object({
      query: z.string().optional().describe("Matches title, artist, owner name or email."),
      readiness: z
        .enum(["any", "ready", "needs-info"])
        .default("any")
        .describe("ready: has a cover and a press photo. needs-info: missing one of them."),
      limit,
    }),
    async run({ query, readiness: wanted, limit }, { appUrl }) {
      const rows = await listAllPressKits();
      return rows
        .filter((row) => contains(query, row.title, row.artistName, row.ownerName, row.ownerEmail))
        .map((row) => {
          const t = tags(row);
          const check = readiness({ ...t, hasCover: row.hasCover, photoCount: row.photoCount, url: row.url });
          return {
            id: row.id,
            title: row.title,
            kind: row.kind,
            artist: row.artistName,
            owner: { name: row.ownerName, email: row.ownerEmail },
            releaseDate: row.releaseDate,
            published: row.published,
            publicUrl: row.published && row.slug ? `${appUrl}/kit/${row.slug}` : null,
            musicUrl: row.url,
            ...t,
            files: row.assetCount,
            hasSpotlight: Boolean(row.spotlightId),
            ...check,
          };
        })
        .filter((row) => wanted === "any" || (wanted === "ready") === row.ready)
        .slice(0, limit);
    },
  }),

  tool({
    name: "get_press_kit",
    title: "Get a press kit",
    description:
      "One press kit in full: details, notes, tags, every file (cover, photos, audio, documents) with its caption, readiness, and its Spotlight if it has one.",
    input: z.object({ id: z.string().describe("The press kit's id, from list_press_kits.") }),
    async run({ id }, { appUrl }) {
      const ownerId = await getReleaseOwnerId(id);
      if (!ownerId) return { error: "No press kit with that id." };
      const [release, assets, kits] = await Promise.all([
        getRelease(ownerId, id),
        listAssets(ownerId, id),
        listAllPressKits(),
      ]);
      if (!release) return { error: "No press kit with that id." };
      const kit = kits.find((row) => row.id === id);
      const spotlight = kit?.spotlightId ? await getSpotlight(kit.spotlightId) : null;
      const t = tags(release);
      return {
        id: release.id,
        title: release.title,
        kind: release.kind,
        artist: release.artistName,
        owner: kit ? { name: kit.ownerName, email: kit.ownerEmail } : null,
        releaseDate: release.releaseDate,
        published: release.published,
        publicUrl: release.published && release.slug ? `${appUrl}/kit/${release.slug}` : null,
        musicUrl: release.url,
        city: release.city,
        ...t,
        notes: release.notes,
        files: assets.map((asset) => ({
          kind: asset.kind,
          filename: asset.filename,
          title: asset.title,
          caption: asset.caption,
          contentType: asset.contentType,
          sizeBytes: asset.sizeBytes,
          width: asset.width,
          height: asset.height,
        })),
        ...readiness({
          ...t,
          hasCover: assets.some((asset) => asset.kind === "cover"),
          photoCount: assets.filter((asset) => asset.kind === "photo").length,
          url: release.url,
        }),
        spotlight: spotlight
          ? { id: spotlight.id, headline: spotlight.headline, slug: spotlight.slug, published: spotlight.published }
          : null,
      };
    },
  }),

  tool({
    name: "list_spotlights",
    title: "List Spotlight articles",
    description:
      "Every Spotlight article: headline, rating (hearts, 1 to 6), status (draft, planned or published), the release it covers, and a short excerpt.",
    input: z.object({
      status: z.enum(["any", "draft", "planned", "published"]).default("any"),
      query: z.string().optional().describe("Matches headline, release title or artist."),
      limit,
    }),
    async run({ status, query, limit }, { appUrl }) {
      const [rows, today] = await Promise.all([listSpotlights(), todayIso()]);
      return rows
        .map((row) => ({ row, state: computeSpotlightStatus(row.published, row.releaseDate, today) }))
        .filter(({ row, state }) => (status === "any" || state === status) && contains(query, row.headline, row.releaseTitle, row.artistName))
        .slice(0, limit)
        .map(({ row, state }) => ({
          id: row.id,
          headline: row.headline,
          slug: row.slug,
          status: state,
          rating: row.rating,
          release: { id: row.releaseId, title: row.releaseTitle, kind: row.releaseKind, date: row.releaseDate },
          artist: row.artistName,
          url: `${appUrl}/spotlight/${row.slug}`,
          excerpt: row.body.slice(0, 280),
        }));
    },
  }),

  tool({
    name: "get_spotlight",
    title: "Get a Spotlight article",
    description: "One Spotlight article in full, including its body text.",
    input: z.object({ idOrSlug: z.string().describe("The article's id or its URL slug.") }),
    async run({ idOrSlug }, { appUrl }) {
      const row = (await getSpotlight(idOrSlug)) ?? (await getSpotlightBySlugForAdmin(idOrSlug));
      if (!row) return { error: "No Spotlight with that id or slug." };
      return {
        id: row.id,
        headline: row.headline,
        slug: row.slug,
        status: computeSpotlightStatus(row.published, row.releaseDate, await todayIso()),
        rating: row.rating,
        publishedAt: row.publishedAt,
        release: { id: row.releaseId, title: row.releaseTitle, kind: row.releaseKind, date: row.releaseDate, musicUrl: row.releaseUrl },
        artist: row.artistName,
        url: `${appUrl}/spotlight/${row.slug}`,
        body: row.body,
      };
    },
  }),

  tool({
    name: "spotlight_board",
    title: "Spotlight board",
    description:
      "Press kits waiting for a Spotlight decision, by column: needs-info (missing a cover or press photo), ready, and planned (the admin's own list). Includes what's missing and when the owner was last emailed.",
    input: z.object({}),
    async run() {
      const rows = await listReleasesForBoard();
      return rows.map((row) => {
        const check = readiness({ ...tags(row), hasCover: Boolean(row.coverAssetId), photoCount: row.photoCount, url: row.url });
        return {
          id: row.id,
          title: row.title,
          artist: row.artistName,
          owner: { name: row.ownerName, email: row.ownerEmail },
          releaseDate: row.releaseDate,
          column: row.planned ? "planned" : check.ready ? "ready" : "needs-info",
          missingEssentials: check.missingEssentials,
          missingExtras: check.missingExtras,
          lastEmailed: row.nudgedAt,
        };
      });
    },
  }),

  tool({
    name: "list_musicians",
    title: "List musicians",
    description:
      "Every account on Trenodo except the admin's: name, email, when they joined and were last seen, and how much they use (releases, gigs, students, Link in Bio).",
    input: z.object({ query: z.string().optional().describe("Matches name or email."), limit }),
    async run({ query, limit }, { appUrl, adminId }) {
      const rows = await listMusicians(adminId);
      return rows
        .filter((row) => contains(query, row.name, row.email))
        .slice(0, limit)
        .map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          studioName: row.studioName,
          joined: row.createdAt,
          lastSeen: row.lastSeen,
          releases: row.releaseCount,
          gigs: row.gigCount,
          students: row.studentCount,
          linkInBio: row.bioHandle ? `${appUrl}/@${row.bioHandle}` : null,
        }));
    },
  }),

  tool({
    name: "list_discover_pages",
    title: "List Discover pages",
    description:
      "Discover pages (themed lists of Spotlights, like Danish female singers) that have matches: whether each is live, why not if it isn't, and how many articles it holds.",
    input: z.object({}),
    async run(_args, { appUrl }) {
      const [rows, wentLive] = await Promise.all([listDiscoverArticles(), listDiscoverWentLive()]);
      // Worked out the same way as the site does, without recording newly
      // live pages: this tool only reads.
      const { statuses } = evaluateDiscover(
        rows.map((row) => ({
          id: row.id,
          tags: {
            genre: parseTagList(row.genre),
            mood: parseTagList(row.mood),
            country: row.country,
            language: row.language,
            gender: row.gender,
          },
        })),
        wentLive,
      );
      return statuses.map((status) => ({
        slug: status.page.slug,
        title: status.page.title,
        group: status.page.group,
        live: status.live,
        reason: status.reason,
        articles: status.ids.length,
        url: `${appUrl}/discover/${status.page.slug}`,
      }));
    },
  }),

  tool({
    name: "list_ideas",
    title: "List ideas",
    description: "Ideas sent in through the ideas board, with votes, status and who sent them. Newest first.",
    input: z.object({
      status: z.enum(["any", "new", "planned", "shipped", "declined"]).default("any"),
      limit,
    }),
    async run({ status, limit }) {
      const rows = await listAllIdeas();
      return rows.filter((row) => status === "any" || row.status === status).slice(0, limit);
    },
  }),
];
