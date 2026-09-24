/**
 * The "Featured on Trenodo" badges an artist can put on their own site, as
 * plain JSX trees for ImageResponse. Same split as spotlight-image.tsx: no
 * D1, R2 or auth in here, so scripts/preview-spotlight-badges.ts renders the
 * exact layout the route ships.
 *
 * Three designs, five files:
 *   a-light, a-dark  a quiet pill, no rating
 *   b                the brand purple pill with hearts, one for any background
 *   c-light, c-dark  a card with the cover, title, hearts and month
 *
 * Every size below is in CSS pixels. The PNG is drawn at SCALE times that,
 * so it stays sharp on retina screens, and the embed code sets the CSS size.
 */

import type { ReactNode } from "react";
import {
  BADGE_BODY,
  badgeImageSize,
  px,
  type BadgeVariant,
} from "./badge-meta";

export {
  BADGE_VARIANTS,
  badgeImageSize,
  isBadgeVariant,
  type BadgeVariant,
} from "./badge-meta";

const COLORS = {
  light: {
    surface: "#ffffff",
    border: "#E4DCF3",
    accent: "#825ABE",
    title: "#2A2140",
    muted: "#8A7FA3",
    heartEmpty: "rgba(130,90,190,0.3)",
  },
  dark: {
    surface: "#221E2B",
    border: "#3A3350",
    accent: "#AD8DDC",
    title: "#FFFFFF",
    muted: "#A59BBE",
    heartEmpty: "rgba(173,141,220,0.35)",
  },
} as const;

/** The Trenodo mark, from public/app-icon.svg. */
const LOGO_PATH =
  "M500 400C500 455.228 455.228 500 400 500H100C44.7715 500 0 455.228 0 400V385H90.3105C92.7711 404.731 109.602 420 130 420C150.398 420 167.229 404.731 169.689 385H500V400ZM150.311 255C152.771 274.731 169.602 290 190 290C210.398 290 227.229 274.731 229.689 255H500V375H169.689C167.229 355.269 150.398 340 130 340C109.602 340 92.7711 355.269 90.3105 375H0V255H150.311ZM210.311 125C212.771 144.731 229.602 160 250 160C270.398 160 287.229 144.731 289.689 125H500V245H229.689C227.229 225.269 210.398 210 190 210C169.602 210 152.771 225.269 150.311 245H0V125H210.311ZM400 0C455.228 0 500 44.7715 500 100V115H289.689C287.229 95.2685 270.398 80 250 80C229.602 80 212.771 95.2685 210.311 115H0V100C0 44.7715 44.7715 0 100 0H400Z";

/**
 * Satori sizes some ordinary spaces far too wide ("Featured   on"). A
 * non-breaking space measures right, and nothing here wraps anyway.
 */
const nb = (text: string) => text.replace(/ /g, "\u00A0");

/** Same path HeartShape draws (app/_components/hearts.tsx). */
const HEART_PATH =
  "M12 20.4s-7.6-4.6-7.6-9.7a4.3 4.3 0 0 1 7.6-2.8 4.3 4.3 0 0 1 7.6 2.8c0 5.1-7.6 9.7-7.6 9.7Z";

function Logo({ size, color }: { size: number; color: string }) {
  return (
    <svg width={px(size)} height={px(size)} viewBox="0 0 500 500">
      <path d={LOGO_PATH} fill={color} />
    </svg>
  );
}

/** The heart's own viewBox has air on both sides, so the row overlaps a
 *  little to sit tighter than the icons' boxes suggest. */
function HeartRow({
  rating,
  maxRating,
  size,
  filled,
  empty,
}: {
  rating: number;
  maxRating: number;
  size: number;
  filled: string;
  empty: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: maxRating }, (_, index) => (
        <svg
          key={index}
          width={px(size)}
          height={px(size)}
          viewBox="0 0 24 24"
          style={{ marginLeft: index === 0 ? 0 : px(-2) }}
        >
          <path
            d={HEART_PATH}
            fill={index < rating ? filled : "none"}
            stroke={index < rating ? filled : empty}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function Canvas({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: ReactNode;
}) {
  const { width, height } = badgeImageSize(variant);
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Geist",
      }}
    >
      {children}
    </div>
  );
}

function BadgeA({ tone }: { tone: "light" | "dark" }) {
  const c = COLORS[tone];
  const body = BADGE_BODY["a-light"];
  return (
    <div
      style={{
        width: px(body.width),
        height: px(body.height),
        display: "flex",
        alignItems: "center",
        gap: px(11),
        paddingLeft: px(15),
        paddingRight: px(20),
        background: c.surface,
        border: `${px(1)}px solid ${c.border}`,
        borderRadius: px(body.height / 2),
        boxShadow:
          tone === "light" ? `0 ${px(2)}px ${px(8)}px rgba(80,50,140,0.10)` : "none",
      }}
    >
      <Logo size={26} color={c.accent} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: px(10),
            lineHeight: 1.15,
            letterSpacing: px(0.8),
            color: c.muted,
            fontWeight: 400,
          }}
        >
          {nb("FEATURED ON")}
        </div>
        <div
          style={{
            fontSize: px(14),
            lineHeight: 1.15,
            color: c.title,
            fontWeight: 600,
          }}
        >
          {nb("Trenodo Spotlight")}
        </div>
      </div>
    </div>
  );
}

