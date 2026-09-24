import "server-only";
import { todayIso } from "@/lib/clock";
import { getEnv } from "@/lib/db";
import {
  ensurePreviewToken,
  getSpotlight,
  getSpotlightEmailLog,
  getSpotlightOwner,
  listSpotlightsDueLiveEmail,
  markSpotlightEmailSent,
  type SpotlightEmailKind,
} from "@/lib/dal/spotlight";
import { sendSpotlightEmail } from "@/lib/email";
import { MAX_RATING, computeSpotlightStatus } from "@/lib/spotlight/slug";

/**
 * The emails a musician gets about a Spotlight on their release:
 *
 *   planned    published ahead of a future release date
 *   published  live, either right away or on release day (the cron)
 *
 * Published right away means one email. Planned ahead means two. Each
 * automatic email goes out once, logged on the spotlight row.
 */

function formatDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Sends one email about one article. `to` defaults to the release's owner. */
export async function sendSpotlightEmailFor(
  spotlightId: string,
  kind: SpotlightEmailKind,
  to?: string,
): Promise<boolean> {
  const [article, owner, { APP_URL }] = await Promise.all([
    getSpotlight(spotlightId),
    getSpotlightOwner(spotlightId),
    getEnv(),
  ]);
  if (!article || !owner) return false;

  const articleUrl = `${APP_URL}/spotlight/${article.slug}`;
  // Both emails carry the preview link: the planned one to read early, the
  // published one so "Get your badges" shows the badge box without signing in.
  const token = await ensurePreviewToken(spotlightId);

  return sendSpotlightEmail({
    kind,
    to: to ?? owner.email,
    ownerName: owner.name,
    releaseTitle: article.releaseTitle,
    headline: article.headline,
    rating: article.rating,
    maxRating: MAX_RATING,
    releaseDate: formatDate(article.releaseDate),
    articleUrl,
    previewUrl: token ? `${articleUrl}?preview=${token}` : null,
  });
}

/**
 * Right after the admin publishes: planned or live, whichever it is, unless
 * that email already went out. Unpublishing and publishing again never
 * sends a second copy.
 */
export async function sendAutomaticSpotlightEmail(spotlightId: string) {
  const [article, log, today] = await Promise.all([
    getSpotlight(spotlightId),
    getSpotlightEmailLog(spotlightId),
    todayIso(),
  ]);
  if (!article || !log) return;

  const status = computeSpotlightStatus(article.published, article.releaseDate, today);
  const kind: SpotlightEmailKind | null =
    status === "planned" && !log.plannedEmailSentAt
      ? "planned"
      : status === "published" && !log.publishedEmailSentAt
        ? "published"
        : null;
  if (!kind) return;

  if (await sendSpotlightEmailFor(spotlightId, kind)) {
    await markSpotlightEmailSent(spotlightId, kind);
  }
}

/** The cron: planned articles that went live since the last run. */
export async function sendDueSpotlightEmails() {
  const due = await listSpotlightsDueLiveEmail();
  let sent = 0;

  for (const { id } of due) {
    if (await sendSpotlightEmailFor(id, "published")) {
      await markSpotlightEmailSent(id, "published");
      sent++;
    }
  }

  return { due: due.length, sent };
}
