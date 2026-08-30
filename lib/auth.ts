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
      // Push the 90 days out again on any visit older than a day. Without
      // this the window is fixed from the sign-in, so a daily user is still
      // thrown out three months later for no reason they can see.
      updateAge: 60 * 60 * 24,
      // Five minutes of the session held in a signed cookie, so ordinary
      // navigation doesn't hit D1 for a row it just read.
      cookieCache: { enabled: true, maxAge: 60 * 5 },
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

/**
 * Nothing in the D1/session path below has a timeout of its own — a stalled
 * binding call (rare, but seen in production) would otherwise hang until
 * the platform force-kills the request, which reads as "the app is stuck"
 * on every page, since this runs on every signed-in render. Failing fast
 * here surfaces a normal error page instead — recoverable with a reload,
 * not an indefinite spinner.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Session check timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function getAccount(): Promise<Account | null> {
  const auth = await getAuth();
  const result = await withTimeout(
    auth.api.getSession({ headers: await headers() }),
    8000,
  );
  if (!result?.user) return null;
  const { id, name, email } = result.user;
  return {
    id,
    name,
    email,
    studioName: (result.user as { studioName?: string | null }).studioName,
  };
}

/**
 * Use at the top of every signed-in page, action and route handler.
 *
 * `returnTo` is where to send them after signing in. It has to be passed in:
 * a Server Component gets no header carrying the request path, and this app
 * has no middleware to add one — Next 16 made middleware Node-only, which
 * OpenNext can't bundle into a Worker.
 */
export async function requireAccount(returnTo?: string): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect(loginPath(returnTo));
  return account;
}

/** Only ever an in-app path — an absolute URL here would be an open redirect. */
export function loginPath(returnTo?: string): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/account/login";
  }
  return `/account/login?next=${encodeURIComponent(returnTo)}`;
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
export async function requireAdmin(returnTo?: string): Promise<Account> {
  const account = await requireAccount(returnTo);
  if (!(await isAdmin(account))) notFound();
  return account;
}
