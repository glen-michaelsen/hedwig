import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Already signed in? Then this page is a dead end. It's reached from the
  // public header's "Musician" link, which someone with a valid session
  // clicks expecting their dashboard — and was being asked to sign in again
  // on top of a session that was working perfectly well.
  if (await getAccount()) redirect("/account");

  return <LoginForm />;
}
