import "server-only";
import { todayIso } from "@/lib/clock";
import { getEnv } from "@/lib/db";
import {
  ensurePreviewToken,
  getSpotlight,
  getSpotlightEmailLog,
  getSpotlightOwner,
  listSpotlightsDueLiveEmail,
  listSpotlightsDueReminderEmail,
  markSpotlightEmailSent,
  type SpotlightEmailKind,
} from "@/lib/dal/spotlight";
import { sendSpotlightEmail } from "@/lib/email";
import { MAX_RATING, computeSpotlightStatus } from "@/lib/spotlight/slug";
import { storySlots } from "@/lib/spotlight/story-image";

/**
 * The emails a musician gets about a Spotlight on their release:
 *
 *   planned    published ahead of a future release date
 *   published  live, either right away or on release day (the cron)
 *   reminder   a week after the published email: share it again (the cron)
 *
 * Each automatic email goes out once, logged on the spotlight row.
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
  const assetsUrl = `${APP_URL}/spotlight/assets/${article.id}`;
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
    assetsUrl,
    stories: kind === "reminder" ? reminderStories(article, assetsUrl) : undefined,
  });
}

/** The stories most worth a second post, best first: a quote, the review link, then whatever else there is. */
const REMINDER_STORY_ORDER = ["quote-card-1", "read-review", "quote-series-1", "if-you-like", "out-now", "post"];

function reminderStories(article: Parameters<typeof storySlots>[0], assetsUrl: string) {
  const slots = storySlots(article);
  return REMINDER_STORY_ORDER.map((slot) => slots.find((candidate) => candidate.slot === slot))
    .filter((slot) => slot !== undefined)
    .slice(0, 3)
    .map(({ slot, label }) => ({ src: `${assetsUrl}/story/${slot}`, label }));
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

/**
 * The cron: planned articles that went live since the last run, and the
 * "share it again" reminder a week after an article's published email.
 */
export async function sendDueSpotlightEmails() {
  const [due, reminders] = await Promise.all([listSpotlightsDueLiveEmail(), listSpotlightsDueReminderEmail()]);
  let sent = 0;
  let reminded = 0;

  for (const { id } of due) {
    if (await sendSpotlightEmailFor(id, "published")) {
      await markSpotlightEmailSent(id, "published");
      sent++;
    }
  }
  for (const { id } of reminders) {
    if (await sendSpotlightEmailFor(id, "reminder")) {
      await markSpotlightEmailSent(id, "reminder");
      reminded++;
    }
  }

  return { due: due.length, sent, remindersDue: reminders.length, reminded };
}
