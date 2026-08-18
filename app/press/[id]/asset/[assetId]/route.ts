import { getAccount } from "@/lib/auth";
import { getAsset } from "@/lib/dal/press";
import { getObject } from "@/lib/r2";
import { getImageVariant } from "@/lib/press/images";
import { isImageVariant, isResizableImage } from "@/lib/press/variants";

/**
 * Serves one press-kit file to the account that owns it. The R2 key never
 * reaches the browser and ownership is checked per request — the asset id
 * in the URL proves nothing on its own.
 *
 * `?download` forces a save dialog and is the *only* way to get the original
 * bytes of an image: on screen an image is always a resized copy, picked with
 * `?size=sm|md|lg`. Everything else — audio, documents — streams as uploaded.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/press/[id]/asset/[assetId]">,
) {
  const { assetId } = await params;

  const account = await getAccount();
  if (!account) return new Response("Not found", { status: 404 });

  const asset = await getAsset(account.id, assetId);
  if (!asset) return new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const wantsDownload = url.searchParams.has("download");

  if (!wantsDownload && isResizableImage(asset.contentType)) {
    const size = url.searchParams.get("size");
    const variant = await getImageVariant(
      asset.r2Key,
      isImageVariant(size) ? size : "lg",
    );

    if (variant) {
      return new Response(variant.body, {
        headers: {
          "content-type": "image/webp",
          "content-length": String(variant.size),
          // A variant is derived from bytes that never change, and a new
          // upload is a new asset id, so this URL's answer is final.
          "cache-control": "private, max-age=31536000, immutable",
          etag: variant.etag,
        },
      });
    }
    // No variant: fall through and serve the original rather than nothing.
  }

  const object = await getObject(asset.r2Key);
  if (!object) return new Response("Not found", { status: 404 });

  const filename = asset.filename.replace(/["\\]/g, "");

  return new Response(object.body, {
    headers: {
      "content-type": asset.contentType,
      "content-length": String(object.size),
      "content-disposition": `${
        wantsDownload ? "attachment" : "inline"
      }; filename="${filename}"`,
      "cache-control": "private, max-age=300",
      etag: object.httpEtag,
    },
  });
}