function BadgeB({ rating, maxRating }: { rating: number; maxRating: number }) {
  const body = BADGE_BODY.b;
  const width = px(body.width);
  const height = px(body.height);
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        position: "relative",
        borderRadius: height / 2,
        boxShadow: `0 ${px(4)}px ${px(14)}px rgba(90,60,150,0.30)`,
      }}
    >
      {/* A real SVG gradient, not a CSS one: spotlight-image.tsx found the
          CSS version doesn't render on the deployed Worker. */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="pill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#825ABE" />
            <stop offset="100%" stopColor="#5B3C94" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} rx={height / 2} fill="url(#pill)" />
      </svg>
      <div
        style={{
          // Satori skips `inset`, so the box is pinned out in full.
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: px(10),
        }}
      >
        <Logo size={20} color="#ffffff" />
        <div
          style={{
            fontSize: px(14),
            fontWeight: 600,
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          {nb("Featured on Trenodo")}
        </div>
        <div
          style={{
            width: px(1),
            height: px(18),
            background: "rgba(255,255,255,0.3)",
          }}
        />
        <HeartRow
          rating={rating}
          maxRating={maxRating}
          size={16}
          filled="#ffffff"
          empty="rgba(255,255,255,0.5)"
        />
      </div>
    </div>
  );
}

function BadgeC({
  tone,
  coverUrl,
  title,
  month,
  rating,
  maxRating,
}: {
  tone: "light" | "dark";
  coverUrl: string | null;
  title: string;
  month: string;
  rating: number;
  maxRating: number;
}) {
  const c = COLORS[tone];
  const body = BADGE_BODY["c-light"];
  const cover = 68;
  return (
    <div
      style={{
        width: px(body.width),
        height: px(body.height),
        display: "flex",
        alignItems: "center",
        gap: px(14),
        paddingLeft: px(10),
        paddingRight: px(18),
        background: c.surface,
        border: `${px(1)}px solid ${c.border}`,
        borderRadius: px(18),
        boxShadow:
          tone === "light" ? `0 ${px(4)}px ${px(14)}px rgba(80,50,140,0.12)` : "none",
      }}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          width={px(cover)}
          height={px(cover)}
          style={{
            width: px(cover),
            height: px(cover),
            objectFit: "cover",
            borderRadius: px(11),
          }}
        />
      ) : (
        <div
          style={{
            width: px(cover),
            height: px(cover),
            borderRadius: px(11),
            background: c.border,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Logo size={28} color={c.accent} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: px(5),
            fontSize: px(10),
            lineHeight: 1,
            letterSpacing: px(0.8),
            fontWeight: 600,
            color: c.accent,
          }}
        >
          <Logo size={12} color={c.accent} />
          {nb("TRENODO SPOTLIGHT")}
        </div>
        <div
          style={{
            marginTop: px(8),
            fontSize: px(15),
            lineHeight: 1.2,
            fontWeight: 600,
            color: c.title,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {nb(title)}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: px(8),
            marginTop: px(6),
          }}
        >
          <HeartRow
            rating={rating}
            maxRating={maxRating}
            size={16}
            filled={c.accent}
            empty={c.heartEmpty}
          />
          <div style={{ fontSize: px(11), color: c.muted, fontWeight: 400 }}>
            {nb(month)}
          </div>
        </div>
      </div>
    </div>
  );
}

export type BadgeData = {
  title: string;
  coverUrl: string | null;
  rating: number;
  maxRating: number;
  /** "Sep 2026" */
  month: string;
};

export function buildBadgeJsx(variant: BadgeVariant, data: BadgeData) {
  return (
    <Canvas variant={variant}>
      {variant === "a-light" && <BadgeA tone="light" />}
      {variant === "a-dark" && <BadgeA tone="dark" />}
      {variant === "b" && (
        <BadgeB rating={data.rating} maxRating={data.maxRating} />
      )}
      {(variant === "c-light" || variant === "c-dark") && (
        <BadgeC
          tone={variant === "c-light" ? "light" : "dark"}
          coverUrl={data.coverUrl}
          title={data.title}
          month={data.month}
          rating={data.rating}
          maxRating={data.maxRating}
        />
      )}
    </Canvas>
  );
}

/** Every character a badge draws, so the font can be fetched as a subset. */
export function badgeText(data: BadgeData) {
  return `FEATURED ON Trenodo Spotlight Featured on Trenodo TRENODO SPOTLIGHT ${data.title} ${data.month} …\u00A0`;
}

export function badgeMonth(date: Date) {
  // en-US: en-GB writes September as "Sept".
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
