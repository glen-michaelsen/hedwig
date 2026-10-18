import { getEnv } from "@/lib/db";
import { getAccessTokenUser } from "@/lib/dal/oauth";
import { discoveryHeaders } from "@/lib/mcp/http";
import { handleMcpBody } from "@/lib/mcp/server";

/**
 * The admin MCP. Claude connects here with a token from the OAuth flow
 * (/oauth/authorize); a token for anyone but the admin is refused, since
 * every tool reads across accounts.
 */

function unauthorized(appUrl: string, status: 401 | 403, message: string) {
  return Response.json(
    { jsonrpc: "2.0", id: null, error: { code: -32001, message } },
    {
      status,
      headers: {
        ...discoveryHeaders,
        "www-authenticate": `Bearer resource_metadata="${appUrl}/.well-known/oauth-protected-resource"${
          status === 403 ? ', error="insufficient_scope"' : ""
        }`,
      },
    },
  );
}

export async function POST(request: Request) {
  const env = await getEnv();
  const header = request.headers.get("authorization") ?? "";
  const token = header.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) return unauthorized(env.APP_URL, 401, "Sign in to connect.");

  const holder = await getAccessTokenUser(token);
  if (!holder) return unauthorized(env.APP_URL, 401, "That token has expired. Sign in again.");
  const admin = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!admin || holder.email.trim().toLowerCase() !== admin) {
    return unauthorized(env.APP_URL, 403, "Only the Trenodo admin can use this.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: discoveryHeaders },
    );
  }

  const response = await handleMcpBody(body, { appUrl: env.APP_URL, adminId: holder.id });
  for (const [key, value] of Object.entries(discoveryHeaders)) response.headers.set(key, value);
  return response;
}

/** No server-to-client stream: every answer comes back on its POST. */
export function GET() {
  return new Response("Method not allowed", { status: 405, headers: { allow: "POST", ...discoveryHeaders } });
}

export function DELETE() {
  return new Response("Method not allowed", { status: 405, headers: { allow: "POST", ...discoveryHeaders } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: discoveryHeaders });
}
