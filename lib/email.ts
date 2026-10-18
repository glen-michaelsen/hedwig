import "server-only";
import { Resend } from "resend";
import { getEnv } from "./db";

const FROM = "Trenodo <hello@trenodo.com>";

// The brand's actual accent and page-background colors (from the PWA
// manifest) — OKLCH, used everywhere else in the app, has no reliable
// email-client support, so this is a hand-matched hex palette rather than
// a shared token.
const COLOR = {
  bg: "#fdfaf6",
  card: "#ffffff",
  border: "#ece4d8",
  ink: "#221c17",
  muted: "#6b6153",
  accent: "#825abe",
};

const INVITE_FEATURES: { title: string; body: string }[] = [
  {
    title: "Tutor",
    body: "Your students, your library and a note for every lesson.",
  },
  {
    title: "Link in Bio",
    body: "One page for everything you want people to find. Your music, your dates, your links.",
  },
  {
    title: "Press Kit",
    body: "Photos, tracks, lyrics and your story, on one page you can send to a promoter.",
  },
  {
    title: "Setlist",
    body: "Drag songs into sets, and print a sheet for the stage.",
  },
];

function inviteEmailHtml(email: string, link: string): string {
  const features = INVITE_FEATURES.map(
    (f) => `<tr>
                  <td style="padding:14px 0;border-top:1px solid ${COLOR.border};">
                    <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:${COLOR.ink};">${f.title}</p>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:${COLOR.muted};">${f.body}</p>
                  </td>
                </tr>`,
  ).join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLOR.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.bg};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLOR.card};border:1px solid ${COLOR.border};border-radius:24px;">
            <tr>
              <td style="padding:40px 36px;">
                <p style="margin:0 0 28px;font-size:13px;font-weight:700;letter-spacing:0.14em;color:${COLOR.accent};text-transform:uppercase;">
                  Trenodo
                </p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:700;color:${COLOR.ink};">
                  A tool box made for musicians 🎵
                </h1>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${COLOR.ink};">
                  Someone thought you would like Trenodo. Teaching, promotion and gigs, all in one account. Instead of four apps that don't talk to each other.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                  ${features}
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background:${COLOR.accent};">
                      <a href="${link}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                        Create your account
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:${COLOR.muted};">
                  We already filled in your email (${email}) on the form. Change it if you want to use another one.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:${COLOR.muted};">
            Trenodo · trenodo.com
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function inviteEmailText(email: string, link: string): string {
  return [
    "A tool box made for musicians",
    "",
    "Someone thought you would like Trenodo. Teaching, promotion and gigs, all in one account. Instead of four apps that don't talk to each other.",
    "",
    ...INVITE_FEATURES.flatMap((f) => [`${f.title}: ${f.body}`]),
    "",
    "Create your account:",
    link,
    "",
    `We already filled in your email (${email}) on the form. Change it if you want to use another one.`,
  ].join("\n");
}

/**
 * Best-effort by design: an invite is already created and its link already
 * works the moment this is called, so a Resend outage shouldn't block the
 * admin from sending it — it should just fall back to the copy-link they
 * already have. Callers get a plain boolean, not a thrown error.
 */
export async function sendInviteEmail(
  email: string,
  link: string,
): Promise<boolean> {
  const { RESEND_API_KEY } = await getEnv();
  if (!RESEND_API_KEY) return false;

  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "A tool box made for musicians 🎵",
    html: inviteEmailHtml(email, link),
    text: inviteEmailText(email, link),
  });

  return !error;
}

/* ----------------------------- admin notices ----------------------------- */

// `name` comes straight from the public signup form — unescaped, it's an
// HTML-injection vector into the admin's own mail client.
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** The white card on the warm background, shared by every non-invite email. */
function cardEmailHtml(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLOR.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.bg};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLOR.card};border:1px solid ${COLOR.border};border-radius:24px;">
            <tr>
              <td style="padding:40px 36px;">
                <p style="margin:0 0 28px;font-size:13px;font-weight:700;letter-spacing:0.14em;color:${COLOR.accent};text-transform:uppercase;">
                  Trenodo
                </p>
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${COLOR.ink};">
                  ${heading}
                </h1>
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Best-effort, same as sendInviteEmail — nothing about the signup itself
 * depends on this succeeding.
 */
