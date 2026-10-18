import { notFound } from "next/navigation";
import { getSpotlightForAssets } from "@/lib/dal/spotlight";
import { assetResponse } from "@/lib/spotlight/asset-response";
import { downloadName } from "@/lib/spotlight/share-image";
import { getStoryImage } from "@/lib/spotlight/story-image";

/** One Instagram story, for the public asset library. Published articles only. */
export async function GET(
  request: Request,
  { params }: RouteContext<"/spotlight/assets/[id]/story/[slot]">,
) {
  const { id, slot } = await params;
  const article = await getSpotlightForAssets(id);
  if (!article) notFound();
  const image = await getStoryImage(article, slot);
  if (!image) notFound();
  return assetResponse(request, image, `${downloadName(article)}-story-${slot}`);
}
