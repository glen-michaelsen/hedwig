import { notFound } from "next/navigation";
import { getAnySpotlightImage, getSpotlightForAssets } from "@/lib/dal/spotlight";
import { getImageVariant } from "@/lib/press/images";
import { isResizableImage } from "@/lib/press/variants";

/**
 * The release cover, small, for the asset library's header. Its own route
 * because /spotlight/image only serves covers once the article is live,
 * and the library opens earlier (Planned).
 */
export async function GET(_request: Request, { params }: RouteContext<"/spotlight/assets/[id]/cover">) {
  const { id } = await params;
  const article = await getSpotlightForAssets(id);
  if (!article?.coverAssetId) notFound();

  const image = await getAnySpotlightImage(article.coverAssetId);
  const variant = image && isResizableImage(image.contentType) ? await getImageVariant(image.r2Key, "sm") : null;
  if (!variant) notFound();

  return new Response(variant.body, {
    headers: {
      "content-type": "image/webp",
      "content-length": String(variant.size),
      "cache-control": "public, max-age=3600",
      "x-robots-tag": "noindex",
    },
  });
}