async function sendAdminEmail(
  subject: string,
  bodyHtml: string,
  bodyText: string,
): Promise<boolean> {
  const { RESEND_API_KEY, ADMIN_EMAIL } = await getEnv();
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return false;

  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject,
    html: cardEmailHtml(subject, bodyHtml),
    text: [subject, "", bodyText].join("\n"),
  });

  return !error;
}

/**
 * The only heads-up an admin gets that someone new signed up, now that
 * signup is public — fired for every account, invited or not.
 */
export async function sendNewSignupAdminEmail(
  name: string,
  email: string,
  invited: boolean,
): Promise<boolean> {
  const detail = invited ? `${email} (you invited them)` : email;
  return sendAdminEmail(
    "New signup",
    `<p style="margin:0;font-size:16px;line-height:1.6;color:${COLOR.ink};"><strong>${escapeHtml(name)}</strong>, ${escapeHtml(detail)}</p>`,
    `${name}, ${detail}`,
  );
}

/* ------------------------------ Spotlight ------------------------------ */

export type SpotlightEmail = {
  kind: "planned" | "published" | "reminder";
  to: string;
  ownerName: string;
  releaseTitle: string;
  headline: string;
  rating: number;
  maxRating: number;
  /** "11 September 2026", or null for an undated release. */
  releaseDate: string | null;
  /** The public article, /spotlight/<slug>. */
  articleUrl: string;
  /** The article with its preview token: readable before it is public, and
   *  the way the owner sees the badge box without signing in. */
  previewUrl?: string | null;
  /** The public asset library, /spotlight/assets/<id>: post, stories, badges. */
  assetsUrl: string;
  /** For the reminder: a few stories from the library, as thumbnails. */
  stories?: { src: string; label: string }[];
};

function hearts(rating: number, maxRating: number) {
  const filled = "\u2665".repeat(rating);
  const empty = "\u2665".repeat(Math.max(0, maxRating - rating));
  return {
    html: `<span style="font-size:20px;letter-spacing:3px;color:${COLOR.accent};">${filled}</span><span style="font-size:20px;letter-spacing:3px;color:#ddd3ec;">${empty}</span>`,
    text: `${rating} of ${maxRating} hearts`,
  };
}

function pillButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
                  <tr>
                    <td style="border-radius:999px;background:${COLOR.accent};">
                      <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${label}</a>
                    </td>
                  </tr>
                </table>`;
}

function paragraph(html: string) {
  return `<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${COLOR.ink};">${html}</p>`;
}

