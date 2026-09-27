import "server-only";
import { ImageResponse } from "next/og";
import { getEnv } from "@/lib/db";
import { getAnySpotlightImage, type getSpotlight } from "@/lib/dal/spotlight";
import { resolveOgImageDataUrl } from "@/lib/press/og-image";
import {
  buildSpotlightImageJsx,
  SPOTLIGHT_IMAGE_HEIGHT,
  SPOTLIGHT_IMAGE_VERSION,
  SPOTLIGHT_IMAGE_WIDTH,
} from "@/lib/press/spotlight-image";
import { slugify } from "@/lib/slug";
import { MAX_RATING } from "@/lib/spotlight/slug";

/**
 * The Spotlight share image (the Instagram post), drawn once and kept in R2.
 *
 * The stored copy is named after a fingerprint of everything it shows, so
 * editing the headline, rating, header photo or its crop makes a new one
 * (and the old copy is deleted), while an unchanged article is served
 * straight from storage. A layout change bumps SPOTLIGHT_IMAGE_VERSION.
 * Used by the image route and the LinkedIn carousel PDF.
 */

type Article = NonNullable<Awaited<ReturnType<typeof getSpotlight>>>;

const PREFIX = "spotlight-images";

async function fingerprint(parts: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(parts));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** "isse-nova-vita-album-aug-2026": release date, else when it went up. */
export function downloadName(article: {
  artistName: string;
  releaseTitle: string;
  releaseKind: string;
  releaseDate: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}) {
  const date = article.releaseDate
    ? new Date(`${article.releaseDate}T12:00:00Z`)
    : (article.publishedAt ?? article.createdAt);
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
    .format(date)
    .toLowerCase();
  return [
    slugify(article.artistName),
    slugify(article.releaseTitle),
    article.releaseKind,
    month,
    date.getUTCFullYear(),
  ]
    .filter(Boolean)
    .join("-");
}

async function render(article: Article) {
  const [header, cover] = await Promise.all([
    article.headerAssetId ? getAnySpotlightImage(article.headerAssetId) : null,
    article.coverAssetId ? getAnySpotlightImage(article.coverAssetId) : null,
  ]);

  const [headerUrl, coverUrl] = await Promise.all([
    header
      ? resolveOgImageDataUrl(header.r2Key, header.contentType, SPOTLIGHT_IMAGE_WIDTH)
      : null,
    cover ? resolveOgImageDataUrl(cover.r2Key, cover.contentType, 360) : null,
  ]);

  const png = await new ImageResponse(
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
  ).arrayBuffer();

  // JPEG for a photo is a fraction of the PNG's size. If the image service
  // is unavailable, keep the PNG rather than fail.
  const env = await getEnv();
  try {
    const jpeg = await env.IMAGES.input(new Response(png).body!)
      .output({ format: "image/jpeg", quality: 90 });
    return { bytes: await jpeg.response().arrayBuffer(), type: "image/jpeg", ext: "jpg" as const };
  } catch {
    return { bytes: png, type: "image/png", ext: "png" as const };
  }
}


export type ShareImage = { bytes: ArrayBuffer; type: string; ext: "jpg" | "png" };

/** The stored image for this article as it is now, made and stored if missing. */
export async function getShareImage(article: Article): Promise<ShareImage> {
  const env = await getEnv();
  const print = await fingerprint([
    SPOTLIGHT_IMAGE_VERSION,
    article.headerAssetId,
    article.headerFocusX,
    article.headerFocusY,
    article.coverAssetId,
    article.headline,
    article.rating,
  ]);
  const folder = `${PREFIX}/${article.id}/`;

  const stored =
    (await env.MEDIA.get(`${folder}${print}.jpg`)) ?? (await env.MEDIA.get(`${folder}${print}.png`));
  if (stored) {
    return {
      bytes: await stored.arrayBuffer(),
      type: stored.httpMetadata?.contentType ?? "image/jpeg",
      ext: stored.key.endsWith(".png") ? "png" : "jpg",
    };
  }

  const made = await render(article);
  const key = `${folder}${print}.${made.ext}`;
  await env.MEDIA.put(key, made.bytes, { httpMetadata: { contentType: made.type } });

  // Out with copies for content that has since changed.
  const old = await env.MEDIA.list({ prefix: folder });
  await Promise.all(
    old.objects.filter((object) => object.key !== key).map((object) => env.MEDIA.delete(object.key)),
  );
  return made;
}
