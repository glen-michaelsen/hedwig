import { isPublicKey, PUBLIC_PREFIX } from "@/lib/bio/r2-public";
import { getObject } from "@/lib/r2";

/**
 * Public image delivery for bio pages. Deliberately narrow: it will only
 * ever serve keys under `public/`, so the same bucket can keep holding
 * sheet music that requires an ownership check at /s/m/[id].
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/i/[...key]">,
) {
  const { key } = await params;
  const objectKey = PUBLIC_PREFIX + (Array.isArray(key) ? key.join("/") : key);

  if (!isPublicKey(objectKey)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getObject(objectKey);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "image/jpeg",
      "content-length": String(object.size),
      // Immutable: keys carry a uuid, so a changed image is a new URL.
      "cache-control": "public, max-age=31536000, immutable",
      etag: object.httpEtag,
    },
  });
}
