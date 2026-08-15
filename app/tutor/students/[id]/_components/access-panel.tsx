"use client";

import { useActionState } from "react";
import { issueNewPinAction, type NewPinState } from "../../../actions";
import { Card, ErrorText, buttonGhost, label } from "@/app/_components/ui";

export function AccessPanel({
  studentId,
  phone,
  lockedUntilLabel,
  siblings,
}: {
  studentId: string;
  /** Formatted for display; the stored value is E.164. */
  phone: string | null;
  /** Set only while the lockout is active; formatted on the server. */
  lockedUntilLabel: string | null;
  /** Other students of yours who sign in on the same number. */
  siblings: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<NewPinState, FormData>(
    issueNewPinAction,
    {},
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className={label}>Signs in with</p>
          <p className="font-mono text-xl">{phone ?? "—"}</p>

          {state.pin ? (
            <div className="mt-5 rounded-3xl bg-brand-500/10 p-5">
              <p className={label}>New PIN</p>
              <p className="font-mono text-3xl tracking-[0.3em] text-brand-700 dark:text-brand-300">
                {state.pin}
              </p>
              <p className="mt-2 text-xs text-muted">
                Shown once. Every signed-in device has been logged out.
              </p>
            </div>
          ) : (
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-faint">
              The PIN is stored hashed and can&rsquo;t be looked up. Issue a new
              one if it&rsquo;s been forgotten.
            </p>
          )}

          {siblings.length > 0 && (
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-faint">
              Shared with {siblings.map((s) => s.name).join(", ")} — the PIN is
              what tells them apart at sign-in.
            </p>
          )}

          {lockedUntilLabel && (
            <p className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
              This number is locked after too many failed attempts, until{" "}
              {lockedUntilLabel}.
            </p>
          )}
        </div>

        <form action={action}>
          <input type="hidden" name="studentId" value={studentId} />
          <button className={buttonGhost} disabled={pending}>
            {pending ? "Issuing…" : "Issue new PIN"}
          </button>
        </form>
      </div>

      {state.error && (
        <div className="mt-5">
          <ErrorText>{state.error}</ErrorText>
        </div>
      )}
    </Card>
  );
}
