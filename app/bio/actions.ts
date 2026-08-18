"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAccount } from "@/lib/auth";
import { parseBlockConfig } from "@/lib/bio/blocks";
import { checkHandle } from "@/lib/bio/handles";
import {
  deletePublicImage,
  putPublicImage,
} from "@/lib/bio/r2-public";
import { parseHex } from "@/lib/bio/theme";
import * as dal from "@/lib/dal/bio";
import * as press from "@/lib/dal/press";
import { detectMusicProvider } from "@/lib/embed";
import { detectProvider } from "@/lib/embed";

export type ActionResult = { error?: string } | void;

function nullable(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function revalidateBio(handle?: string) {
  revalidatePath("/bio");
  if (handle) revalidatePath(`/@${handle}`);
}

/* -------------------------------- the page ----------------------------- */

export type ClaimState = { error?: string };

export async function claimHandleAction(
  _prev: ClaimState,
  formData: FormData,
): Promise<ClaimState> {
  const account = await requireAccount();

  const existing = await dal.getPageForAccount(account.id);
  if (existing) return { error: "You already have a page." };

  const check = checkHandle(String(formData.get("handle") ?? ""));
  if (!check.ok) return { error: check.error };

  if (await dal.handleTaken(check.handle)) {
    return { error: "That handle is taken." };
  }

  const title = String(formData.get("title") ?? "").trim() || account.name;
  await dal.createPage(account.id, { handle: check.handle, title });

  revalidateBio(check.handle);
  return {};
}

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return { error: "No page yet." };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "A name is required." };

  // Handle changes leave a redirect behind rather than breaking old links.
  const check = checkHandle(String(formData.get("handle") ?? ""));
  if (!check.ok) return { error: check.error };

  if (check.handle !== page.handle) {
    if (await dal.handleTaken(check.handle, page.id)) {
      return { error: "That handle is taken." };
    }
    await dal.changeHandle(account.id, page.id, page.handle, check.handle);
  }

  let avatarKey = page.avatarKey;
  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    try {
      avatarKey = await putPublicImage(account.id, avatar);
    } catch (error) {
      return { error: (error as Error).message };
    }
    await deletePublicImage(page.avatarKey);
  }

  await dal.updatePage(account.id, {
    title,
    tagline: nullable(formData.get("tagline")),
    avatarKey,
  });

  revalidateBio(check.handle);
}

export async function updateAppearanceAction(
  formData: FormData,
): Promise<ActionResult> {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return { error: "No page yet." };

  const accentRaw = nullable(formData.get("accentColor"));
  if (accentRaw && !parseHex(accentRaw)) {
    return { error: "That accent colour isn't a valid hex value." };
  }

  const kind = String(formData.get("backgroundKind") ?? "preset");
  if (!["preset", "solid", "gradient", "image"].includes(kind)) {
    return { error: "Pick a background type." };
  }

  let backgroundValue = page.backgroundValue;

  if (kind === "solid" || kind === "gradient") {
    const colour = nullable(formData.get("backgroundColor"));
    if (!colour || !parseHex(colour)) {
      return { error: "That background colour isn't a valid hex value." };
    }
    backgroundValue = colour;
  } else if (kind === "image") {
    const image = formData.get("backgroundImage");
    if (image instanceof File && image.size > 0) {
      try {
        backgroundValue = await putPublicImage(account.id, image);
      } catch (error) {
        return { error: (error as Error).message };
      }
    } else if (!page.backgroundValue) {
      return { error: "Choose a background image." };
    }
  } else {
    backgroundValue = null;
  }

  await dal.updatePage(account.id, {
    themePreset: String(formData.get("themePreset") ?? "midnight"),
    accentColor: accentRaw,
    backgroundKind: kind as "preset",
    backgroundValue,
    showCredit: formData.get("showCredit") === "on",
  });

  revalidateBio(page.handle);
}

/** Bound directly to a form, so it returns nothing. */
export async function setPublishedAction(formData: FormData) {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return;

  await dal.updatePage(account.id, {
    published: formData.get("published") === "true",
  });

  revalidateBio(page.handle);
}

