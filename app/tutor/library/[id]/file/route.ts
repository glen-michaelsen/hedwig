import { getAccount } from "@/lib/auth";
import { getMaterial } from "@/lib/dal/tutor";
import { getObject } from "@/lib/r2";

/**
 * Serves a tutor their own PDF. Mirrors the student route at /s/m/[id]:
 * the R2 key never reaches the browser, and ownership is checked on every
 * request rather than trusted from the URL.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/tutor/library/[id]/file">,
) {
  const { id } = await params;

  const tutor = await getAccount();
  if (!tutor) return new Response("Not found", { status: 404 });

  const material = await getMaterial(tutor.id, id);
  if (!material || material.kind !== "pdf" || !material.r2Key) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getObject(material.r2Key);
  if (!object) return new Response("Not found", { status: 404 });

  const filename = material.title.replace(/["\\]/g, "") || "material";

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/pdf",
      "content-length": String(object.size),
      "content-disposition": `inline; filename="${filename}.pdf"`,
      "cache-control": "private, max-age=300",
      etag: object.httpEtag,
    },
  });
}
