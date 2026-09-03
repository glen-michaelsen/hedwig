import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAnySpotlightImage, getSpotlight } from "@/lib/dal/spotlight";
import { resolveOgImageDataUrl } from "@/lib/press/og-image";
import {
  buildSpotlightImageJsx,
  SPOTLIGHT_IMAGE_HEIGHT,
  SPOTLIGHT_IMAGE_WIDTH,
} from "@/lib/press/spotlight-image";
import { MAX_RATING } from "@/lib/spotlight/slug";

/**
 * The Instagram-post share image for one article: header photo, gradient,
 * cover art, headline and rating. Regenerated on every request — this is a
 * low-traffic admin tool, not public, so the article changing under a
 * cached copy isn't a real concern worth the extra invalidation logic.
 *
 * The actual layout lives in lib/press/spotlight-image.tsx — this route
 * only resolves the data (article + images) and hands it over, so a local
 * preview (scripts/preview-spotlight-image.ts) exercises the exact same
 * rendering code.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/account/spotlight/[id]/image">,
) {
  const { id } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

  const [header, cover] = await Promise.all([
    article.headerAssetId
      ? getAnySpotlightImage(article.headerAssetId)
      : null,
    article.coverAssetId ? getAnySpotlightImage(article.coverAssetId) : null,
  ]);

  const [headerUrl, coverUrl] = await Promise.all([
    header
      ? resolveOgImageDataUrl(header.r2Key, header.contentType, SPOTLIGHT_IMAGE_WIDTH)
      : null,
    cover
      ? resolveOgImageDataUrl(cover.r2Key, cover.contentType, 360)
      : null,
  ]);

  return new ImageResponse(
    buildSpotlightImageJsx({
      headerUrl,
      coverUrl,
      headline: article.headline,
      rating: article.rating,
      maxRating: MAX_RATING,
      headerFocusX: article.headerFocusX,
      headerFocusY: article.headerFocusY,
    }),
    { width: SPOTLIGHT_IMAGE_WIDTH, height: SPOTLIGHT_IMAGE_HEIGHT },
  );
}
