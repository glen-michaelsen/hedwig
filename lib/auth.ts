import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 10,
    },
    user: {
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
