import type { ReactNode } from "react";

/* --------------------------------- layout -------------------------------- */

export const container = "mx-auto w-full max-w-5xl px-6 sm:px-8";
export const containerNarrow = "mx-auto w-full max-w-3xl px-6 sm:px-8";

/* --------------------------------- focus --------------------------------- */

/** One focus treatment for every interactive element. */
export const focusable =
  "outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* --------------------------------- fields -------------------------------- */

/**
 * Field styling without a width, for composing inside a row. Use `input` for
 * a normal full-width field — appending a width to `input` doesn't work,
 * since `w-full` is already in there and the winner is decided by CSS order,
 * not the order of the classes in the attribute.
 *
 * Font size is 16px below `sm` on purpose: iOS Safari zooms the page in on
 * focus for any field under 16px, and every text field, select and textarea
 * in the app shares this base. `sm:text-sm` brings back the tighter desktop
 * size, where there's no touch keyboard to trigger it.
 */
export const inputBase = `rounded-2xl border border-line bg-surface px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-faint transition-colors hover:border-line-strong focus:border-brand-400 ${focusable}`;

export const input = `${inputBase} w-full`;

export const label =
  "block text-xs font-medium uppercase tracking-[0.08em] text-muted mb-2";

/* -------------------------------- buttons -------------------------------- */

const buttonBase = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none ${focusable}`;

export const button = `${buttonBase} bg-brand-600 text-white shadow-brand hover:bg-brand-500 hover:-translate-y-px active:translate-y-0`;

export const buttonGhost = `${buttonBase} border border-line bg-surface text-foreground shadow-soft hover:border-line-strong hover:-translate-y-px active:translate-y-0`;

export const buttonQuiet = `${buttonBase} text-muted hover:text-foreground hover:bg-surface-muted`;

export const buttonLarge = "px-7 py-3.5 text-base";

/* -------------------------------- surfaces ------------------------------- */

export function Card({
  children,
  className = "",
  raised = false,
}: {
  children: ReactNode;
  className?: string;
  /** For panels that should float above the page — auth, hero, dialogs. */
  raised?: boolean;
}) {
  return (
    <div
      className={`rounded-4xl border border-line bg-surface p-7 sm:p-8 ${
        raised ? "shadow-float" : "shadow-soft"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Rounded container for lists of rows, with hairline separators. */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-4xl border border-line bg-surface shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-line">{children}</ul>;
}

export const panelRow =
  "flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted";

/* ------------------------------- typography ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        {children}
      </h2>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-4xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
      {children}
    </p>
  );
}

/* --------------------------------- badges -------------------------------- */

export function KindBadge({ kind }: { kind: "pdf" | "link" | "video" }) {
  const styles = {
    pdf: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    link: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    video: "bg-brand-500/12 text-brand-700 dark:text-brand-300",
  } as const;
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${styles[kind]}`}
    >
      {kind}
    </span>
  );
}

// `leading-none` matters here: at text-xs the default line box carries more
// descent than ascent, so centring the box leaves the glyphs sitting high.
// Collapsing the line height to the font size makes the padding symmetric.
const actionPillBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium leading-none transition-all";

/** Small row-level action, e.g. Open / Edit on a list item. */
export const actionPill = `${actionPillBase} border-line bg-surface-muted text-muted hover:border-line-strong hover:bg-surface hover:text-foreground ${focusable}`;

/** The same, weighted as the primary action of its row. */
export const actionPillBrand = `${actionPillBase} border-brand-500/25 bg-brand-500/10 text-brand-700 hover:border-brand-500/40 hover:bg-brand-500/16 dark:text-brand-300 ${focusable}`;

export function Pill({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
        active
          ? "border-transparent bg-brand-600 text-white"
          : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- nav ---------------------------------- */

/**
 * The full logo — mark plus wordmark, from the brand SVG.
 *
 * Plain <img> rather than next/image: it's a vector that never needs
 * resizing or optimising, and this way it can't be blocked on the image
 * pipeline in a header that renders on every page.
 */
export function Wordmark({ className = "h-7" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="Trenodo"
      width={1980}
      height={500}
      // Height comes from the caller, never both here and there — two
      // competing height utilities resolve by stylesheet order, not by
      // the order they're written in the attribute.
      className={`w-auto ${className}`}
    />
  );
}

/** Just the mark, for square spaces where the wordmark won't fit. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/app-icon.svg"
      alt=""
      width={500}
      height={500}
      className={`h-8 w-8 rounded-xl ${className}`}
    />
  );
}
