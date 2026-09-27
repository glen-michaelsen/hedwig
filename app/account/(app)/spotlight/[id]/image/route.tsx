import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSpotlight } from "@/lib/dal/spotlight";
import { downloadName, getShareImage } from "@/lib/spotlight/share-image";

/**
 * The Instagram-post share image for one article, from storage (made once,
 * see lib/spotlight/share-image.ts). `?download` saves it as
 * artist-title-type-mon-year.jpg.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/account/spotlight/[id]/image">,
) {
  const { id } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

  const image = await getShareImage(article);
  const filename = `${downloadName(article)}.${image.ext}`;
  const download = new URL(request.url).searchParams.has("download");

  return new Response(image.bytes, {
    headers: {
      "Content-Type": image.type,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      // Admin-only, and it changes whenever the article does.
      "Cache-Control": "private, no-store",
    },
  });
}
