import "server-only";
import { and, desc, eq, gt } from "drizzle-orm";
import { oauthAccessToken, oauthApplication, user } from "@/db/schema";
import { getDb } from "@/lib/db";

/**
 * Apps connected to the admin MCP, and the tokens they hold. The tokens
 * are written by Better Auth's mcp plugin; this file only reads them,
 * checks them, and deletes them when the admin disconnects an app.
 */

/** A registered app, if `redirectUri` is one of the addresses it registered. */
export async function getOAuthClient(clientId: string, redirectUri: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      clientId: oauthApplication.clientId,
      name: oauthApplication.name,
      redirectUrls: oauthApplication.redirectUrls,
      disabled: oauthApplication.disabled,
    })
    .from(oauthApplication)
    .where(eq(oauthApplication.clientId, clientId))
    .limit(1);
  if (!row || row.disabled) return null;
  const allowed = row.redirectUrls.split(",").map((url) => url.trim());
  if (!allowed.includes(redirectUri)) return null;
  return { clientId: row.clientId, name: row.name, redirectUri };
}

/** Who an MCP request is from: the user behind a live access token. */
export async function getAccessTokenUser(accessToken: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(oauthAccessToken)
    .innerJoin(user, eq(user.id, oauthAccessToken.userId))
    .where(
      and(
        eq(oauthAccessToken.accessToken, accessToken),
        gt(oauthAccessToken.accessTokenExpiresAt, new Date()),
      ),
    )
    .limit(1);
  return row ?? null;
}

/** One row per connected app for this account, with when it last got a token. */
export async function listConnections(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({
      clientId: oauthApplication.clientId,
      name: oauthApplication.name,
      redirectUrls: oauthApplication.redirectUrls,
      tokenAt: oauthAccessToken.updatedAt,
      refreshUntil: oauthAccessToken.refreshTokenExpiresAt,
    })
    .from(oauthAccessToken)
    .innerJoin(oauthApplication, eq(oauthApplication.clientId, oauthAccessToken.clientId))
    .where(
      and(
        eq(oauthAccessToken.userId, userId),
        gt(oauthAccessToken.refreshTokenExpiresAt, new Date()),
      ),
    )
    .orderBy(desc(oauthAccessToken.updatedAt));

  const byClient = new Map<string, (typeof rows)[number]>();
  for (const row of rows) if (!byClient.has(row.clientId)) byClient.set(row.clientId, row);
  return [...byClient.values()].map((row) => ({
    clientId: row.clientId,
    name: row.name,
    host: hostOf(row.redirectUrls.split(",")[0] ?? ""),
    lastUsed: row.tokenAt,
  }));
}

/** Disconnects an app: every token it holds for this account stops working at once. */
export async function revokeConnection(userId: string, clientId: string) {
  const db = await getDb();
  await db
    .delete(oauthAccessToken)
    .where(and(eq(oauthAccessToken.userId, userId), eq(oauthAccessToken.clientId, clientId)));
}

export function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
