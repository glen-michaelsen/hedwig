"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  type SettingsFormState,
} from "@/app/account/actions";
import { Card, ErrorText, button, input, label } from "@/app/_components/ui";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<SettingsFormState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <Card>
      <p className={label}>Password</p>
      <p className="text-sm text-muted">At least 10 characters.</p>

      <form
        action={action}
        className="mt-5 space-y-4"
        key={state.success ? "done" : "form"}
      >
        <div>
          <label className={label} htmlFor="currentPassword">
            Current password
          </label>
          <input
            className={input}
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="newPassword">
            New password
          </label>
          <input
            className={input}
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
          />
        </div>

        {state.error && <ErrorText>{state.error}</ErrorText>}
        {state.success && (
          <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            Password updated.
          </p>
        )}

        <button className={button} disabled={pending}>
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </Card>
  );
}
