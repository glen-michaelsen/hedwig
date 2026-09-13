import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth";
import { getOpenInvite } from "@/lib/dal/musicians";
import {
  LinkInBioIcon,
  PressKitIcon,
  SetlistIcon,
  TutorIcon,
} from "@/app/_components/nav-icons";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Create your account — Trenodo",
  description:
    "Create your free Trenodo account — Tutor, Link in Bio, Press Kit and Setlists, all in one place.",
};

const FEATURE_CARDS = [
  {
    Icon: TutorIcon,
    title: "Tutor",
    body: "Your students, your library, and a lesson note for every session.",
  },
  {
    Icon: LinkInBioIcon,
    title: "Link in Bio",
    body: "One page for everything you point people at — your music, your links, your lessons.",
  },
  {
    Icon: PressKitIcon,
    title: "Press Kit",
    body: "Cover art, photos, masters and the paperwork — organised by release, ready to send.",
  },
  {
    Icon: SetlistIcon,
    title: "Setlists",
    body: "A gig, its sets, and what you're playing in each.",
  },
] as const;

export default async function SignupPage({
  searchParams,
}: PageProps<"/account/signup">) {
  // Same as the login page: a signed-in visitor wants their dashboard, not
  // a second account.
  if (await getAccount()) redirect("/account");

  // A personal invite link prefills the email as a courtesy — it's never
  // required. A stale id (used, revoked, expired, or just wrong) simply
  // means the form starts blank instead of erroring.
  const { invite: inviteId } = await searchParams;
  const invite =
    typeof inviteId === "string" ? await getOpenInvite(inviteId) : null;

  return (
    <>
      <SiteHeader />

      <main className="relative isolate flex-1 overflow-hidden py-16 sm:py-24">
        <div className="brand-wash" />
        <div className={container}>
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,26rem)_1fr]">
            <SignupForm invite={invite?.id ?? ""} email={invite?.email ?? ""} />

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                What&rsquo;s included
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {FEATURE_CARDS.map(({ Icon, title, body }) => (
                  <div
                    key={title}
                    className="rounded-4xl border border-line bg-surface p-6 shadow-soft"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
