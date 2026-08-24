"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { createInvite, revokeInvite } from "@/lib/dal/musicians";

export type InviteFormState = {
  error?: string;
  link?: string;
  email?: string;
};

const emailSchema = z.object({ email: z.email("Enter a valid email address").trim() });

export async function createInviteAction(
  _prev: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  const account = await requireAdmin();

  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the email" };
  }

  const id = await createInvite(account.id, parsed.data.email);
  revalidatePath("/account/musicians");

  const { APP_URL } = await getEnv();
  return {
    link: `${APP_URL}/account/signup?invite=${id}`,
    email: parsed.data.email,
  };
}

export async function revokeInviteAction(formData: FormData) {
  const account = await requireAdmin();
  await revokeInvite(account.id, String(formData.get("inviteId")));
  revalidatePath("/account/musicians");
}
