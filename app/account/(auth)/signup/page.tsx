import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth";
import { getOpenInvite } from "@/lib/dal/musicians";
import { Card } from "@/app/_components/ui";
import { SignupForm } from "./_components/signup-form";

export const metadata = { title: "Create account" };

export default async function SignupPage({
  searchParams,
}: PageProps<"/account/signup">) {
  // Same as the login page: a signed-in visitor wants their dashboard, not
  // a second account.
  if (await getAccount()) redirect("/account");

  const { invite: inviteId } = await searchParams;
  const invite =
    typeof inviteId === "string" ? await getOpenInvite(inviteId) : null;

  if (!invite) {
    return (
      <Card raised>
        <h1 className="text-2xl font-semibold tracking-tight">
          Invite only
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
          Trenodo isn&rsquo;t open signup right now — accounts start from an
          invite. If you&rsquo;re expecting one, check your email for the
          link, or ask whoever pointed you here to send you one.
        </p>
      </Card>
    );
  }

  return <SignupForm invite={invite.id} email={invite.email} />;
}
