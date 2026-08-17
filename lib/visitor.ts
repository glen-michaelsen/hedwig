import "server-only";
import { cookies } from "next/headers";
import { newId } from "./crypto";

/**
 * An anonymous per-browser id, used only to keep the same visitor from
 * voting twice on an idea.
 *
 * It is not an identity and is never joined to an account: a random opaque
 * value, set on the first vote and on no other page view, so a reader who
 * never presses anything is never given a cookie at all.
 */
const COOKIE = "trenodo_vid";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The id this browser already has, if any. Safe to call while rendering. */
export async function getVoterKey(): Promise<string | null> {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

/**
 * The id, issuing one if needed. Writes a cookie, so this only works from a
 * server action or route handler — calling it while rendering a page throws.
 */
export async function ensureVoterKey(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing) return existing;

  const value = newId();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return value;
}
