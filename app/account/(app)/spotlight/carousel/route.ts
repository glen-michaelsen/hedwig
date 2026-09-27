import { requireAdmin } from "@/lib/auth";
import { todayIso } from "@/lib/clock";
import { getEnv } from "@/lib/db";
import { getSpotlight, listRecentLiveSpotlightIds } from "@/lib/dal/spotlight";
import { jpegPagesToPdf } from "@/lib/pdf/jpeg-pages";
import { CAROUSEL_DEFAULT_PAGES, CAROUSEL_MAX_PAGES } from "@/lib/spotlight/carousel";
import { getShareImage } from "@/lib/spotlight/share-image";

/**
 * A PDF of the newest live Spotlights, one share image per page, newest
 * first. LinkedIn shows an uploaded PDF as a swipeable "document" post, and
 * the images are already 1080 × 1350, the portrait size it recommends.
 *
 * `?count=N` picks how many. Images come from R2 (lib/spotlight/
 * share-image.ts); one that isn't stored yet is made and stored on the way.
 */
export async function GET(request: Request) {
  await requireAdmin();

  const requested = Number(new URL(request.url).searchParams.get("count"));
  const count = Number.isInteger(requested)
    ? Math.min(CAROUSEL_MAX_PAGES, Math.max(1, requested))
    : CAROUSEL_DEFAULT_PAGES;

  const ids = await listRecentLiveSpotlightIds(count);
  const env = await getEnv();
  const pages: Uint8Array[] = [];

  // One at a time: a missing image means a full render, and doing several
  // at once only piles up memory in one request.
  for (const id of ids) {
    const article = await getSpotlight(id);
    if (!article) continue;
    const image = await getShareImage(article);

    if (image.type === "image/jpeg") {
      pages.push(new Uint8Array(image.bytes));
      continue;
    }
    // A PNG only happens when the image service was down at render time.
    try {
      const jpeg = await env.IMAGES.input(new Response(image.bytes).body!)
        .output({ format: "image/jpeg", quality: 90 });
      pages.push(new Uint8Array(await jpeg.response().arrayBuffer()));
    } catch {
      // Leave that one out rather than fail the whole PDF.
    }
  }

  if (pages.length === 0) {
    return new Response("No live Spotlights to put in a PDF yet.", { status: 404 });
  }

  const today = await todayIso();
  const pdf = jpegPagesToPdf(pages, `Trenodo Spotlight, ${today}`);

  return new Response(pdf.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="trenodo-spotlight-${today}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
