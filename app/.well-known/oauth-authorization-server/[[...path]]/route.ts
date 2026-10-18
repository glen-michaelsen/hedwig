import { getAuth } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { discoveryHeaders } from "@/lib/mcp/http";

/**
 * Where Claude learns how to sign in to the admin MCP. The plugin's
 * document, except that authorization starts at our consent page rather
 * than at the plugin's endpoint, which approves without asking. Answers
 * with or without a path suffix (/.well-known/oauth-authorization-server/api/mcp),
 * as clients try both.
 */
export async function GET(request: Request) {
  const [auth, env] = await Promise.all([getAuth(), getEnv()]);
  const metadata = await auth.api.getMcpOAuthConfig({ request, asResponse: false });
  return Response.json(
    { ...metadata, authorization_endpoint: `${env.APP_URL}/oauth/authorize` },
    { headers: discoveryHeaders },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: discoveryHeaders });
}
