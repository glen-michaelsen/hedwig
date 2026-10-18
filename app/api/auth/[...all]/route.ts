import { getAuth } from "@/lib/auth";

/**
 * The mcp plugin's own authorize endpoint hands a code to whichever app
 * asks, as long as someone is signed in, and any app can register itself.
 * So a link clicked while signed in could connect a stranger's app. These
 * are closed: authorization goes through /oauth/authorize, which asks the
 * admin first and calls the plugin from the server.
 */
const CLOSED = ["/mcp/authorize", "/oauth2/authorize", "/oauth2/consent"];

/** The path as a router might read it: decoded, lower case, single slashes, no trailing one. */
function normalise(pathname: string) {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {}
  return path.toLowerCase().replace(/\/+/g, "/").replace(/\/$/, "");
}

async function handler(request: Request) {
  const path = normalise(new URL(request.url).pathname);
  if (CLOSED.some((closed) => path.endsWith(closed))) {
    return new Response("Not found", { status: 404 });
  }
  const auth = await getAuth();
  return auth.handler(request);
}

export { handler as GET, handler as POST };