/** Headline and hearts, in a soft box, like a quote from the article. */
function articleBox(headline: string, rating: number, maxRating: number) {
  const h = hearts(rating, maxRating);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:${COLOR.bg};border:1px solid ${COLOR.border};border-radius:16px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;color:${COLOR.accent};text-transform:uppercase;">Headline</p>
                      <p style="margin:0 0 14px;font-size:18px;line-height:1.35;font-weight:700;color:${COLOR.ink};">${escapeHtml(headline)}</p>
                      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.12em;color:${COLOR.accent};text-transform:uppercase;">Rating</p>
                      <p style="margin:0;">${h.html} <span style="font-size:14px;color:${COLOR.muted};">${h.text}</span></p>
                    </td>
                  </tr>
                </table>`;
}

/** The Instagram post as a thumbnail, linking to the asset library, with a button under it. */
function assetLibrary(email: SpotlightEmail, heading: string, intro: string, spaceAbove = 8) {
  return [
    `<p style="margin:${spaceAbove}px 0 8px;font-size:17px;font-weight:700;color:${COLOR.ink};">${heading}</p>`,
    paragraph(intro),
    `<p style="margin:0 0 20px;"><a href="${email.assetsUrl}"><img src="${email.assetsUrl}/post" alt="The Instagram post for ${escapeHtml(email.releaseTitle)}" width="240" height="300" style="display:block;width:240px;max-width:100%;height:auto;border:0;border-radius:16px;"></a></p>`,
    pillButton(email.assetsUrl, "Open your asset library"),
  ].join("");
}

function spotlightPlanned(email: SpotlightEmail) {
  const name = escapeHtml(email.ownerName);
  const title = escapeHtml(email.releaseTitle);
  const when = email.releaseDate
    ? `on ${escapeHtml(email.releaseDate)}, the day your release comes out`
    : "on your release day";
  const subject = "Your release is getting a Spotlight \u{1F526}";

  const html = cardEmailHtml(
    `${title} is getting a Spotlight \u{1F526}`,
    [
      paragraph(`Good news, ${name}. We listened to <strong>${title}</strong>, and we wrote about it. The article goes live ${when}.`),
      articleBox(email.headline, email.rating, email.maxRating),
      email.previewUrl
        ? paragraph("Want a sneak peek? This link works for you now, before anyone else can see the article.") +
          pillButton(email.previewUrl, "Read it before everyone else")
        : "",
      assetLibrary(
        email,
        "Get your posts ready",
        "We made an Instagram post and stories from the review. Save them now, post them on release day.",
        // Under a button rather than a link line, which brings less space of its own.
        28,
      ),
      `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:${COLOR.muted};">On release day you get one more email, with the public link and badges for your website. Nothing to do until then. \u{1F642}</p>`,
    ].join(""),
  );

  const text = [
    `${email.releaseTitle} is getting a Spotlight`,
    "",
    `Good news, ${email.ownerName}. We listened to ${email.releaseTitle}, and we wrote about it. The article goes live ${email.releaseDate ? `on ${email.releaseDate}` : "on your release day"}.`,
    "",
    `Headline: ${email.headline}`,
    `Rating: ${hearts(email.rating, email.maxRating).text}`,
    ...(email.previewUrl ? ["", "Read it before everyone else:", email.previewUrl] : []),
    "",
    "Get your posts ready: an Instagram post and stories, made from the review:",
    email.assetsUrl,
    "",
    "On release day you get one more email, with the public link and badges for your website.",
  ].join("\n");

  return { subject, html, text };
}

function spotlightPublished(email: SpotlightEmail) {
  const name = escapeHtml(email.ownerName);
  const title = escapeHtml(email.releaseTitle);
  // Through the preview link: the badge box only shows for the artist, and
  // they may not be signed in when they click this.
  const badgesUrl = email.previewUrl
    ? `${email.previewUrl}#badges`
    : `${email.articleUrl}#badges`;
  const subject = "Your Spotlight is live \u{1F526}";

  const html = cardEmailHtml(
    `Your Spotlight is live \u{1F526}`,
    [
      paragraph(`${name}, the article about <strong>${title}</strong> is now on Trenodo. Anyone can read it, and it's yours to share.`),
      articleBox(email.headline, email.rating, email.maxRating),
      pillButton(email.articleUrl, "Read the article"),
      `<p style="margin:0 0 28px;font-size:13px;line-height:1.5;color:${COLOR.muted};word-break:break-all;"><a href="${email.articleUrl}" style="color:${COLOR.accent};">${email.articleUrl}</a></p>`,
      assetLibrary(
        email,
        "Share it on Instagram",
        "We made a post and stories from the review. On your phone, save them straight to your photos.",
      ),
      `<p style="margin:20px 0 8px;font-size:17px;font-weight:700;color:${COLOR.ink};">Put a badge on your website</p>`,
      paragraph("Show fans and bookers that your release was featured. The badge links to the article. Pick one, copy the code, paste it on your site or in your EPK."),
      `<p style="margin:0 0 20px;"><a href="${badgesUrl}"><img src="${email.articleUrl}/badge/b.png" alt="Featured on Trenodo, ${email.rating} of ${email.maxRating} hearts" width="340" height="68" style="display:block;max-width:100%;height:auto;border:0;"></a></p>`,
      pillButton(badgesUrl, "Get your badges"),
      `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:${COLOR.muted};">A review is a good reason to post about your release again. Share the link with your fans. \u{1F3B6}</p>`,
    ].join(""),
  );

  const text = [
    "Your Spotlight is live",
    "",
    `${email.ownerName}, the article about ${email.releaseTitle} is now on Trenodo. Anyone can read it, and it's yours to share.`,
    "",
    `Headline: ${email.headline}`,
    `Rating: ${hearts(email.rating, email.maxRating).text}`,
    "",
    "Read the article:",
    email.articleUrl,
    "",
    "Your Instagram post and stories:",
    email.assetsUrl,
    "",
    "Get badges for your website:",
    badgesUrl,
  ].join("\n");

  return { subject, html, text };
}

