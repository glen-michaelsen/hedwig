import { getPublicAsset } from "@/lib/dal/press";
import { ensureDimensions } from "@/lib/press/dimensions";

/**
 * The pixel size of one photo, measured on demand.
 *
 * One image per request, and only when a visitor opens that photo — the
 * earlier version measured every photo on a kit during the page render,
 * which pulled tens of megabytes through the Images binding in a single
 * invocation and took the Worker past its CPU limit.
 *
 * Photos uploaded from now on carry their dimensions already, so this only
 * ever runs for older ones, once each.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/kit/[slug]/asset/[assetId]/info">,
) {
  const { slug, assetId } = await params;

  const asset = await getPublicAsset(slug, assetId);
  if (!asset) return new Response("Not found", { status: 404 });

  const size = await ensureDimensions({
    id: asset.id,
    r2Key: asset.r2Key,
    contentType: asset.contentType,
    width: asset.width,
    height: asset.height,
  });

  return Response.json(
    { width: size?.width ?? null, height: size?.height ?? null },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
