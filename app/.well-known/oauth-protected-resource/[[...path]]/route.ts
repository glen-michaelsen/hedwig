import { getAuth } from "@/lib/auth";
import { discoveryHeaders } from "@/lib/mcp/http";

/** Tells Claude that /api/mcp is signed in to through this site. */
export async function GET(request: Request) {
  const auth = await getAuth();
  const metadata = await auth.api.getMCPProtectedResource({ request, asResponse: false });
  return Response.json(metadata, { headers: discoveryHeaders });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: discoveryHeaders });
}
