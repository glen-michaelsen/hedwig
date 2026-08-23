/**
 * What to call a file on screen.
 *
 * Masters arrive named for an archive — "01 - The Last Light_DKT662200501_
 * 44k_-24b.wav" — which is exactly right in a delivery folder and wrong on a
 * page a journalist reads. A title, when set, wins.
 */
export function displayName(asset: {
  title: string | null;
  filename: string;
}): string {
  return asset.title?.trim() || asset.filename;
}

/**
 * The name a download saves as: the title, keeping the real extension so the
 * file still opens in the right thing.
 */
export function downloadName(asset: {
  title: string | null;
  filename: string;
}): string {
  const title = asset.title?.trim();
  if (!title) return asset.filename;

  const extension = asset.filename.match(/\.[a-z0-9]+$/i)?.[0] ?? "";
  return title.endsWith(extension) ? title : `${title}${extension}`;
}
