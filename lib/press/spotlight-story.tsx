/**
 * The Spotlight Instagram stories (1080 × 1920), as plain JSX trees: no
 * D1, R2 or auth in here, same as spotlight-image.tsx for the post. The
 * caller resolves the article and its images and hands them in.
 *
 * Instagram draws its own controls over the top 250 and bottom 340 pixels
 * of a story, so nothing that matters goes there. Two stories leave an
 * empty patch above that for Instagram's link sticker, which can't be
 * drawn into an image.
 *
 * Satori renders only the JSX tree it's handed, so the parts below are
 * plain functions called directly, not components.
 */

import { Children, Fragment, isValidElement } from "react";

/** Bump on any layout change: stored stories are named after a fingerprint including it. */
export const SPOTLIGHT_STORY_VERSION = 4;

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;
const SAFE_TOP = 250;
const SAFE_BOTTOM = 340;

export const STORY_FONTS = { sans: "Geist" } as const;

const INK = "#221c17";
const BRAND = "#825abe";
/** brand-900: the deep end of the duotone tint. */
const BRAND_DEEP = "#412c61";
const WHITE = "#ffffff";

const HEART_PATH =
  "M12 20.4s-7.6-4.6-7.6-9.7a4.3 4.3 0 0 1 7.6-2.8 4.3 4.3 0 0 1 7.6 2.8c0 5.1-7.6 9.7-7.6 9.7Z";

export type StoryKind =
  | "post"
  | "quote-card"
  | "quote-series"
  | "out-now"
  | "coming-soon"
  | "if-you-like"
  | "read-review";

export type StoryInput = {
  kind: StoryKind;
  /** Greyscale for the quote series, which tints it; in colour for the rest. */
  headerUrl: string | null;
  coverUrl: string | null;
  headerFocusX: number;
  headerFocusY: number;
  headline: string;
  rating: number;
  maxRating: number;
  artistName: string;
  releaseTitle: string;
  /** "Single", "EP", "Album". */
  releaseKind: string;
  /** "2026-10-09", or null if the release has no date. */
  releaseDate: string | null;
  /** For the quote stories. */
  quote?: string;
  /** 1-based, for the quote series. */
  quoteNumber?: number;
  quoteCount?: number;
  /** Labels for "If you like": genres and moods. */
  tags?: string[];
};

/* --------------------------------- parts --------------------------------- */

function frame(background: string, children: React.ReactNode) {
  return (
    <div
      style={{
        width: STORY_WIDTH,
        height: STORY_HEIGHT,
        display: "flex",
        position: "relative",
        background,
        fontFamily: STORY_FONTS.sans,
        color: WHITE,
      }}
    >
      {unwrap(children)}
    </div>
  );
}

/** The header photo, full bleed, with a dark fade up from the bottom. `strength` is how far up it reaches. */
function photo(input: StoryInput, strength: "soft" | "strong") {
  const stops = strength === "strong" ? [0.9, 0.7, 0.3, 0] : [0.85, 0.55, 0.15, 0];
  return (
    <>
      {input.headerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={input.headerUrl}
          alt=""
          width={STORY_WIDTH}
          height={STORY_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: STORY_WIDTH,
            height: STORY_HEIGHT,
            objectFit: "cover",
            objectPosition: `${input.headerFocusX}% ${input.headerFocusY}%`,
          }}
        />
      )}
      {/* An SVG gradient, as in the post: CSS gradients didn't render on a real deploy. */}
      <svg width={STORY_WIDTH} height={STORY_HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity={stops[0]} />
            <stop offset="35%" stopColor="#000000" stopOpacity={stops[1]} />
            <stop offset="65%" stopColor="#000000" stopOpacity={stops[2]} />
            <stop offset="100%" stopColor="#000000" stopOpacity={stops[3]} />
          </linearGradient>
        </defs>
        <rect width={STORY_WIDTH} height={STORY_HEIGHT} fill="url(#fade)" />
      </svg>
    </>
  );
}

/**
 * The header photo in brand duotone, as on the site's photo cards. The
 * site multiplies a greyscale photo by a purple gradient; Satori can't
 * blend, but a translucent colour over a greyscale photo is a duotone too
 * (black lands on deep purple, white on pale lavender). The caller hands
 * in a greyscale copy for this story. Then a dark fade for the text.
 */
