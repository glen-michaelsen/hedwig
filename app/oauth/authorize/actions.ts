"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth, requireAdmin } from "@/lib/auth";
import { getOAuthClient } from "@/lib/dal/oauth";
import { getEnv } from "@/lib/db";
import { pickParams } from "./params";

async function checkedRequest(formData: FormData) {
  await requireAdmin();
  const params = pickParams((key) => formData.get(key));
  const client =
    params.client_id && params.redirect_uri
      ? await getOAuthClient(params.client_id, params.redirect_uri)
      : null;
  if (!client) throw new Error("Unknown app or address");
  return { params, client };
}

/**
 * The admin allowed it: ask the mcp plugin for a code, from the server,
 * and send the browser back to the app with it. `prompt` never passes,
 * so the plugin can't route to a consent screen of its own.
 */
export async function allowAction(formData: FormData) {
  const { params, client } = await checkedRequest(formData);
  const [auth, env, requestHeaders] = await Promise.all([getAuth(), getEnv(), headers()]);
  // The plugin wants the request it would have been sent, not just headers.
  const url = new URL(`${env.APP_URL}/api/auth/mcp/authorize`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await auth.api.mcpOAuthAuthorize({
    query: params,
    headers: requestHeaders,
    request: new Request(url, { headers: requestHeaders }),
    asResponse: true,
  });
  const location = response.headers.get("location") ?? "";
  // The plugin only ever answers with the registered address; anything
  // else is an error page we'd rather not forward to.
  if (!location.startsWith(client.redirectUri)) {
    throw new Error(`Authorization failed (${response.status})`);
  }
  redirect(location);
}

/** The admin said no: tell the app, the way OAuth does. */
export async function denyAction(formData: FormData) {
  const { params, client } = await checkedRequest(formData);
  const back = new URL(client.redirectUri);
  back.searchParams.set("error", "access_denied");
  if (params.state) back.searchParams.set("state", params.state);
  redirect(back.toString());
}
