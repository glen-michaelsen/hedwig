"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuth } from "@/lib/auth";

export type AuthFormState = { error?: string };

const signUpSchema = z.object({
  name: z.string().min(1, "Your name is required").trim(),
  studioName: z.string().trim().optional(),
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(10, "Use at least 10 characters"),
});

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    studioName: formData.get("studioName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const auth = await getAuth();
  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        studioName: parsed.data.studioName || parsed.data.name,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.body?.message ?? "Could not create the account" };
    }
    throw error;
  }

  redirect("/account");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password" };

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

  redirect("/account");
}

export async function signOutAction() {
  const auth = await getAuth();
  await auth.api.signOut({ headers: await headers() });
  redirect("/account/login");
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
