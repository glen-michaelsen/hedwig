import "server-only";
import { eq } from "drizzle-orm";
import { releaseAsset } from "@/db/schema";
import { getDb, getEnv } from "@/lib/db";
import { getObject } from "@/lib/r2";
import { isResizableImage } from "./variants";

export type Dimensions = { width: number; height: number };

/**
 * The pixel size of an image, measured once and kept.
 *
 * Measured on first use rather than at upload, so the photos already in the
 * bucket get dimensions too — the same lazy approach the resized variants
 * use, and for the same reason: a backfill script would only cover what
 * exists the day it runs.
 *
 * Returns null for anything that isn't an image, or when the file can't be
 * read — the caller shows the file size alone rather than an error.
 */
export async function ensureDimensions(asset: {
  id: string;
  r2Key: string;
  contentType: string;
  width: number | null;
  height: number | null;
}): Promise<Dimensions | null> {
  if (asset.width !== null && asset.height !== null) {
    return { width: asset.width, height: asset.height };
  }
  if (!isResizableImage(asset.contentType)) return null;

  const object = await getObject(asset.r2Key);
  if (!object) return null;

  try {
    const env = await getEnv();
    const info = await env.IMAGES.info(object.body);

    // A vector has no pixel dimensions to report; the type says they're
    // optional and this is the case that makes them so.
    if (!("width" in info) || !("height" in info)) return null;
    const { width, height } = info;
    if (typeof width !== "number" || typeof height !== "number") return null;

    const db = await getDb();
    await db
      .update(releaseAsset)
      .set({ width, height })
      .where(eq(releaseAsset.id, asset.id));

    return { width, height };
  } catch {
    // Not an image after all, or Images refused it. Not worth failing a
    // page render over.
    return null;
  }
}
