/**
 * muuv.dk moved into Trenodo. Every request to the old domain gets a
 * permanent (301) redirect to the closest Trenodo page, so links and
 * rankings carry over instead of breaking. The plan, and why each page
 * goes where it does, is in docs/muuv/.
 *
 * Plain JavaScript, like the Worker entry that calls it (see
 * cloudflare-worker.mjs for why).
 */
import { MUUV_EXACT } from "./redirects-map.mjs";

const MUUV_HOSTS = new Set(["muuv.dk", "www.muuv.dk"]);

/** Where a test request on preview starts: /__muuv/<old path>. */
const TEST_PREFIX = "/__muuv";

/**
 * For paths that aren't in the export (Search Console stops at 1,000
 * rows), by section. In order; the first match wins.
 */
const SECTION_RULES = [
  [/^\/log-ind/, "/account/login"],
  [/^\/musik(\/|\.html|$)/, "/discover"],
  [/^\/shop/, "/"],
  [/^\/(musikunderviser|undervisning|underviserforespoergsel)/, "/tutoring"],
  [/^\/muuvtube/, "/knowledge/guitar/getting-started"],
  [/^\/data\/material\/chords\//, "/knowledge/guitar/chords"],
  [/^\/data\//, "/knowledge"],
  [/^\/selvstudie\/(instrumenter\/)?guitar/, "/knowledge/guitar"],
  [/^\/selvstudie\/(instrumenter\/)?klaver/, "/knowledge/piano"],
  [/^\/selvstudie\/(instrumenter\/)?bas/, "/knowledge/bass"],
  [/^\/selvstudie\/(instrumenter\/)?trommer/, "/knowledge/drums"],
  [/^\/selvstudie\/(instrumenter\/)?sang/, "/knowledge/vocals"],
  [/^\/selvstudie\/(instrumenter\/)?lydstudie/, "/knowledge/record"],
  [/^\/selvstudie\/(musikteori|ordbog)/, "/knowledge/theory"],
  [/^\/(blog\/musikinspiration|artist\/)/, "/spotlight"],
  [/^\/blog/, "/knowledge"],
  [/^\/(selvstudie|guides)/, "/knowledge"],
];

/** The Trenodo path for an old muuv.dk path. Always answers: the last resort is the home page. */
export function muuvTarget(oldPath) {
  let path = oldPath;
  try {
    path = decodeURIComponent(oldPath);
  } catch {
    // A malformed escape: match on it as it came.
  }
  path = path.toLowerCase();

  // The page as listed, then the usual near misses: a trailing slash, or
  // the .html that some links leave off and others add.
  const trimmed = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const candidates = [path, trimmed, `${trimmed}.html`, trimmed.replace(/\.html?$/, ""), trimmed.replace(/\.htm$/, ".html")];
  for (const candidate of candidates) {
    if (Object.hasOwn(MUUV_EXACT, candidate)) return MUUV_EXACT[candidate];
  }

  for (const [pattern, target] of SECTION_RULES) {
    if (pattern.test(trimmed)) return target;
  }
  return "/";
}

/**
 * A 301 for a request to muuv.dk, or null for every other request.
 *
 * On preview (APP_URL is preview.trenodo.com), /__muuv/<old path> answers
 * the same way, redirecting into preview, so the redirects can be tested
 * before the domain points here.
 */
export function muuvRedirect(request, env) {
  const url = new URL(request.url);
  let oldPath;
  let base = "https://trenodo.com";

  if (MUUV_HOSTS.has(url.hostname)) {
    oldPath = url.pathname;
  } else if (
    env?.APP_URL &&
    new URL(env.APP_URL).hostname.startsWith("preview.") &&
    (url.pathname === TEST_PREFIX || url.pathname.startsWith(`${TEST_PREFIX}/`))
  ) {
    oldPath = url.pathname.slice(TEST_PREFIX.length) || "/";
    base = env.APP_URL.replace(/\/+$/, "");
  } else {
    return null;
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: base + muuvTarget(oldPath),
      // A moved site is moved for good: let browsers and crawlers remember it.
      "Cache-Control": "public, max-age=86400",
    },
  });
}
