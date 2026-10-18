import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSpotlight } from "@/lib/dal/spotlight";
import { contentDisposition } from "@/lib/r2";
import { downloadName } from "@/lib/spotlight/share-image";
import { getStoryImage } from "@/lib/spotlight/story-image";

/**
 * One Instagram story for an article ("post", "quote-card-2", …), from
 * storage (lib/spotlight/story-image.ts). `?download` saves it as
 * artist-title-type-mon-year-story-<slot>.jpg.
 */
export async function GET(
  request: Request,
  { params }: RouteContext<"/account/spotlight/[id]/story/[slot]">,
) {
  const { id, slot } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

  const image = await getStoryImage(article, slot);
  if (!image) notFound();

  const download = new URL(request.url).searchParams.has("download");
  return new Response(image.bytes, {
    headers: {
      "Content-Type": image.type,
      "Content-Disposition": contentDisposition(
        download ? "attachment" : "inline",
        `${downloadName(article)}-story-${slot}.${image.ext}`,
      ),
      // Admin-only, and it changes whenever the article does.
      "Cache-Control": "private, no-store",
    },
  });
}
