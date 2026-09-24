import type { CompareTool } from "./types";

/** Shown on every compare page. Bump it after re-checking the sources. */
export const LAST_CHECKED = "24 September 2026";

/**
 * What each Trenodo tool costs, in one place. Link in Bio and Setlist are
 * promised free forever on their own pages. Tutor and Press Kit are free
 * today, with no promise beyond that, so they say so.
 */
export const TRENODO_PRICE: Record<CompareTool, string> = {
  "link-in-bio": "Free, forever. There is no paid plan.",
  setlist: "Free, forever. There is no paid plan.",
  tutor: "Free right now. No card needed.",
  "press-kit": "Free right now. No card needed.",
};

export const TOOL_META: Record<
  CompareTool,
  { label: string; href: string; ctaTitle: string; ctaBody: string }
> = {
  "link-in-bio": {
    label: "Link in Bio",
    href: "/link-in-bio",
    ctaTitle: "Try it. It costs nothing.",
    ctaBody: "Claim your handle and add your first block. If the other tool still fits you better, no hard feelings. 🙂",
  },
  "press-kit": {
    label: "Press Kit",
    href: "/press-kit",
    ctaTitle: "Make your first press kit.",
    ctaBody: "Add a release and drop the files in. It takes about five minutes. The rest is up to your music. 🎶",
  },
  tutor: {
    label: "Tutor",
    href: "/tutoring",
    ctaTitle: "Try it with one student.",
    ctaBody: "Add a student, write one lesson note, and see what they see. It takes about five minutes. 🎓",
  },
  setlist: {
    label: "Setlist",
    href: "/setlist",
    ctaTitle: "Build your next setlist.",
    ctaBody: "Add the gig, build the sets, print the sheet. Free, and ready before soundcheck. 🎤",
  },
};
