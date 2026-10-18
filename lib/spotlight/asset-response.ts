import "server-only";
import { contentDisposition } from "@/lib/r2";
import type { ShareImage } from "./share-image";

/**
 * How the public asset library serves an image: inline to look at, or as
 * a named file with `?download`. Public but kept out of search results,
 * like the library page itself.
 */
export function assetResponse(request: Request, image: ShareImage, filename: string) {
  const download = new URL(request.url).searchParams.has("download");
  return new Response(image.bytes, {
    headers: {
      "Content-Type": image.type,
      "Content-Disposition": contentDisposition(download ? "attachment" : "inline", `${filename}.${image.ext}`),
      // Stored copies are named after their content, so a short cache is
      // only ever a few minutes behind an edit.
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
