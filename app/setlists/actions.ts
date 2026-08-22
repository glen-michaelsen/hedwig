"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAccount } from "@/lib/auth";
import * as dal from "@/lib/dal/setlist";
import { parseDuration } from "@/lib/setlist/duration";

export type GigFormState = { error?: string };

function nullable(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function readGig(
  formData: FormData,
): { ok: true; value: dal.GigInput } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Give the gig a name" };

  const date = nullable(formData.get("date"));
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "That date doesn't look right" };
  }

  return {
    ok: true,
    value: {
      name,
      date,
      location: nullable(formData.get("location")),
      notes: nullable(formData.get("notes")),
    },
  };
}

export async function createGigAction(
  _prev: GigFormState,
  formData: FormData,
): Promise<GigFormState> {
  const account = await requireAccount();

  const parsed = readGig(formData);
  if (!parsed.ok) return { error: parsed.error };

  // "3 sets of 45" is how a booking is described, so that's what the form
  // asks for; the sets themselves are editable afterwards.
  const count = Math.min(6, Math.max(1, Number(formData.get("setCount")) || 1));
  const minutes = Math.min(
    300,
    Math.max(5, Number(formData.get("setMinutes")) || 45),
  );

  const sets = Array.from({ length: count }, (_, index) => ({
    name: count === 1 ? "Set" : `Set ${index + 1}`,
    targetMinutes: minutes,
  }));

  const id = await dal.createGig(account.id, parsed.value, sets);

  revalidatePath("/setlists");
  redirect(`/setlists/${id}`);
}

export async function updateGigAction(
  _prev: GigFormState,
  formData: FormData,
): Promise<GigFormState> {
  const account = await requireAccount();
  const gigId = String(formData.get("gigId"));

  const parsed = readGig(formData);
  if (!parsed.ok) return { error: parsed.error };

  await dal.updateGig(account.id, gigId, parsed.value);

  revalidatePath("/setlists");
  revalidatePath(`/setlists/${gigId}`);
  return {};
}

export async function deleteGigAction(formData: FormData) {
  const account = await requireAccount();
  await dal.deleteGig(account.id, String(formData.get("gigId")));
  revalidatePath("/setlists");
  redirect("/setlists");
}

export async function duplicateGigAction(formData: FormData) {
  const account = await requireAccount();
  await dal.duplicateGig(account.id, String(formData.get("gigId")));
  revalidatePath("/setlists");
}

/* --------------------------------- sets --------------------------------- */

function setValues(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "Set").trim() || "Set",
    targetMinutes: Math.min(
      300,
      Math.max(5, Number(formData.get("targetMinutes")) || 45),
    ),
  };
}

export async function addSetAction(formData: FormData) {
  const account = await requireAccount();
  const gigId = String(formData.get("gigId"));

  await dal.addSet(account.id, gigId, setValues(formData));
  revalidatePath(`/setlists/${gigId}`);
}

export async function updateSetAction(formData: FormData) {
  const account = await requireAccount();

  await dal.updateSet(account.id, String(formData.get("setId")), setValues(formData));
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

export async function deleteSetAction(formData: FormData) {
  const account = await requireAccount();

  await dal.deleteSet(account.id, String(formData.get("setId")));
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

export async function duplicateSetAction(formData: FormData) {
  const account = await requireAccount();

  await dal.duplicateSet(account.id, String(formData.get("setId")));
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

/* --------------------------------- songs -------------------------------- */

function songValues(formData: FormData): dal.SongInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    artist: nullable(formData.get("artist")),
    durationSeconds: parseDuration(String(formData.get("duration") ?? "")),
    note: nullable(formData.get("note")),
  };
}

export async function addSongAction(formData: FormData) {
  const account = await requireAccount();
  const values = songValues(formData);
  if (!values.title) return;

  await dal.addSong(account.id, String(formData.get("setId")), values);
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

export async function updateSongAction(formData: FormData) {
  const account = await requireAccount();
  const values = songValues(formData);
  if (!values.title) return;

  await dal.updateSong(account.id, String(formData.get("songId")), values);
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

export async function deleteSongAction(formData: FormData) {
  const account = await requireAccount();

  await dal.deleteSong(account.id, String(formData.get("songId")));
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

export async function duplicateSongAction(formData: FormData) {
  const account = await requireAccount();

  await dal.duplicateSong(account.id, String(formData.get("songId")));
  revalidatePath(`/setlists/${String(formData.get("gigId"))}`);
}

/**
 * Called once per drop with the whole board, so a move between sets is one
 * round trip and can't leave a song in two places.
 */
export async function saveArrangementAction(
  gigId: string,
  arrangement: { setId: string; songIds: string[] }[],
) {
  const account = await requireAccount();

  await dal.saveArrangement(account.id, gigId, arrangement);
  revalidatePath(`/setlists/${gigId}`);
}
