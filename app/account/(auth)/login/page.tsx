import { redirect } from "next/navigation";
import { getAccount } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/account/login">) {
  // Already signed in? Then this page is a dead end. It's reached from the
  // public header's "Musician" link, which someone with a valid session
  // clicks expecting their dashboard.
  if (await getAccount()) redirect("/account");

  const { next } = await searchParams;
  const returnTo = typeof next === "string" ? next : undefined;

  return <LoginForm returnTo={returnTo} />;
}
