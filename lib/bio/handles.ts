/**
 * Handles live at the root of the site (`/@handle`), so a handle that
 * shadows a route is a broken app, not just a broken page.
 *
 * Add to this list whenever a top-level route is added. There's a test in
 * lib/bio/handles.test-ish usage below — see docs/link-in-bio.md.
 */
export const RESERVED_HANDLES = new Set([
  // real routes today
  "account",
  "admin",
  "api",
  "bio",
  "i",
  "kit",
  "login",
  "logout",
  "press",
  "press-kit",
  "s",
  "spotlight",
  "studio",
  "tutor",
  "tutoring",
  "link-in-bio",
  "_next",
  // plausible tomorrow
  "about",
  "app",
  "assets",
  "blog",
  "contact",
  "dashboard",
  "docs",
  "help",
  "home",
  "me",
  "new",
  "presskit",
  "pricing",
  "privacy",
  "settings",
  "signup",
  "static",
  "support",
  "trenodo",
  "terms",
  "www",
]);

export const HANDLE_MIN = 3;
export const HANDLE_MAX = 30;

/** Letters, digits, and inner `_ . -`; must start and end alphanumeric. */
const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9_.-]*[a-z0-9])?$/;

export type HandleCheck =
  | { ok: true; handle: string }
  | { ok: false; error: string };

/** Accepts "@name" or "name"; always returns the bare, lowercased form. */
export function normalizeHandle(input: string): string {
  return input.trim().replace(/^@+/, "").toLowerCase();
}

export function checkHandle(input: string): HandleCheck {
  const handle = normalizeHandle(input);

  if (handle.length < HANDLE_MIN) {
    return { ok: false, error: `At least ${HANDLE_MIN} characters.` };
  }
  if (handle.length > HANDLE_MAX) {
    return { ok: false, error: `At most ${HANDLE_MAX} characters.` };
  }
  if (!HANDLE_PATTERN.test(handle)) {
    return {
      ok: false,
      error:
        "Letters, numbers, dots, dashes and underscores — starting and ending with a letter or number.",
    };
  }
  if (RESERVED_HANDLES.has(handle)) {
    return { ok: false, error: "That one's reserved. Try another." };
  }

  return { ok: true, handle };
}
