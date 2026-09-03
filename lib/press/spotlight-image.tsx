/**
 * The Spotlight Instagram-post share image, as a plain JSX tree — no D1,
 * R2, or auth in here on purpose. The real route (app/account/(app)/
 * spotlight/[id]/image/route.tsx) resolves the article and its images and
 * hands the results in; scripts/preview-spotlight-image.ts does the same
 * with local sample files. Both call this one function, so a local preview
 * is never testing a different layout than what actually ships.
 */

export const SPOTLIGHT_IMAGE_WIDTH = 1080;
export const SPOTLIGHT_IMAGE_HEIGHT = 1350;

/** Same path HeartShape draws (app/_components/hearts.tsx) — Satori renders
 *  only the JSX handed straight to ImageResponse, not React components, so
 *  the shape is copied in rather than imported. */
const HEART_PATH =
  "M12 20.4s-7.6-4.6-7.6-9.7a4.3 4.3 0 0 1 7.6-2.8 4.3 4.3 0 0 1 7.6 2.8c0 5.1-7.6 9.7-7.6 9.7Z";

function headlineFontSize(headline: string) {
  if (headline.length <= 40) return 64;
  if (headline.length <= 70) return 52;
  return 42;
}

export function buildSpotlightImageJsx({
  headerUrl,
  coverUrl,
  headline,
  rating,
  maxRating,
  headerFocusX,
  headerFocusY,
}: {
  headerUrl: string | null;
  coverUrl: string | null;
  headline: string;
  rating: number;
  maxRating: number;
  headerFocusX: number;
  headerFocusY: number;
}) {
  return (
    <div
      style={{
        width: SPOTLIGHT_IMAGE_WIDTH,
        height: SPOTLIGHT_IMAGE_HEIGHT,
        display: "flex",
        position: "relative",
        background: "#221c17",
      }}
    >
      {headerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={headerUrl}
          alt=""
          width={SPOTLIGHT_IMAGE_WIDTH}
          height={SPOTLIGHT_IMAGE_HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: SPOTLIGHT_IMAGE_WIDTH,
            height: SPOTLIGHT_IMAGE_HEIGHT,
            objectFit: "cover",
            objectPosition: `${headerFocusX}% ${headerFocusY}%`,
          }}
        />
      )}

      {/* Bottom-up dark fade, built from an SVG gradient rather than a CSS
          background: linear-gradient — the CSS version didn't render at all
          on a real deploy, so this trades a CSS property for the thing
          Satori is actually built around (it emits SVG under the hood; a
          real <linearGradient> is native to that, not translated CSS). */}
      <svg
        width={SPOTLIGHT_IMAGE_WIDTH}
        height={SPOTLIGHT_IMAGE_HEIGHT}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.85} />
            <stop offset="35%" stopColor="#000000" stopOpacity={0.55} />
            <stop offset="65%" stopColor="#000000" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect
          width={SPOTLIGHT_IMAGE_WIDTH}
          height={SPOTLIGHT_IMAGE_HEIGHT}
          fill="url(#fade)"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            width={200}
            height={200}
            style={{
              width: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 24,
              boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
              marginBottom: 32,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            fontSize: headlineFontSize(headline),
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#ffffff",
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {Array.from({ length: maxRating }, (_, index) => (
            <svg
              key={index}
              width={36}
              height={36}
              viewBox="0 0 24 24"
              style={{
                color: index < rating ? "#ffffff" : "rgba(255,255,255,0.55)",
              }}
            >
              <path
                d={HEART_PATH}
                fill={index < rating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
