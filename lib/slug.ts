/**
 * URL slugs, shared by every feature that needs one.
 *
 * Danish and Norwegian vowels are transliterated rather than dropped —
 * "Sølv" becomes "solv", not "slv", which would be unreadable in a URL and
 * unsearchable afterwards.
 */
export function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/å/g, "a")
    .replace(/ß/g, "ss")
    // Split the rest into letter + combining mark, then drop the marks.
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

  return base || "untitled";
}
