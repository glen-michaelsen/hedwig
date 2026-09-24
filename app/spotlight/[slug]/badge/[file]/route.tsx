import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import {
  getPublicSpotlightImage,
  getPublishedSpotlight,
} from "@/lib/dal/spotlight";
import { loadBadgeFonts } from "@/lib/press/badge-font";
import { resolveOgImageDataUrl } from "@/lib/press/og-image";
import {
  badgeImageSize,
  badgeMonth,
  badgeText,
  buildBadgeJsx,
  isBadgeVariant,
  type BadgeData,
} from "@/lib/press/spotlight-badge";
import { MAX_RATING } from "@/lib/spotlight/slug";

/**
 * A "Featured on Trenodo" badge for one published article, as a PNG an
 * artist embeds on their own site: /spotlight/<slug>/badge/c-light.png.
 * Published articles only, so a draft can't be read through its badge.
 *
 * Cached for a day at the edge and in browsers. An edited rating shows up
 * on the artist's site within that day, which is fine for a badge.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/spotlight/[slug]/badge/[file]">,
) {
  const { slug, file } = await params;
  const variant = file.replace(/\.png$/, "");
  if (!file.endsWith(".png") || !isBadgeVariant(variant)) notFound();

  const article = await getPublishedSpotlight(slug);
  if (!article) notFound();

  const needsCover = variant.startsWith("c");
  const cover =
    needsCover && article.coverAssetId
      ? await getPublicSpotlightImage(article.coverAssetId)
      : null;
  const coverUrl = cover
    ? await resolveOgImageDataUrl(cover.r2Key, cover.contentType, 160)
    : null;

  const data: BadgeData = {
    title: article.releaseTitle,
    coverUrl,
    rating: article.rating,
    maxRating: MAX_RATING,
    month: badgeMonth(article.publishedAt ?? article.createdAt),
  };

  return new ImageResponse(buildBadgeJsx(variant, data), {
    ...badgeImageSize(variant),
    fonts: await loadBadgeFonts(badgeText(data)),
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
