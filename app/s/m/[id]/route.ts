import { getReadableMaterial } from "@/lib/dal/student";
import { getObject } from "@/lib/r2";
import { getStudentSession } from "@/lib/student-session";

/**
 * The only path from a student to a file. R2 keys are never sent to the
 * browser — the object is streamed back through the Worker after
 * getReadableMaterial() confirms the file is on this student's shelf or
 * attached to one of their shared lesson notes.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/s/m/[id]">,
) {
  const { id } = await params;

  const student = await getStudentSession();
  if (!student) return new Response("Not found", { status: 404 });

  const material = await getReadableMaterial(student.id, id);
  if (!material) return new Response("Not found", { status: 404 });

  if (material.kind !== "pdf" || !material.r2Key) {
    if (material.url) return Response.redirect(material.url, 302);
    return new Response("Not found", { status: 404 });
  }

  const object = await getObject(material.r2Key);
  if (!object) return new Response("Not found", { status: 404 });

  const filename = material.title.replace(/["\\]/g, "") || "material";

  return new Response(object.body, {
    headers: {
      "content-type":
        object.httpMetadata?.contentType ?? "application/pdf",
      "content-length": String(object.size),
      "content-disposition": `inline; filename="${filename}.pdf"`,
      // Private to this student's browser; never a shared cache.
      "cache-control": "private, max-age=300",
      etag: object.httpEtag,
    },
  });
}