function duotonePhoto(input: StoryInput) {
  return (
    <>
      {input.headerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={input.headerUrl}
          alt=""
          width={STORY_WIDTH}
          height={STORY_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: STORY_WIDTH,
            height: STORY_HEIGHT,
            objectFit: "cover",
            objectPosition: `${input.headerFocusX}% ${input.headerFocusY}%`,
          }}
        />
      )}
      <svg width={STORY_WIDTH} height={STORY_HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="tint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.5} />
            <stop offset="100%" stopColor={BRAND_DEEP} stopOpacity={0.75} />
          </linearGradient>
          <linearGradient id="duofade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.7} />
            <stop offset="40%" stopColor="#000000" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Shadows go deeper than a tint alone would take them. */}
        <rect width={STORY_WIDTH} height={STORY_HEIGHT} fill="#000000" fillOpacity={0.3} />
        <rect width={STORY_WIDTH} height={STORY_HEIGHT} fill="url(#tint)" />
        <rect width={STORY_WIDTH} height={STORY_HEIGHT} fill="url(#duofade)" />
      </svg>
    </>
  );
}

function cover(url: string | null, size: number, radius = 28) {
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: radius,
        boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
      }}
    />
  ) : (
    <div style={{ display: "flex", width: size, height: size, borderRadius: radius, background: "rgba(255,255,255,0.12)" }} />
  );
}

function hearts(rating: number, max: number, size: number, color: string) {
  return (
    <div style={{ display: "flex", gap: Math.round(size / 4.5) }}>
      {Array.from({ length: max }, (_, index) => (
        <svg key={index} width={size} height={size} viewBox="0 0 24 24">
          <path
            d={HEART_PATH}
            fill={index < rating ? color : "none"}
            stroke={color}
            strokeOpacity={index < rating ? 1 : 0.55}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

/** Small spaced-out label: "ANKAH · TRENODO SPOTLIGHT". */
function kicker(text: string, color: string = WHITE, opacity = 0.85) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 30,
        fontWeight: 600,
        letterSpacing: 3,
        textTransform: "uppercase",
        color,
        opacity,
      }}
    >
      {text}
    </div>
  );
}

function quoteSize(quote: string) {
  if (quote.length <= 60) return 104;
  if (quote.length <= 110) return 88;
  return 72;
}

/** A quote in the site's own type: Geist, semibold, set tight. */
function quoteText(quote: string) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: quoteSize(quote),
        fontWeight: 600,
        lineHeight: 1.12,
        letterSpacing: -1.5,
      }}
    >
      {quoted(quote)}
    </div>
  );
}

function quoted(quote: string) {
  return `“${quote}”`;
}

function headlineSize(headline: string) {
  if (headline.length <= 40) return 80;
  if (headline.length <= 70) return 66;
  return 54;
}

function releaseLine(input: StoryInput) {
  const year = input.releaseDate?.slice(0, 4);
  return [input.releaseKind, year].filter(Boolean).join(" · ");
}

/** Three letters each: en-GB's short September is "Sept", which reads long next to the rest. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateParts(date: string) {
  const day = new Date(`${date}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(day);
  return { weekday, date: `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]}` };
}

/**
 * Satori lays a fragment out as a box of its own (a row), so parts passed
 * as <>…</> would come out side by side, and an absolutely placed part
 * would size itself to the fragment rather than the frame. This hands over
 * the fragments' children instead, however deep.
 */
function unwrap(children: React.ReactNode): React.ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: React.ReactNode }>(child) && child.type === Fragment
      ? unwrap(child.props.children)
      : [child],
  );
}

/** Content block between Instagram's top and bottom bars. */
function safe(children: React.ReactNode, justify: "flex-start" | "center" | "flex-end" | "space-between", align: "flex-start" | "center" = "flex-start") {
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE_TOP,
        bottom: SAFE_BOTTOM,
        left: 84,
        right: 84,
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: align,
        textAlign: align === "center" ? "center" : "left",
      }}
    >
      {unwrap(children)}
    </div>
  );
}

/* -------------------------------- stories -------------------------------- */

/** 1. The post, in 9:16. */
function post(input: StoryInput) {
  return frame(
    INK,
    <>
      {photo(input, "soft")}
      {safe(
        <>
          {cover(input.coverUrl, 240, 28)}
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: headlineSize(input.headline),
              fontWeight: 600,
              lineHeight: 1.12,
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {input.headline}
          </div>
          <div style={{ display: "flex", marginTop: 36 }}>{hearts(input.rating, input.maxRating, 48, WHITE)}</div>
        </>,
        "flex-end",
        "center",
      )}
    </>,
  );
}

/** 3. A quote on brand purple, with the release underneath. */
function quoteCard(input: StoryInput) {
  const quote = input.quote ?? "";
  return frame(
    BRAND,
    safe(
      <>
        {kicker("Trenodo Spotlight", WHITE, 0.75)}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {quoteText(quote)}
          <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 72 }}>
            {cover(input.coverUrl, 150, 20)}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 600 }}>{input.releaseTitle}</div>
              <div style={{ display: "flex", fontSize: 32, opacity: 0.8 }}>
                {[input.artistName, releaseLine(input)].join(" · ")}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }} />
      </>,
      "space-between",
    ),
  );
}

