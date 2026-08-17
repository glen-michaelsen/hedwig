"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { submitIdea, type IdeaArea } from "@/lib/dal/ideas";

export type IdeaFormState = { error?: string; done?: boolean };

const AREAS: readonly IdeaArea[] = ["platform", "link-in-bio", "tutor"];

/** Trimmed, and empty means "not given" rather than "". */
function optional(value: FormDataEntryValue | null, max: number) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return text.slice(0, max);
}

export async function submitIdeaAction(
  _prev: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  // Honeypot: a field no human sees, so anything in it came from a bot.
  // It gets the same success screen as everyone else — telling a script it
  // was caught only teaches it to stop filling the field in.
  if (String(formData.get("website") ?? "").trim()) return { done: true };

  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 4) {
    return { error: "Give the idea a title — a few words is plenty." };
  }
  if (title.length > 120) {
    return { error: "That title is a little long. Keep it under 120 characters." };
  }

  const email = optional(formData.get("email"), 200);
  if (email && !z.email().safeParse(email).success) {
    return { error: "That email doesn't look right." };
  }

  const rawArea = String(formData.get("area") ?? "platform") as IdeaArea;
  const area = AREAS.includes(rawArea) ? rawArea : "platform";

  // Cloudflare sets this on every request; it's absent only in local dev.
  const ip = (await headers()).get("cf-connecting-ip");

  const result = await submitIdea({
    title,
    detail: optional(formData.get("detail"), 2000),
    name: optional(formData.get("name"), 80),
    email,
    area,
    ip,
  });

  if (!result.ok) {
    return {
      error: "That's a few ideas in a short time — try again in a little while.",
    };
  }

  return { done: true };
}