/** Story thumbnails side by side, each linking to the asset library. */
function storyRow(email: SpotlightEmail) {
  const stories = email.stories ?? [];
  if (stories.length === 0) return "";
  const cells = stories
    .map(
      (story) => `<td width="${Math.floor(100 / stories.length)}%" style="padding:0 5px;vertical-align:top;">
                        <a href="${email.assetsUrl}"><img src="${story.src}" alt="${escapeHtml(story.label)}" width="150" style="display:block;width:100%;max-width:150px;height:auto;border:0;border-radius:12px;"></a>
                      </td>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>${cells}</tr>
                </table>`;
}

/**
 * A week after the published email: a nudge to post about it again, with
 * stories ready to go. Timed from that email, not the release, so "a week
 * ago" is when the review went up.
 */
function spotlightReminder(email: SpotlightEmail) {
  const name = escapeHtml(email.ownerName);
  const title = escapeHtml(email.releaseTitle);
  const subject = `A week ago we published our review of ${email.releaseTitle}`;

  const html = cardEmailHtml(
    `A week ago we published our review of ${title}`,
    [
      paragraph(`${name}, a week out is a good time to post about <strong>${title}</strong> again. Fans who missed release day are still finding new music.`),
      paragraph("These are ready to go:"),
      storyRow(email),
      pillButton(email.assetsUrl, "Open your asset library"),
      `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:${COLOR.muted};">Add a link sticker to <a href="${email.articleUrl}" style="color:${COLOR.accent};">the review</a> on your story, and fans can read it in one tap. \u{1F3B6}</p>`,
    ].join(""),
  );

  const text = [
    `A week ago we published our review of ${email.releaseTitle}`,
    "",
    `${email.ownerName}, a week out is a good time to post about ${email.releaseTitle} again. Fans who missed release day are still finding new music.`,
    "",
    "Your post and stories, ready to go:",
    email.assetsUrl,
    "",
    "The review, for a link sticker:",
    email.articleUrl,
  ].join("\n");

  return { subject, html, text };
}

/** Subject, HTML and text for one Spotlight email, without sending it. */
export function spotlightEmailContent(email: SpotlightEmail) {
  if (email.kind === "planned") return spotlightPlanned(email);
  if (email.kind === "published") return spotlightPublished(email);
  return spotlightReminder(email);
}

/**
 * Best-effort, like the other senders: returns false instead of throwing,
 * so a Resend hiccup never blocks publishing an article.
 */
export async function sendSpotlightEmail(email: SpotlightEmail): Promise<boolean> {
  const { RESEND_API_KEY } = await getEnv();
  if (!RESEND_API_KEY) return false;

  const content = spotlightEmailContent(email);
  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: FROM,
    to: email.to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return !error;
}

/* ---------------- Spotlight: asking for what's missing ---------------- */

export type SpotlightNudge = {
  to: string;
  firstName: string;
  releaseTitle: string;
  /** What we need before we can write about it: "A press photo". */
  essentials: string[];
  /** What would help an article reach further: "Genre". */
  extras: string[];
  /** The kit's edit page, where most of it is filled in. */
  kitUrl: string;
  /** Who signs it. */
  signature: string;
};

function bulletList(items: string[]) {
  return `<ul style="margin:0 0 20px;padding:0 0 0 20px;font-size:16px;line-height:1.7;color:${COLOR.ink};">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

const NUDGE_EXTRAS_INTRO =
  "They put your release on the right Discover lists, where listeners browse by genre, country and mood:";
const NUDGE_PROMISE =
  "One honest note: we can't promise a Spotlight article for every release. But we listen to everything that comes in, and every submission gets a fair chance. \u{1F3A7}";

/** The email, as the admin previews it and as it's sent. */
export function spotlightNudgeContent(nudge: SpotlightNudge) {
  const title = escapeHtml(nudge.releaseTitle);
  const name = escapeHtml(nudge.firstName);
  const needs = nudge.essentials.length > 0;
  const one = nudge.essentials.length === 1;

  const subject = needs
    ? `Your press kit for "${nudge.releaseTitle}" is nearly Spotlight-ready`
    : `A few details could take "${nudge.releaseTitle}" further`;

  const html = cardEmailHtml(
    `Your press kit for ${title}`,
    [
      paragraph(`Hi ${name},`),
      paragraph(`Thanks for building the press kit for <strong>${title}</strong> on Trenodo. It's great to see it there. \u{1F389}`),
      needs
        ? paragraph(`We'd love to consider it for a Spotlight article. To do that, we need ${one ? "one more thing" : "a few more things"}:`) +
          bulletList(nudge.essentials)
        : paragraph("It already has everything we need to consider it for a Spotlight article. A few more details would help an article reach further."),
      nudge.extras.length > 0
        ? paragraph(needs ? `These are optional, but they help a Spotlight article reach further. ${NUDGE_EXTRAS_INTRO}` : NUDGE_EXTRAS_INTRO) +
          bulletList(nudge.extras)
        : "",
      pillButton(nudge.kitUrl, "Finish your press kit"),
      `<p style="margin:20px 0 20px;font-size:14px;line-height:1.6;color:${COLOR.muted};">${NUDGE_PROMISE}</p>`,
      `<p style="margin:0;font-size:16px;line-height:1.5;color:${COLOR.ink};">${escapeHtml(nudge.signature)}<br><span style="color:${COLOR.muted};">Trenodo Spotlight</span></p>`,
    ].join(""),
  );

  const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
  const text = [
    `Hi ${nudge.firstName},`,
    "",
    `Thanks for building the press kit for ${nudge.releaseTitle} on Trenodo. It's great to see it there.`,
    "",
    ...(needs
      ? [`We'd love to consider it for a Spotlight article. To do that, we need ${one ? "one more thing" : "a few more things"}:`, list(nudge.essentials), ""]
      : ["It already has everything we need to consider it for a Spotlight article. A few more details would help an article reach further.", ""]),
    ...(nudge.extras.length > 0
      ? [needs ? `These are optional, but they help a Spotlight article reach further. ${NUDGE_EXTRAS_INTRO}` : NUDGE_EXTRAS_INTRO, list(nudge.extras), ""]
      : []),
    "Finish your press kit:",
    nudge.kitUrl,
    "",
    NUDGE_PROMISE,
    "",
    nudge.signature,
    "Trenodo Spotlight",
  ].join("\n");

  return { subject, html, text };
}

/** Best-effort like the other senders: false instead of throwing. */
export async function sendSpotlightNudge(nudge: SpotlightNudge): Promise<boolean> {
  const { RESEND_API_KEY } = await getEnv();
  if (!RESEND_API_KEY) return false;
  const content = spotlightNudgeContent(nudge);
  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: FROM,
    to: nudge.to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });
  return !error;
}
