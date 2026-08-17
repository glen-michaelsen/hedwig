import { getAccount } from "@/lib/auth";
import { getAsset } from "@/lib/dal/press";
import { getObject } from "@/lib/r2";

/**
 * Serves one press-kit file to the account that owns it. The R2 key never
 * reaches the browser and ownership is checked per request — the asset id
 * in the URL proves nothing on its own.
 *
 * `?download` forces a save dialog; without it images and audio render in
 * place, which is what the page itself wants.
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

  const object = await getObject(asset.r2Key);
  if (!object) return new Response("Not found", { status: 404 });

  const wantsDownload = new URL(request.url).searchParams.has("download");
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
