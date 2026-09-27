import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getEnv } from "@/lib/db";
import { getAnySpotlightImage, getSpotlight } from "@/lib/dal/spotlight";
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
 * The Instagram-post share image for one article: header photo, gradient,
 * cover art, headline and rating.
 *
 * Drawn once and kept in R2, not redrawn per request. The stored copy is
 * named after a fingerprint of everything it shows, so editing the
 * headline, rating, header photo or its crop makes a new one (and the old
 * copy is deleted), while an unchanged article is served straight from
 * storage. A layout change bumps SPOTLIGHT_IMAGE_VERSION, which changes
 * every fingerprint.
 *
 * `?download` saves it as artist-title-type-mon-year.jpg.
 *
 * The layout lives in lib/press/spotlight-image.tsx, so a local preview
 * (scripts/preview-spotlight-image.ts) exercises the exact same code.
 */

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
function downloadName(article: {
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

async function render(article: NonNullable<Awaited<ReturnType<typeof getSpotlight>>>) {
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
    return { bytes: await jpeg.response().arrayBuffer(), type: "image/jpeg", ext: "jpg" };
  } catch {
    return { bytes: png, type: "image/png", ext: "png" };
  }
}

export async function GET(
  request: Request,
  { params }: RouteContext<"/account/spotlight/[id]/image">,
) {
  const { id } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

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
  const folder = `${PREFIX}/${id}/`;

  // A stored copy for exactly this content, in either format.
  const stored = (await env.MEDIA.get(`${folder}${print}.jpg`)) ?? (await env.MEDIA.get(`${folder}${print}.png`));
  let body: ArrayBuffer | ReadableStream;
  let type: string;
  let ext: string;

  if (stored) {
    body = stored.body;
    type = stored.httpMetadata?.contentType ?? "image/jpeg";
    ext = stored.key.endsWith(".png") ? "png" : "jpg";
  } else {
    const made = await render(article);
    const key = `${folder}${print}.${made.ext}`;
    await env.MEDIA.put(key, made.bytes, { httpMetadata: { contentType: made.type } });

    // Out with copies for content that has since changed.
    const old = await env.MEDIA.list({ prefix: folder });
    await Promise.all(
      old.objects.filter((object) => object.key !== key).map((object) => env.MEDIA.delete(object.key)),
    );
    body = made.bytes;
    type = made.type;
    ext = made.ext;
  }

  const filename = `${downloadName(article)}.${ext}`;
  const download = new URL(request.url).searchParams.has("download");

  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      // Admin-only, and it changes whenever the article does.
      "Cache-Control": "private, no-store",
    },
  });
}
