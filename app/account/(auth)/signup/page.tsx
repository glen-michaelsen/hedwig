import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth";
import { SignupForm } from "./_components/signup-form";

export const metadata = { title: "Create account" };

export default async function SignupPage() {
  // Same as the login page: a signed-in visitor wants their dashboard, not
  // a second account.
  if (await getAccount()) redirect("/account");

  return <SignupForm />;
}
