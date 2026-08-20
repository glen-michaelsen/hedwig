import { getPublicRelease } from "@/lib/dal/press";
import { recordKitEvent, type KitEventKind } from "@/lib/dal/kit-stats";
import { todayIso } from "@/lib/clock";
import { isProbablyBot } from "@/lib/press/bots";

const KINDS = new Set<KitEventKind>(["play", "download", "photo", "link"]);

/**
 * Events the browser has to report, because they aren't page loads: a track
 * started, a photo opened, an outbound link followed.
 *
 * Unauthenticated by necessity — the visitors are the point — so it only
 * ever increments a counter on a published release, and nothing here can
 * read anything back.
 */
export async function POST(
  request: Request,
  { params }: RouteContext<"/kit/[slug]/event"> ,
) {
  const { slug } = await params;

  if (isProbablyBot(request.headers.get("user-agent"))) {
    return new Response(null, { status: 204 });
  }

  const release = await getPublicRelease(slug);
  if (!release) return new Response(null, { status: 204 });

  let body: { kind?: string; assetId?: string };
  try {
    body = (await request.json()) as { kind?: string; assetId?: string };
  } catch {
    return new Response(null, { status: 204 });
  }

  const kind = String(body.kind ?? "") as KitEventKind;
  if (!KINDS.has(kind)) return new Response(null, { status: 204 });

  await recordKitEvent({
    releaseId: release.id,
    kind,
    assetId: typeof body.assetId === "string" ? body.assetId : null,
    day: await todayIso(),
  });

  return new Response(null, { status: 204 });
}
