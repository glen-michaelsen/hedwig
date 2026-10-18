import { notFound } from "next/navigation";
import { getSpotlightForAssets } from "@/lib/dal/spotlight";
import { assetResponse } from "@/lib/spotlight/asset-response";
import { downloadName, getShareImage } from "@/lib/spotlight/share-image";

/** The Instagram post image, for the public asset library. Published articles only. */
export async function GET(request: Request, { params }: RouteContext<"/spotlight/assets/[id]/post">) {
  const { id } = await params;
  const article = await getSpotlightForAssets(id);
  if (!article) notFound();
  const image = await getShareImage(article);
  return assetResponse(request, image, downloadName(article));
}
