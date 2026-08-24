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
import { containerNarrow } from "@/app/_components/ui";
import { SignupForm } from "./_components/signup-form";
import { WaitlistForm } from "./_components/waitlist-form";

export const metadata: Metadata = {
  title: "Join Trenodo",
  description:
    "Trenodo is invite-only right now — join the waitlist for an invite, or a heads-up when it opens up.",
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

  const { invite: inviteId } = await searchParams;
  const invite =
    typeof inviteId === "string" ? await getOpenInvite(inviteId) : null;

  // A real invite gets the plain, narrow signup form — the same shell the
  // login page uses. Everyone else lands on the waitlist instead, which is
  // the actual public-facing page now, so it gets the full treatment.
  if (invite) {
    return (
      <>
        <SiteHeader />
        <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden py-16 sm:py-24">
          <div className="brand-wash" />
          <div className={`${containerNarrow} max-w-md`}>
            <SignupForm invite={invite.id} email={invite.email} />
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={containerNarrow}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Invite only
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Trenodo isn&rsquo;t open signup — yet.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            Accounts start from an invite while the toolbox gets built out
            with a smaller group first. Join the waitlist and you&rsquo;ll
            hear from us — either with an invite, or the moment it opens up
            for everyone.
          </p>

          <div className="mt-10">
            <WaitlistForm />
          </div>

          <section className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              What you&rsquo;d be waiting for
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
      </main>

      <SiteFooter />
    </>
  );
}
