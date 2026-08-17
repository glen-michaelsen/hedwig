"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import * as dal from "@/lib/dal/ideas";

const STATUSES = ["new", "planned", "shipped", "declined"] as const;

/**
 * Ideas aren't owned by an account, so there is no tenant key to scope these
 * by — requireAdmin() is the whole boundary. It has to be the first line of
 * every one of these.
 */
export async function setIdeaStatusAction(formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;

  await dal.setIdeaStatus(
    String(formData.get("ideaId")),
    status as dal.IdeaStatus,
  );
  revalidatePath("/account/ideas");
}

export async function toggleIdeaPublishedAction(formData: FormData) {
  await requireAdmin();
  await dal.setIdeaPublished(
    String(formData.get("ideaId")),
    formData.get("published") === "1",
  );
  revalidatePath("/account/ideas");
  revalidatePath("/ideas");
}

export async function deleteIdeaAction(formData: FormData) {
  await requireAdmin();
  await dal.deleteIdea(String(formData.get("ideaId")));
  revalidatePath("/account/ideas");
  revalidatePath("/ideas");
}
