"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createStudentAction, type NewStudentState } from "../../actions";
import { LevelSelect } from "@/app/_components/level-select";
import { PhoneInput } from "@/app/_components/phone-input";
import {
  Card,
  ErrorText,
  button,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

export function AddStudentForm() {
  const [state, action, pending] = useActionState<NewStudentState, FormData>(
    createStudentAction,
    {},
  );

  // The PIN is stored hashed, so this is the only time it can be displayed.
  if (state.created) {
    return (
      <Card raised className="border-brand-300/60 dark:border-brand-700/60">
        <h3 className="text-lg font-semibold tracking-tight">
          {state.created.name} is set up
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
          Give them this PIN now — it&rsquo;s hashed and can&rsquo;t be shown
          again. If it&rsquo;s lost, issue a new one from their page.
        </p>

        <dl className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-surface-muted p-6">
            <dt className={label}>Signs in with</dt>
            <dd className="font-mono text-lg">{state.created.phone}</dd>
          </div>
          <div className="rounded-3xl bg-brand-500/10 p-6">
            <dt className={label}>PIN</dt>
            <dd className="font-mono text-3xl tracking-[0.3em] text-brand-700 dark:text-brand-300">
              {state.created.pin}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link className={button} href={`/tutor/students/${state.created.id}`}>
            Open {state.created.name}
          </Link>
          <button
            className={buttonQuiet}
            onClick={() => window.location.reload()}
          >
            Add another
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form action={action} className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="name">
            Name
          </label>
          <input className={input} id="name" name="name" required />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="phone">
            Phone number
          </label>
          <PhoneInput id="phone" name="phone" required />
          <p className="mt-2 text-xs text-faint">
            What they&rsquo;ll sign in with. Siblings can share a number — the
            PIN tells them apart.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="instrument">
            Instrument
          </label>
          <input
            className={input}
            id="instrument"
            name="instrument"
            placeholder="Guitar"
          />
        </div>

        <div>
          <label className={label} htmlFor="level">
            Level
          </label>
          <LevelSelect id="level" />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="parentEmail">
            Email{" "}
            <span className="font-normal normal-case tracking-normal text-faint">
              (a parent&rsquo;s, for younger students)
            </span>
          </label>
          <input
            className={input}
            id="parentEmail"
            name="parentEmail"
            type="email"
          />
        </div>

        {state.error && (
          <div className="sm:col-span-2">
            <ErrorText>{state.error}</ErrorText>
          </div>
        )}

        <div className="sm:col-span-2">
          <button className={button} disabled={pending}>
            {pending ? "Creating…" : "Add student"}
          </button>
        </div>
      </form>
    </Card>
  );
}
