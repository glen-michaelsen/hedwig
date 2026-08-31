import "server-only";
import { Resend } from "resend";
import { getEnv } from "./db";

const FROM = "Trenodo <hello@trenodo.com>";

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
    subject: "Your Trenodo invite",
    text: [
      "You've been invited to Trenodo — teaching, press kits, link in bio and setlists, in one account.",
      "",
      "This sets up the account itself, addressed to this email:",
      link,
      "",
      `The link only works for ${email}, and expires in 14 days.`,
    ].join("\n"),
  });

  return !error;
}
