import { timingSafeEqual } from "@/lib/crypto";
import { getEnv } from "@/lib/db";
import { sendDueSpotlightEmails } from "@/lib/spotlight/notify";

/**
 * Sends the "your Spotlight is live" emails for planned articles whose
 * release day has come. Called every hour by the scheduled handler in
 * cloudflare-worker.mjs, in-process, never over the network.
 *
 * The caller proves itself with BETTER_AUTH_SECRET, which only the Worker
 * has. Anyone else gets a plain 404, as if the route didn't exist. Even a
 * leaked call could only send emails that are due anyway, once each.
 */
export async function POST(request: Request) {
  const { BETTER_AUTH_SECRET } = await getEnv();
  const given = request.headers.get("x-cron-secret") ?? "";

  if (!BETTER_AUTH_SECRET || !timingSafeEqual(given, BETTER_AUTH_SECRET)) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(await sendDueSpotlightEmails());
}
