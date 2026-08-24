"use client";

import { useEffect } from "react";

/**
 * iOS Safari's `dvh` unit can come out wrong right after a client-side
 * navigation into a locked shell — e.g. straight off a sign-in redirect,
 * which Next runs as an in-page transition, not a real page load. It seems
 * to inherit whatever toolbar state the previous page was in rather than
 * measuring fresh, and won't correct itself until a scroll or a reload
 * forces a new measurement.
 *
 * `window.innerHeight`, read here on mount, doesn't have that problem — it's
 * always the current value. Writing it to a CSS variable lets the shell use
 * it in place of `dvh` for the one moment that unit can't be trusted, while
 * still falling back to `dvh` for the very first paint, before this runs.
 */
export function ViewportLock() {
  useEffect(() => {
    function measure() {
      document.documentElement.style.setProperty(
        "--app-vh",
        `${window.innerHeight}px`,
      );
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return null;
}
