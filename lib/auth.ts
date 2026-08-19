import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import * as schema from "@/db/schema";
import { getDb, getEnv } from "./db";

/**
 * Built per request: the D1 binding comes from the request's Cloudflare
 * context, so a module-level singleton would capture a stale one.
 */
export async function getAuth() {
  const db = await getDb();
  const env = await getEnv();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.APP_URL,
    session: {
      // Musicians sign in occasionally, not daily — a week-long default
      // logs them out between visits. 90 days, rolling on each visit, keeps
      // them signed in as long as they keep coming back.
      expiresIn: 60 * 60 * 24 * 90,
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 10,
    },
    user: {
      changeEmail: {
        enabled: true,
        // There's no transactional email yet (see README), so a
        // verification link can't be sent — update in place instead.
        updateEmailWithoutVerification: true,
      },
      additionalFields: {
        studioName: { type: "string", required: false, input: true },
      },
    },
    plugins: [nextCookies()],
  });
}

/**
 * The signed-in musician. They may teach, release, gig, or all three —
 * "tutor" was only ever right while Studio was the whole product.
 */
export type Account = {
  id: string;
  name: string;
  email: string;
  /** Shown to students in the portal. Studio-specific. */
  studioName?: string | null;
};

export async function getAccount(): Promise<Account | null> {
  const auth = await getAuth();
  const result = await auth.api.getSession({ headers: await headers() });
  if (!result?.user) return null;
  const { id, name, email } = result.user;
  return {
    id,
    name,
    email,
    studioName: (result.user as { studioName?: string | null }).studioName,
  };
}

/** Use at the top of every signed-in page, action and route handler. */
export async function requireAccount(): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect("/account/login");
  return account;
}

/**
 * The person who runs Trenodo, as opposed to a musician using it.
 *
 * Held in an env var rather than a column on `user`: there is exactly one,
 * and a role column is a privilege that can be set by accident — through a
 * signup form, a seed script, or a migration written in a hurry. An env var
 * can only change by someone editing the Worker's configuration.
 */
export async function isAdmin(account: Account): Promise<boolean> {
  const env = await getEnv();
  const admin = env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin) && account.email.trim().toLowerCase() === admin;
}

/**
 * 404s rather than redirecting: a musician who guesses the URL shouldn't be
 * told that an admin area exists, only that this page doesn't.
 */
export async function requireAdmin(): Promise<Account> {
  const account = await requireAccount();
  if (!(await isAdmin(account))) notFound();
  return account;
}
