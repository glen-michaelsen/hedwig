import "server-only";
import { SPOTLIGHT_AUTHOR } from "@/lib/authors";
import { getEnv } from "@/lib/db";
import { getBoardRelease, markReleaseNudged } from "@/lib/dal/spotlight";
import { sendSpotlightNudge, spotlightNudgeContent, type SpotlightNudge } from "@/lib/email";
import { parseTagList } from "@/lib/press/taxonomy";
import { missingOf, readinessOf } from "@/lib/spotlight/readiness";

/**
 * The email from the Spotlight board asking a release's owner for what's
 * missing from their press kit. Built the same way for the preview and the
 * send, so what the admin reads is exactly what goes out.
 */
export async function buildNudge(releaseId: string) {
  const [release, { APP_URL }] = await Promise.all([getBoardRelease(releaseId), getEnv()]);
  if (!release) return null;

  const { essentials, extras } = missingOf(
    readinessOf({
      hasCover: Boolean(release.coverAssetId),
      photoCount: release.photoCount,
      url: release.url,
      genre: parseTagList(release.genre),
      mood: parseTagList(release.mood),
      country: release.country,
      language: release.language,
      labelStatus: release.labelStatus,
      gender: release.gender,
    }),
  );

  const nudge: SpotlightNudge = {
    to: release.ownerEmail,
    firstName: release.ownerName.trim().split(/\s+/)[0] || release.ownerName,
    releaseTitle: release.title,
    essentials: essentials.map((item) => item.ask),
    extras: extras.map((item) => item.ask),
    kitUrl: `${APP_URL}/press/${release.id}/edit`,
    signature: SPOTLIGHT_AUTHOR.name.split(" ")[0],
  };

  return { release, nudge, content: spotlightNudgeContent(nudge), complete: essentials.length + extras.length === 0 };
}

/** Sends it to the owner (and logs it), or to `testTo` without logging. */
export async function sendNudge(releaseId: string, testTo?: string) {
  const built = await buildNudge(releaseId);
  if (!built || built.complete) return false;
  const sent = await sendSpotlightNudge(testTo ? { ...built.nudge, to: testTo } : built.nudge);
  if (sent && !testTo) await markReleaseNudged(releaseId);
  return sent;
}
