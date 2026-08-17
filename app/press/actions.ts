"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAccount } from "@/lib/auth";
import * as dal from "@/lib/dal/press";
import { deleteObject } from "@/lib/r2";

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
  await Promise.all(keys.map((key) => deleteObject(key)));

  revalidatePath("/press");
  redirect("/press");
}

export async function deleteAssetAction(formData: FormData) {
  const account = await requireAccount();
  const releaseId = String(formData.get("releaseId"));

  const key = await dal.deleteAsset(account.id, String(formData.get("assetId")));
  if (key) await deleteObject(key);

  revalidatePath(`/press/${releaseId}`);
}
