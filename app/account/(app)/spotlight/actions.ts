"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import * as dal from "@/lib/dal/spotlight";
import { isValidRating } from "@/lib/spotlight/slug";

export type SpotlightFormState = { error?: string };

/**
 * Spotlight has no tenant key — an article is about someone else's release by
 * design — so requireAdmin() at the top of every action is the entire
 * boundary. It is not optional in any of these.
 */
function readForm(
  formData: FormData,
):
  | { ok: true; value: Omit<dal.SpotlightInput, "releaseId"> }
  | { ok: false; error: string } {
  const headline = String(formData.get("headline") ?? "").trim();
  if (headline.length < 3) return { ok: false, error: "Give it a headline" };
  if (headline.length > 160) {
    return { ok: false, error: "That headline is too long for a URL — keep it under 160 characters" };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 20) {
    return { ok: false, error: "The article is empty — write a few lines" };
  }

  const rating = Number(formData.get("rating"));
  if (!isValidRating(rating)) {
    return { ok: false, error: "Pick a rating from 1 to 6 hearts" };
  }

  const headerAssetId = String(formData.get("headerAssetId") ?? "").trim();

  // Percentages from the drag handle. Anything outside 0-100 is a broken
  // client, not a user, so it clamps rather than errors.
  const focus = (name: string) => {
    const value = Number(formData.get(name));
    if (!Number.isFinite(value)) return 50;
    return Math.min(100, Math.max(0, Math.round(value)));
  };

  return {
    ok: true,
    value: {
      headline,
      body,
      rating,
      headerAssetId: headerAssetId.length > 0 ? headerAssetId : null,
      headerFocusX: focus("headerFocusX"),
      headerFocusY: focus("headerFocusY"),
    },
  };
}

export async function createSpotlightAction(
  _prev: SpotlightFormState,
  formData: FormData,
): Promise<SpotlightFormState> {
  await requireAdmin();

  const releaseId = String(formData.get("releaseId") ?? "").trim();
  if (!releaseId) return { error: "Choose a release to write about" };

  const parsed = readForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const id = await dal.createSpotlight({ releaseId, ...parsed.value });

  revalidatePath("/account/spotlight");
  revalidatePath("/spotlight");
  redirect(`/account/spotlight/${id}`);
}

export async function updateSpotlightAction(
  _prev: SpotlightFormState,
  formData: FormData,
): Promise<SpotlightFormState> {
  await requireAdmin();

  const id = String(formData.get("spotlightId") ?? "").trim();
  const existing = await dal.getSpotlight(id);
  if (!existing) return { error: "That article no longer exists" };

  const parsed = readForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await dal.updateSpotlight(id, {
    releaseId: existing.releaseId,
    ...parsed.value,
  });

  revalidatePath("/account/spotlight");
  revalidatePath(`/account/spotlight/${id}`);
  revalidatePath("/spotlight");
  revalidatePath(`/spotlight/${existing.slug}`);
  return {};
}

export async function togglePublishedAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("spotlightId"));
  await dal.setSpotlightPublished(id, formData.get("published") === "1");

  revalidatePath("/account/spotlight");
  revalidatePath(`/account/spotlight/${id}`);
  revalidatePath("/spotlight");
}

export async function deleteSpotlightAction(formData: FormData) {
  await requireAdmin();

  await dal.deleteSpotlight(String(formData.get("spotlightId")));

  revalidatePath("/account/spotlight");
  revalidatePath("/spotlight");
  redirect("/account/spotlight");
}

export async function skipReleaseAction(formData: FormData) {
  await requireAdmin();
  await dal.skipRelease(String(formData.get("releaseId")));
  revalidatePath("/account/spotlight/new");
}

export async function unskipReleaseAction(formData: FormData) {
  await requireAdmin();
  await dal.unskipRelease(String(formData.get("releaseId")));
  revalidatePath("/account/spotlight/new");
}
