type TabToken = { gap: number; text: string };
type TabLine = { string: string; tokens: TabToken[] };

const LINE_LENGTH = 58;

/**
 * One riff using every technique this guide covers — hammer-on, bend with
 * release, vibrato, slide and pull-off — so "the numbers" and "the
 * technique symbols" sections can point at the same real example instead
 * of an isolated snippet each.
 */
const TAB_LINES: TabLine[] = [
  { string: "e", tokens: [] },
  {
    string: "B",
    tokens: [
      { gap: 6, text: "9" },
      { gap: 2, text: "11" },
      { gap: 2, text: "11b13r11" },
      { gap: 2, text: "9" },
    ],
  },
  {
    string: "G",
    tokens: [
      { gap: 2, text: "9h10" },
      { gap: 17, text: "11~" },
      { gap: 2, text: "9" },
      { gap: 3, text: "9" },
    ],
  },
  {
    string: "D",
    tokens: [
      { gap: 34, text: "11" },
      { gap: 4, text: "11~" },
      { gap: 2, text: "11\\9p7" },
    ],
  },
  { string: "A", tokens: [{ gap: 49, text: "9~" }] },
  { string: "E", tokens: [] },
];

function buildLine(tokens: TabToken[]): string {
  let line = "";
  for (const token of tokens) line += "-".repeat(token.gap) + token.text;
  return line.padEnd(LINE_LENGTH, "-");
}

function isDigit(char: string) {
  return char >= "0" && char <= "9";
}

function isTechniqueSymbol(char: string) {
  return "hbrp~\\/".includes(char);
}

type Highlight = "none" | "letters" | "numbers" | "techniques";

const STYLE = {
  dash: "text-line-strong",
  normal: "text-foreground",
  muted: "text-faint",
  highlight: "font-semibold text-brand-600 dark:text-brand-400",
} as const;

function styleFor(char: string, highlight: Highlight): keyof typeof STYLE {
  if (char === "-") return "dash";
  if (highlight === "none") return "normal";
  const matches =
    (highlight === "numbers" && isDigit(char)) ||
    (highlight === "techniques" && isTechniqueSymbol(char));
  return matches ? "highlight" : "muted";
}

/** Splits a line into runs of consecutive same-style characters, so each run is one <span> rather than one per character. */
function renderBody(text: string, highlight: Highlight) {
  const runs: { text: string; style: keyof typeof STYLE }[] = [];

  for (const char of text) {
    const style = styleFor(char, highlight);
    const last = runs.at(-1);
    if (last && last.style === style) last.text += char;
    else runs.push({ text: char, style });
  }

  return runs.map((run, index) => (
    <span key={index} className={STYLE[run.style]}>
      {run.text}
    </span>
  ));
}

export function TabExample({ highlight = "none" }: { highlight?: Highlight }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface-muted px-4 py-3.5">
      <pre className="text-[13px] leading-relaxed sm:text-sm">
        {TAB_LINES.map((line) => (
          <div key={line.string}>
            <span
              className={
                highlight === "letters" ? STYLE.highlight : STYLE.normal
              }
            >
              {line.string}
            </span>
            <span className={STYLE.dash}> |</span>
            {renderBody(buildLine(line.tokens), highlight)}
          </div>
        ))}
      </pre>
    </div>
  );
}
