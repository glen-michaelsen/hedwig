import "server-only";

/**
 * Today as YYYY-MM-DD, read on the server and passed down as a prop.
 *
 * Reading the clock during render is impure and React lints for it, so
 * components take the date rather than calling `new Date()` themselves.
 */
export async function todayIso(): Promise<string> {
  return new Date().toISOString().slice(0, 10);
}

/** A date N days back, same format. Same reason for being async as above. */
export async function daysAgoIso(days: number): Promise<string> {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}
