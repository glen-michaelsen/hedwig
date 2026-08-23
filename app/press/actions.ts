"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAccount } from "@/lib/auth";
import * as dal from "@/lib/dal/press";
import * as stats from "@/lib/dal/kit-stats";
import { fetchLinkMeta } from "@/lib/links";
import { deletePressObject } from "@/lib/press/images";

export type ReleaseFormState = { error?: string };

const KINDS = ["single", "ep", "album"] as const;

function nullable(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * The artist is either picked from the list or typed as a new one. A typed
 * name wins: someone who filled that field meant to use it.
 */
async function resolveArtistId(
  accountId: string,
  formData: FormData,
): Promise<string | null> {
  const typed = nullable(formData.get("newArtist"));
  if (typed) return dal.ensureArtist(accountId, typed);

  const picked = nullable(formData.get("artistId"));
  return picked;
}

function readRelease(
  formData: FormData,
): { ok: true; value: Omit<dal.ReleaseInput, "artistId"> } | { ok: false; error: string } {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "The release needs a title" };

  const kind = String(formData.get("kind") ?? "");
  if (!KINDS.includes(kind as (typeof KINDS)[number])) {
    return { ok: false, error: "Pick single, EP or album" };
  }

  const url = nullable(formData.get("url"));
  if (url && !z.url().safeParse(url).success) {
    return { ok: false, error: "Enter a full link, including https://" };
  }

  const releaseDate = nullable(formData.get("releaseDate"));
  if (releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return { ok: false, error: "That release date doesn't look right" };
  }

  return {
    ok: true,
    value: {
      title,
      kind: kind as (typeof KINDS)[number],
      url,
      releaseDate,
      notes: nullable(formData.get("notes")),
    },
  };
}

export async function createReleaseAction(
  _prev: ReleaseFormState,
  formData: FormData,
): Promise<ReleaseFormState> {
  const account = await requireAccount();

  const parsed = readRelease(formData);
  if (!parsed.ok) return { error: parsed.error };

  const artistId = await resolveArtistId(account.id, formData);
  if (!artistId) return { error: "Choose an artist, or add a new one" };

  const id = await dal.createRelease(account.id, { artistId, ...parsed.value });

  revalidatePath("/press");
  // Straight to the release, which is where the files get added.
  redirect(`/press/${id}`);
}

export async function updateReleaseAction(
  _prev: ReleaseFormState,
  formData: FormData,
): Promise<ReleaseFormState> {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const parsed = readRelease(formData);
  if (!parsed.ok) return { error: parsed.error };

  const artistId = await resolveArtistId(account.id, formData);
  if (!artistId) return { error: "Choose an artist, or add a new one" };

  await dal.updateRelease(account.id, releaseId, {
    artistId,
    ...parsed.value,
  });

  revalidatePath("/press");
  revalidatePath(`/press/${releaseId}`);
  redirect(`/press/${releaseId}`);
}

export async function deleteReleaseAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const keys = await dal.deleteRelease(account.id, releaseId);
  // Rows first, then the objects: an orphaned object costs storage, while a
  // row pointing at a deleted object is a broken page.
  await Promise.all(keys.map((key) => deletePressObject(key)));

  revalidatePath("/press");
  redirect("/press");
}

export async function deleteAssetAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const key = await dal.deleteAsset(account.id, String(formData.get("assetId")));
  if (key) await deletePressObject(key);

  revalidatePath(`/press/${releaseId}`);
}

/**
 * Opens or closes the public /kit/<slug> page. Spotlight is untouched by
 * design: an article about a release belongs to the platform, and pulling a
 * press kit shouldn't silently retract someone else's writing.
 */
export async function toggleReleasePublishedAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  await dal.setReleasePublished(
    account.id,
    releaseId,
    formData.get("published") === "1",
  );

  revalidatePath("/press");
  revalidatePath(`/press/${releaseId}`);
}

/* ------------------------------- captions ------------------------------- */

function captionValue(formData: FormData): string | null {
  const text = String(formData.get("caption") ?? "").trim();
  return text.length > 0 ? text.slice(0, 200) : null;
}

export async function setAssetCaptionAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  await dal.setAssetCaption(
    account.id,
    String(formData.get("assetId")),
    captionValue(formData),
  );

  revalidatePath(`/press/${releaseId}`);
}

export async function setAllPhotoCaptionsAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  await dal.setAllPhotoCaptions(account.id, releaseId, captionValue(formData));

  revalidatePath(`/press/${releaseId}`);
}

/* ------------------------------- coverage ------------------------------- */

const COVERAGE_KINDS = [
  "review",
  "feature",
  "interview",
  "playlist",
  "radio",
  "social",
  "other",
] as const;

export type CoverageState = { error?: string; added?: boolean };

/**
 * Adding a piece of coverage is one field — the link — because that is what
 * someone has in their hand when a review lands. The title and outlet are
 * read from the page, and everything else is optional.
 */
export async function addCoverageAction(
  _prev: CoverageState,
  formData: FormData,
): Promise<CoverageState> {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const url = String(formData.get("url") ?? "").trim();
  if (!z.url().safeParse(url).success) {
    return { error: "Paste a full link, including https://" };
  }

  const rawKind = String(formData.get("kind") ?? "other");
  const kind = (COVERAGE_KINDS as readonly string[]).includes(rawKind)
    ? (rawKind as stats.CoverageKind)
    : "other";

  const publishedOn = nullable(formData.get("publishedOn"));
  if (publishedOn && !/^\d{4}-\d{2}-\d{2}$/.test(publishedOn)) {
    return { error: "That date doesn't look right" };
  }

  // Best effort — a paywalled review still deserves to be recorded.
  let title: string | null = null;
  try {
    title = (await fetchLinkMeta(url)).title;
  } catch {
    title = null;
  }

  let outlet = nullable(formData.get("outlet"));
  if (!outlet) {
    try {
      outlet = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      outlet = null;
    }
  }

  const ok = await stats.addCoverage(account.id, releaseId, {
    url,
    title,
    outlet,
    kind,
    note: nullable(formData.get("note")),
    publishedOn,
  });

  if (!ok) return { error: "That release no longer exists" };

  revalidatePath(`/press/${releaseId}`);
  return { added: true };
}

export async function deleteCoverageAction(formData: FormData) {
  const account = await requireAccount();
  await stats.deleteCoverage(account.id, String(formData.get("coverageId")));
  revalidatePath(`/press/${String(formData.get("releaseId"))}`);
}

/** Renaming a file changes what pages call it, never the stored object. */
export async function renameAssetAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const raw = String(formData.get("title") ?? "").trim();
  await dal.setAssetTitle(
    account.id,
    String(formData.get("assetId")),
    raw.length > 0 ? raw.slice(0, 200) : null,
  );

  revalidatePath(`/press/${releaseId}`);
}
