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

function inviteEmailHtml(email: string, link: string): string {
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
                  Yes, you&rsquo;re in!
                </h1>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:${COLOR.ink};">
                  Your Trenodo account is ready to set up — teaching, press kits, link in bio and setlists, all in one place.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background:${COLOR.accent};">
                      <a href="${link}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                        Set up your account
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:${COLOR.muted};">
                  Heads up — this link&rsquo;s just for ${email} and works for the next 14 days.
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
    "Yes, you're in!",
    "",
    "Your Trenodo account is ready to set up — teaching, press kits, link in bio and setlists, all in one place.",
    "",
    "Set up your account:",
    link,
    "",
    `Heads up — this link's just for ${email} and works for the next 14 days.`,
  ].join("\n");
}

/**
 * Best-effort by design: an invite is already created and its link already
 * works the moment this is called, so a Resend outage shouldn't block the
 * admin from inviting someone — it should just fall back to the copy-link
 * they already have. Callers get a plain boolean, not a thrown error.
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
    subject: "Yes, you're in!",
    html: inviteEmailHtml(email, link),
    text: inviteEmailText(email, link),
  });

  return !error;
}
