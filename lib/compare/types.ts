/**
 * The shape of every compare page. Two kinds:
 *
 *   versus   "Trenodo vs X": a feature table, where each one wins, FAQ
 *   roundup  "X alternatives" / "best Y": a list of tools, Trenodo among them
 *
 * The honesty rules live in the data, not the template: every fact about
 * another tool has a source in `sources`, `theyWin` is never empty, and
 * `lastChecked` is shown on the page. Re-check the sources and bump the date
 * every quarter.
 */

export type CompareTool = "link-in-bio" | "press-kit" | "tutor" | "setlist";

export type Faq = { q: string; a: string };
export type Source = { label: string; href: string };

export type Versus = {
  kind: "versus";
  slug: string;
  tool: CompareTool;
  competitor: string;
  lastChecked: string;
  /** Meta description, no emojis. */
  description: string;
  /** Hero paragraph under "Trenodo vs X". */
  intro: string;
  chooseThem: string;
  chooseUs: string;
  rows: { group: string; rows: { feature: string; trenodo: string; them: string }[] }[];
  theyWin: string[];
  weWin: string[];
  faqs: Faq[];
  sources: Source[];
};

export type RoundupEntry = {
  name: string;
  /** Short price line, like "Free" or "From $8 a month". */
  price: string;
  bestFor: string;
  body: string;
  /** Slug of the matching versus page, if there is one. */
  compareSlug?: string;
  isTrenodo?: boolean;
};

export type Roundup = {
  kind: "roundup";
  slug: string;
  tool: CompareTool;
  /** The H1 and the <title>, without " | Trenodo". */
  title: string;
  lastChecked: string;
  description: string;
  intro: string;
  entries: RoundupEntry[];
  faqs: Faq[];
  sources: Source[];
};

export type Comparison = Versus | Roundup;
