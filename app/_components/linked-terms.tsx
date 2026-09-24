import type { ReactNode } from "react";
import { TermLink } from "./term-link";

/**
 * Feature names that link to their own page wherever copy mentions them.
 * Good for readers, who can jump straight to the thing, and for search
 * engines, which follow these links to understand what each page is about.
 *
 * Matched case-sensitively as whole words, so "Tutor" links but "tutoring"
 * and "setlists" in a normal sentence don't. Add a row when a new feature
 * or pillar page goes live.
 */
export const LINKED_TERMS = [
  { term: "Link in Bio", href: "/link-in-bio" },
  { term: "Press Kit", href: "/press-kit" },
  { term: "Setlist", href: "/setlist" },
  { term: "Tutor", href: "/tutoring" },
  { term: "Spotlight", href: "/spotlight" },
] as const;

const HREF_BY_TERM = new Map<string, string>(
  LINKED_TERMS.map((entry) => [entry.term, entry.href]),
);

const PATTERN = new RegExp(
  `\\b(${LINKED_TERMS.map((entry) => entry.term).join("|")})\\b`,
  "g",
);

/**
 * Plain copy in, copy with links out. Only the first mention of each term
 * links. Pass one `used` set to every call in a section (all the answers in
 * an FAQ, all the steps), so a section links each feature once, not once
 * per paragraph.
 *
 * Only for body text. Never run it on text that already sits inside a link,
 * a button or a heading: a link inside a link is invalid HTML.
 */
export function linkTerms(text: string, used: Set<string> = new Set()): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(PATTERN)) {
    const term = match[1];
    const start = match.index;
    if (used.has(term)) continue;
    used.add(term);

    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <TermLink key={`${term}-${start}`} href={HREF_BY_TERM.get(term)!}>
        {term}
      </TermLink>,
    );
    last = start + term.length;
  }

  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
