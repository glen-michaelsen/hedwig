"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "../../actions";
import {
  Card,
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signUpAction,
    {},
  );

  return (
    <Card raised>
      <h1 className="text-2xl font-semibold tracking-tight">
        Create your studio
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        Students never need an account — you give them a PIN.
      </p>

      <form action={action} className="mt-8 space-y-5">
        <div>
          <label className={label} htmlFor="name">
            Your name
          </label>
          <input className={input} id="name" name="name" required />
        </div>

        <div>
          <label className={label} htmlFor="studioName">
            Teaching name{" "}
            <span className="font-normal normal-case tracking-normal text-faint">
              (optional)
            </span>
          </label>
          <input
            className={input}
            id="studioName"
            name="studioName"
            placeholder="Shown to your students"
          />
        </div>

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
            autoComplete="new-password"
            minLength={10}
            required
          />
          <p className="mt-2 text-xs text-faint">At least 10 characters.</p>
        </div>

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={`${button} w-full py-3.5 text-base`} disabled={pending}>
          {pending ? "Creating…" : "Create studio"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        Already have one?{" "}
        <Link
          className="font-medium text-brand-600 hover:underline dark:text-brand-400"
          href="/account/login"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