/** 10. One quote of several, with a bar showing which. */
function quoteSeries(input: StoryInput) {
  const quote = input.quote ?? "";
  const count = Math.max(1, input.quoteCount ?? 1);
  const number = Math.min(count, Math.max(1, input.quoteNumber ?? 1));
  return frame(
    BRAND_DEEP,
    <>
      {duotonePhoto(input)}
      {safe(
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, alignSelf: "stretch" }}>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              {Array.from({ length: count }, (_, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: index < number ? WHITE : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            {kicker(`${number} of ${count}`, WHITE, 0.8)}
          </div>
          {quoteText(quote)}
          {kicker(`${input.artistName} · ${input.releaseTitle}`, WHITE, 0.8)}
        </>,
        "space-between",
      )}
    </>,
  );
}

/** 6. Release day: the cover, and room for the link sticker. */
function outNow(input: StoryInput) {
  return frame(
    INK,
    safe(
      <>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            background: BRAND,
            padding: "14px 34px",
            borderRadius: 999,
          }}
        >
          Out now
        </div>
        <div style={{ display: "flex", marginTop: 64 }}>{cover(input.coverUrl, 600, 36)}</div>
        <div style={{ display: "flex", marginTop: 64, fontSize: 68, fontWeight: 600, lineHeight: 1.1 }}>{input.releaseTitle}</div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 38, opacity: 0.8 }}>
          {`${input.artistName} · ${input.releaseKind}`}
        </div>
        {/* Room for the link sticker. */}
        <div style={{ display: "flex", height: 240 }} />
      </>,
      "center",
      "center",
    ),
  );
}

/** 7. A teaser before release day. */
function comingSoon(input: StoryInput) {
  const parts = input.releaseDate ? dateParts(input.releaseDate) : null;
  return frame(
    BRAND,
    safe(
      <>
        {kicker("New Spotlight", WHITE, 0.8)}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 260, fontWeight: 600, lineHeight: 0.95 }}>{parts?.weekday ?? "Soon"}</div>
          {parts && (
            <div style={{ display: "flex", fontSize: 260, fontWeight: 600, lineHeight: 0.95, opacity: 0.55 }}>{parts.date}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {cover(input.coverUrl, 150, 20)}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 600 }}>{input.artistName}</div>
            <div style={{ display: "flex", fontSize: 32, opacity: 0.85 }}>{`A new ${input.releaseKind.toLowerCase()}`}</div>
          </div>
        </div>
      </>,
      "space-between",
    ),
  );
}

/** 9. Tags from the press kit, leading to the release. */
function ifYouLike(input: StoryInput) {
  const tags = (input.tags ?? []).slice(0, 5);
  return frame(
    INK,
    safe(
      <>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600 }}>If you like…</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 44 }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 40,
                padding: "14px 32px",
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,0.45)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600, marginTop: 64 }}>…press play on</div>
        <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 56 }}>
          {cover(input.coverUrl, 220, 24)}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 600 }}>{input.artistName}</div>
            <div style={{ display: "flex", fontSize: 36, opacity: 0.8 }}>{input.releaseTitle}</div>
          </div>
        </div>
      </>,
      "center",
    ),
  );
}

/** 11. Points at the link sticker. */
function readReview(input: StoryInput) {
  const hearts_ = `${input.rating} heart${input.rating === 1 ? "" : "s"}`;
  return frame(
    INK,
    <>
      {photo(input, "strong")}
      {safe(
        <>
          {hearts(input.rating, input.maxRating, 44, WHITE)}
          {/* Two set lines, so the count always starts the second. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 36,
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.1,
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex" }}>Read why we gave it</div>
            <div style={{ display: "flex" }}>{hearts_}</div>
          </div>
          <svg width={72} height={72} viewBox="0 0 24 24" style={{ marginTop: 36 }}>
            <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke={WHITE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Room for the link sticker. */}
          <div style={{ display: "flex", height: 220 }} />
        </>,
        "flex-end",
        "center",
      )}
    </>,
  );
}

export function buildSpotlightStoryJsx(input: StoryInput) {
  switch (input.kind) {
    case "post":
      return post(input);
    case "quote-card":
      return quoteCard(input);
    case "quote-series":
      return quoteSeries(input);
    case "out-now":
      return outNow(input);
    case "coming-soon":
      return comingSoon(input);
    case "if-you-like":
      return ifYouLike(input);
    case "read-review":
      return readReview(input);
  }
}

