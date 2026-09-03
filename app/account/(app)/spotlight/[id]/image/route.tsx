import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAnySpotlightImage, getSpotlight } from "@/lib/dal/spotlight";
import { resolveOgImageDataUrl } from "@/lib/press/og-image";
import { MAX_RATING } from "@/lib/spotlight/slug";

const WIDTH = 1080;
const HEIGHT = 1350;

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

/**
 * The Instagram-post share image for one article: header photo, gradient,
 * cover art, headline and rating. Regenerated on every request — this is a
 * low-traffic admin tool, not public, so the article changing under a
 * cached copy isn't a real concern worth the extra invalidation logic.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/account/spotlight/[id]/image">,
) {
  const { id } = await params;
  await requireAdmin();

  const article = await getSpotlight(id);
  if (!article) notFound();

  const [header, cover] = await Promise.all([
    article.headerAssetId
      ? getAnySpotlightImage(article.headerAssetId)
      : null,
    article.coverAssetId ? getAnySpotlightImage(article.coverAssetId) : null,
  ]);

  const [headerUrl, coverUrl] = await Promise.all([
    header
      ? resolveOgImageDataUrl(header.r2Key, header.contentType, WIDTH)
      : null,
    cover
      ? resolveOgImageDataUrl(cover.r2Key, cover.contentType, 360)
      : null,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
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
            width={WIDTH}
            height={HEIGHT}
            style={{
              position: "absolute",
              inset: 0,
              width: WIDTH,
              height: HEIGHT,
              objectFit: "cover",
              objectPosition: `${article.headerFocusX}% ${article.headerFocusY}%`,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            // Stronger and multi-stop rather than one flat fade — the cover
            // art, headline and hearts all sit in the bottom third, and a
            // bright, high-key photo (lots of white/sky) needs real
            // contrast right there for white text and hearts to read,
            // not just a light wash.
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 22%, rgba(0,0,0,0.25) 42%, rgba(0,0,0,0) 60%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 72,
            display: "flex",
            flexDirection: "column",
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
              fontSize: headlineFontSize(article.headline),
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {article.headline}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {Array.from({ length: MAX_RATING }, (_, index) => (
              <svg
                key={index}
                width={36}
                height={36}
                viewBox="0 0 24 24"
                style={{
                  color:
                    index < article.rating
                      ? "#ffffff"
                      : "rgba(255,255,255,0.55)",
                }}
              >
                <path
                  d={HEART_PATH}
                  fill={index < article.rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
