/**
 * Crude bot detection for the kit counters.
 *
 * Deliberately crude: this decides whether a number goes up, not whether
 * anyone gets access. Missing a clever crawler inflates a count slightly;
 * blocking a real journalist would lose a number that mattered.
 */
const BOT_PATTERN =
  /bot|crawler|spider|crawl|slurp|facebookexternalhit|preview|fetch|curl|wget|python|monitor|uptime|headless|lighthouse|pingdom|semrush|ahrefs/i;

export function isProbablyBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}
