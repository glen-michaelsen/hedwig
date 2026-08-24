"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuth } from "@/lib/auth";
import { acceptInvite, getOpenInvite } from "@/lib/dal/musicians";
import { joinWaitlist } from "@/lib/dal/waitlist";
import { isWaitlistFeature, type WaitlistFeature } from "@/lib/waitlist";

export type AuthFormState = { error?: string };

const signUpSchema = z.object({
  name: z.string().min(1, "Your name is required").trim(),
  studioName: z.string().trim().optional(),
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(10, "Use at least 10 characters"),
});

/**
 * Accounts are admin-only, by invite — see lib/dal/musicians.ts. The form
 * always carries the invite id it was loaded with; a submission without
 * one, or with one that's since expired or been used, can't create an
 * account at all. The email is locked to the invite's own on the client,
 * but re-checked here since the client can't be trusted to enforce that.
 */
export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const inviteId = String(formData.get("invite") ?? "");
  const invite = inviteId ? await getOpenInvite(inviteId) : null;
  if (!invite) {
    return { error: "That invite link isn't valid any more." };
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    studioName: formData.get("studioName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  if (parsed.data.email.toLowerCase() !== invite.email.toLowerCase()) {
    return { error: "This invite was sent to a different email address." };
  }

  const auth = await getAuth();
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        studioName: parsed.data.studioName || parsed.data.name,
      },
      headers: await headers(),
    });
    await acceptInvite(invite.id, result.user.id);
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.body?.message ?? "Could not create the account" };
    }
    throw error;
  }

  redirect("/account");
}

export type WaitlistFormState = { error?: string; done?: boolean };

const waitlistSchema = z.object({
  name: z.string().min(1, "Your name is required").trim(),
  email: z.email("Enter a valid email address").trim(),
  phone: z.string().trim().optional(),
});

export async function joinWaitlistAction(
  _prev: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  // Honeypot: a field no human sees, so anything in it came from a bot. It
  // gets the same success screen as everyone else — telling a script it was
  // caught only teaches it to stop filling the field in.
  if (String(formData.get("website") ?? "").trim()) return { done: true };

  const parsed = waitlistSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const features = formData
    .getAll("features")
    .map(String)
    .filter(isWaitlistFeature) as WaitlistFeature[];
  if (features.length === 0) {
    return { error: "Pick at least one thing you're interested in" };
  }

  // Cloudflare sets this on every request; it's absent only in local dev.
  const ip = (await headers()).get("cf-connecting-ip");

  const result = await joinWaitlist({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    features,
    ip,
  });

  if (!result.ok) {
    return { error: "That's a lot of attempts at once — try again in a bit." };
  }

  return { done: true };
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password" };

  // Only an in-app path is honoured. A full URL here would let a crafted
  // link send someone to another site with a fresh session in hand.
  const next = String(formData.get("next") ?? "");
  const destination =
    next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  const auth = await getAuth();
  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: "That email and password don't match" };
    }
    throw error;
  }

  redirect(destination);
}

export async function signOutAction() {
  const auth = await getAuth();
  await auth.api.signOut({ headers: await headers() });
  // The front page, not the login form: the form redirects signed-in
  // visitors to the dashboard, and the session cookie cache can still say
  // "signed in" for a few seconds after signing out.
  redirect("/");
}

export type SettingsFormState = { error?: string; success?: boolean };

const changeEmailSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
});

export async function changeEmailAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = changeEmailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const auth = await getAuth();
  try {
    await auth.api.changeEmail({
      body: { newEmail: parsed.data.email },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.body?.message ?? "Could not change the email" };
    }
    throw error;
  }

  revalidatePath("/account", "layout");
  return { success: true };
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z.string().min(10, "Use at least 10 characters"),
});

export async function changePasswordAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const auth = await getAuth();
  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      const message =
        error.body?.code === "INVALID_PASSWORD"
          ? "Current password is incorrect"
          : (error.body?.message ?? "Could not change the password");
      return { error: message };
    }
    throw error;
  }

  return { success: true };
}
