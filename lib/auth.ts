import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { mcp } from "better-auth/plugins";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq, gt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import * as schema from "@/db/schema";
import { getDb, getEnv } from "./db";

/** How long a session lasts. Visits push it out again (see SESSION_REFRESH_SECONDS). */
const SESSION_SECONDS = 60 * 60 * 24 * 90;
/** How old a session's last refresh may be before a visit pushes its expiry out again. */
const SESSION_REFRESH_SECONDS = 60 * 60 * 24;

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
        oauthApplication: schema.oauthApplication,
        oauthAccessToken: schema.oauthAccessToken,
        oauthConsent: schema.oauthConsent,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.APP_URL,
    session: {
      // Musicians sign in occasionally, not daily — a week-long default
      // logs them out between visits. 90 days, rolling on each visit, keeps
      // them signed in as long as they keep coming back.
      expiresIn: SESSION_SECONDS,
      // Push the 90 days out again on any visit older than a day. Without
      // this the window is fixed from the sign-in, so a daily user is still
      // thrown out three months later for no reason they can see.
      updateAge: SESSION_REFRESH_SECONDS,
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
    plugins: [
      // OAuth for the admin MCP (/api/mcp), so Claude can connect to it.
      // Claude is sent to our own consent page (the discovery document in
      // app/.well-known says so), which only the admin can see. The
      // plugin's /mcp/authorize, which approves without asking, is closed
      // in app/api/auth/[...all]/route.ts.
      mcp({
        loginPage: "/account/login",
        resource: `${env.APP_URL}/api/mcp`,
        oidcConfig: {
          loginPage: "/account/login",
          requirePKCE: true,
          accessTokenExpiresIn: 60 * 60,
          // A connection stays usable for 30 days without being used.
          refreshTokenExpiresIn: 60 * 60 * 24 * 30,
        },
      }),
      // Must stay last.
      nextCookies(),
    ],
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
 * D1 reads have their own deadline and retry (lib/db.ts). This is the
 * backstop over the whole session check: a stall anywhere else would hang
 * until the platform force-kills the request, on every signed-in render.
 * Failing here instead shows the error page, which offers a retry.
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

/**
 * Better Auth's session cookie. Over https it carries the `__Secure-`
 * prefix, which only a secure origin can set, and then only that name
 * counts, as in Better Auth. Its value is `token.signature`, URL-encoded;
 * the signature is an HMAC-SHA256 of the token under BETTER_AUTH_SECRET,
 * in base64.
 */
function sessionCookieName(appUrl: string) {
  const name = "better-auth.session_token";
  return appUrl.startsWith("https://") ? `__Secure-${name}` : name;
}

function readCookie(header: string, name: string) {
  for (const part of header.split(";")) {
    const at = part.indexOf("=");
    if (at > 0 && part.slice(0, at).trim() === name) {
      return part.slice(at + 1).trim();
    }
  }
  return null;
}

/** The token inside a signed cookie value, or null unless the signature holds. */
async function verifiedToken(value: string, secret: string) {
  let decoded: string;
  let signature: Uint8Array<ArrayBuffer>;
  try {
    decoded = decodeURIComponent(value);
    const dot = decoded.lastIndexOf(".");
    if (dot < 1) return null;
    const encoded = decoded.slice(dot + 1);
    if (encoded.length !== 44 || !encoded.endsWith("=")) return null;
    signature = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    decoded = decoded.slice(0, dot);
  } catch {
    return null;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  // subtle.verify compares in constant time.
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(decoded),
  );
  return valid ? decoded : null;
}

/**
 * Who's signed in, read straight from the session table.
 *
 * Not through Better Auth's getSession: in production it sometimes never
 * answers, mostly while a click and its prefetches run side by side, and
 * the page fails at the timeout. A page needs only what this does: check
 * the cookie's signature, then find a live session for the token. Signing
 * in, up and out still go through Better Auth, which writes these rows.
 */
async function readSession(cookieHeader: string): Promise<Account | null> {
  const env = await getEnv();
  const name = sessionCookieName(env.APP_URL);
  const raw = readCookie(cookieHeader, name);
  if (!raw) return null;

  const token = await verifiedToken(raw, env.BETTER_AUTH_SECRET);
  if (!token) return null;

  const db = await getDb();
  const now = new Date();
  const row = await db
    .select({
      sessionId: schema.session.id,
      expiresAt: schema.session.expiresAt,
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      studioName: schema.user.studioName,
    })
    .from(schema.session)
    .innerJoin(schema.user, eq(schema.session.userId, schema.user.id))
    .where(and(eq(schema.session.token, token), gt(schema.session.expiresAt, now)))
    .get();
  if (!row) return null;

  // Keep a returning musician signed in, as Better Auth's updateAge does:
  // at most once a day, push the expiry out again. The page doesn't wait.
  const refreshFrom =
    row.expiresAt.getTime() - (SESSION_SECONDS - SESSION_REFRESH_SECONDS) * 1000;
  if (now.getTime() >= refreshFrom) {
    const { ctx } = await getCloudflareContext({ async: true });
    ctx.waitUntil(
      db
        .update(schema.session)
        .set({
          expiresAt: new Date(now.getTime() + SESSION_SECONDS * 1000),
          updatedAt: now,
        })
        .where(eq(schema.session.id, row.sessionId))
        .run()
        .catch((error) => console.warn("Session refresh failed:", error)),
    );
    // A cookie can only be rewritten from an action or a route handler. In
    // a page render this throws, and the browser keeps the one it has.
    try {
      // Next encodes the value again on the way out, so hand it decoded.
      (await cookies()).set(name, decodeURIComponent(raw), {
        httpOnly: true,
        secure: name.startsWith("__Secure-"),
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_SECONDS,
      });
    } catch {}
  }

  return { id: row.id, name: row.name, email: row.email, studioName: row.studioName };
}

/**
 * Once per request: the dashboard layout and the page under it both ask,
 * and so does every admin check. One answer serves them all.
 */
export const getAccount = cache(async (): Promise<Account | null> => {
  const cookieHeader = (await headers()).get("cookie") ?? "";
  // Room for lib/db.ts to give up on a stalled D1 read and try it again.
  return withTimeout(readSession(cookieHeader), 10_000);
});

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