/* --------------------------------- blocks ------------------------------ */

/** Builds the config for a kind out of the submitted fields. */
function configFromForm(kind: string, formData: FormData) {
  if (kind === "link") {
    return {
      label: String(formData.get("label") ?? "").trim(),
      url: String(formData.get("url") ?? "").trim(),
      description: nullable(formData.get("description")),
    };
  }
  if (kind === "text") {
    return {
      variant: String(formData.get("variant") ?? "paragraph"),
      value: nullable(formData.get("value")),
    };
  }
  if (kind === "player") {
    const url = String(formData.get("url") ?? "").trim();
    return { url, provider: detectMusicProvider(url) };
  }
  if (kind === "video") {
    const url = String(formData.get("url") ?? "").trim();
    return { url, provider: detectProvider(url) };
  }
  if (kind === "release") {
    return { releaseId: String(formData.get("releaseId") ?? "").trim() };
  }
  return null;
}

export async function saveBlockAction(
  formData: FormData,
): Promise<ActionResult> {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return { error: "No page yet." };

  const kind = String(formData.get("kind") ?? "");
  const blockId = nullable(formData.get("blockId"));

  const raw = configFromForm(kind, formData);
  if (!raw) return { error: "Unknown block type." };

  const config = parseBlockConfig(kind, raw);
  if (!config) {
    return {
      error:
        kind === "text"
          ? "Add some text for this block."
          : kind === "release"
            ? "Choose a release for this block."
            : "Check the link — it needs to be a full URL including https://",
    };
  }

  // A release block links to the account's own press kit. Re-fetch the release
  // scoped by account so a tampered form can't point at someone else's, and
  // refuse one with no smart link — there'd be nothing for fans to follow.
  if (kind === "release" && "releaseId" in config) {
    const release = await press.getRelease(account.id, config.releaseId);
    if (!release) return { error: "Choose a release for this block." };
    if (!release.url) {
      return { error: "That release has no link yet. Add one in your press kit first." };
    }
  }

  if (blockId) {
    await dal.updateBlock(account.id, blockId, config);
  } else {
    await dal.addBlock(account.id, kind, config);
  }

  revalidateBio(page.handle);
}

/** Called with the full order after a drag. */
export async function reorderBlocksAction(orderedIds: string[]) {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return;

  await dal.setBlockOrder(account.id, orderedIds);
  revalidateBio(page.handle);
}

export async function moveBlockAction(formData: FormData) {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return;

  await dal.moveBlock(
    account.id,
    String(formData.get("blockId")),
    formData.get("direction") === "up" ? -1 : 1,
  );
  revalidateBio(page.handle);
}

export async function toggleBlockAction(formData: FormData) {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return;

  await dal.setBlockVisible(
    account.id,
    String(formData.get("blockId")),
    formData.get("visible") === "true",
  );
  revalidateBio(page.handle);
}

export async function deleteBlockAction(formData: FormData) {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return;

  await dal.deleteBlock(account.id, String(formData.get("blockId")));
  revalidateBio(page.handle);
}

/* -------------------------------- socials ------------------------------ */

const socialSchema = z.object({ platform: z.string().min(1), url: z.url() });

export async function saveSocialsAction(
  formData: FormData,
): Promise<ActionResult> {
  const account = await requireAccount();
  const page = await dal.getPageForAccount(account.id);
  if (!page) return { error: "No page yet." };

  const platforms = formData.getAll("platform").map(String);
  const urls = formData.getAll("socialUrl").map(String);

  const socials = [];
  for (const [index, platform] of platforms.entries()) {
    const url = (urls[index] ?? "").trim();
    if (!url) continue;
    const parsed = socialSchema.safeParse({ platform, url });
    if (!parsed.success) {
      return { error: `Check the ${platform} link — it needs a full URL.` };
    }
    socials.push(parsed.data);
  }

  await dal.replaceSocials(account.id, socials);
  revalidateBio(page.handle);
}
