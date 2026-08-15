/** Pure URL helpers — used on both sides of the wire. */

const PUBLIC_PREFIX = "public/";

/** R2 key → the /i route that serves it. */
export function publicImageUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  return `/i/${key.startsWith(PUBLIC_PREFIX) ? key.slice(PUBLIC_PREFIX.length) : key}`;
}

export function bioPageUrl(handle: string): string {
  return `/@${handle}`;
}
