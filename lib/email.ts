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

function adminEmailHtml(heading: string, bodyHtml: string): string {
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
    html: adminEmailHtml(subject, bodyHtml),
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
