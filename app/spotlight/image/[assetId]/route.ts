import { getAccount, isAdmin } from "@/lib/auth";
import {
  getAnySpotlightImage,
  getPublicSpotlightImage,
} from "@/lib/dal/spotlight";
import { getImageVariant } from "@/lib/press/images";
import { isImageVariant, isResizableImage } from "@/lib/press/variants";
import { getObject } from "@/lib/r2";

/**
 * Images for Spotlight articles.
 *
 * A press kit is private, so this is not a window onto it: for a public
 * reader it answers only for the cover and the chosen header photo of a
 * *published* article, and nothing else on the release. The admin, who can
 * already see every press kit, also gets unpublished ones so drafts preview
 * properly.
 *
 * Only resized copies are served. The original is the archive copy and stays
 * behind the press kit's own authorised route.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/spotlight/image/[assetId]">,
) {
  const { assetId } = await params;

  let image = await getPublicSpotlightImage(assetId);

  if (!image) {
    const account = await getAccount();
    if (account && (await isAdmin(account))) {
      image = await getAnySpotlightImage(assetId);
    }
  }

  if (!image) return new Response("Not found", { status: 404 });

  const size = new URL(request.url).searchParams.get("size");

  if (isResizableImage(image.contentType)) {
    const variant = await getImageVariant(
      image.r2Key,
      isImageVariant(size) ? size : "md",
    );

    if (variant) {
      return new Response(variant.body, {
        headers: {
          "content-type": "image/webp",
          "content-length": String(variant.size),
          // Derived from bytes that never change, at a URL that is a new id
          // whenever the file is.
          "cache-control": "public, max-age=31536000, immutable",
          etag: variant.etag,
        },
      });
    }
  }

  const object = await getObject(image.r2Key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": image.contentType,
      "content-length": String(object.size),
      "cache-control": "public, max-age=3600",
      etag: object.httpEtag,
    },
  });
}
