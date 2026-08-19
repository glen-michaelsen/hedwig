import { getPublicAsset } from "@/lib/dal/press";
import { getImageVariant } from "@/lib/press/images";
import { isImageVariant, isResizableImage } from "@/lib/press/variants";
import { objectResponse } from "@/lib/r2";

/**
 * Files on a published press kit, for anyone with the link.
 *
 * The slug is part of the lookup, not decoration: an asset id alone proves
 * nothing, and the join refuses anything whose release isn't published — so
 * unpublishing closes every file at the same moment it closes the page.
 *
 * Audio and documents go through objectResponse, which honours Range
 * requests. That is what lets a journalist scrub through a track instead of
 * waiting for a 60 MB download to finish first.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/kit/[slug]/asset/[assetId]">,
) {
  const { slug, assetId } = await params;

  const asset = await getPublicAsset(slug, assetId);
  if (!asset) return new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const wantsDownload = url.searchParams.has("download");

  // On screen an image is a resized copy; the original is only ever handed
  // over as a download, same rule as the private press kit.
  if (!wantsDownload && isResizableImage(asset.contentType)) {
    const size = url.searchParams.get("size");
    const variant = await getImageVariant(
      asset.r2Key,
      isImageVariant(size) ? size : "md",
    );

    if (variant) {
      return new Response(variant.body, {
        headers: {
          "content-type": "image/webp",
          "content-length": String(variant.size),
          "cache-control": "public, max-age=31536000, immutable",
          etag: variant.etag,
        },
      });
    }
  }

  const response = await objectResponse(asset.r2Key, request, {
    contentType: asset.contentType,
    filename: asset.filename,
    download: wantsDownload,
    // Public, but short: unpublishing has to take effect quickly, and a CDN
    // holding a track for a year would outlive the decision to share it.
    cacheControl: "public, max-age=300",
  });

  return response ?? new Response("Not found", { status: 404 });
}
