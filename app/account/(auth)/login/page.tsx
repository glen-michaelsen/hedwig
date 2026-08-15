"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthFormState } from "../../actions";
import {
  Card,
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signInAction,
    {},
  );

  return (
    <Card raised>
      <h1 className="text-2xl font-semibold tracking-tight">
        Sign in to your studio
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The musician side of Trenodo.
      </p>

      <form action={action} className="mt-8 space-y-5">
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            className={input}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="password">
            Password
          </label>
          <input
            className={input}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={`${button} w-full py-3.5 text-base`} disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        No studio yet?{" "}
        <Link
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          href="/account/signup"
        >
          Create one
        </Link>
      </p>
    </Card>
  );
}
