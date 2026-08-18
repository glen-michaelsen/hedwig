"use client";

import { useActionState } from "react";
import {
  changeEmailAction,
  type SettingsFormState,
} from "@/app/account/actions";
import { Card, ErrorText, button, input, label } from "@/app/_components/ui";

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState<SettingsFormState, FormData>(
    changeEmailAction,
    {},
  );

  return (
    <Card>
      <p className={label}>Email</p>
      <p className="text-sm text-muted">
        Currently <span className="text-foreground">{currentEmail}</span>
      </p>

      <form action={action} className="mt-5 space-y-4" key={state.success ? "done" : "form"}>
        <div>
          <label className={label} htmlFor="email">
            New email
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

        {state.error && <ErrorText>{state.error}</ErrorText>}
        {state.success && (
          <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            Email updated.
          </p>
        )}

        <button className={button} disabled={pending}>
          {pending ? "Saving…" : "Update email"}
        </button>
      </form>
    </Card>
  );
}
