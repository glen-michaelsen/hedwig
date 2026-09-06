"use client";

import { useActionState, useState } from "react";
import { issueNewPinAction, type NewPinState } from "../../../actions";
import { Modal } from "@/app/_components/modal";
import {
  Card,
  ErrorText,
  button,
  buttonGhost,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

function randomPin(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

function IssuePinForm({
  studentId,
  onDone,
}: {
  studentId: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<NewPinState, FormData>(
    issueNewPinAction,
    {},
  );
  // Prefilled once per open, not regenerated on every render, so an edited
  // value doesn't get clobbered by a fresh random one.
  const [suggestedPin] = useState(randomPin);

  if (state.pin) {
    return (
      <div className="px-6 py-6 sm:px-7">
        <p className="text-sm leading-relaxed text-muted text-pretty">
          Give them this PIN now — it&rsquo;s hashed and can&rsquo;t be shown
          again. Every signed-in device has been logged out.
        </p>
        <div className="mt-6 rounded-3xl bg-brand-500/10 p-6">
          <p className={label}>New PIN</p>
          <p className="font-mono text-3xl tracking-[0.3em] text-brand-700 dark:text-brand-300">
            {state.pin}
          </p>
        </div>
        <div className="mt-8">
          <button className={buttonQuiet} onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 px-6 py-6 sm:px-7">
      <input type="hidden" name="studentId" value={studentId} />
      <div>
        <label className={label} htmlFor="pin">
          New PIN
        </label>
        <input
          className={`${input} text-center font-mono text-2xl tracking-[0.4em]`}
          id="pin"
          name="pin"
          defaultValue={suggestedPin}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          autoComplete="off"
          required
        />
        <p className="mt-2 text-xs text-faint">
          Prefilled with a random PIN — edit it if you&rsquo;d rather set one
          yourself.
        </p>
      </div>

      {state.error && <ErrorText>{state.error}</ErrorText>}

      <div>
        <button className={button} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

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
  const [open, setOpen] = useState(false);
  // Remounting the form on each open clears the previous submission's
  // result — the modal can otherwise reopen showing a PIN it already
  // handed out.
  const [formKey, setFormKey] = useState(0);

  function close() {
    setOpen(false);
    setFormKey((key) => key + 1);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className={label}>Signs in with</p>
          <p className="font-mono text-xl">{phone ?? "—"}</p>

          <p className="mt-3 max-w-sm text-xs leading-relaxed text-faint">
            The PIN is stored hashed and can&rsquo;t be looked up. Issue a new
            one if it&rsquo;s been forgotten.
          </p>

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

        <button className={buttonGhost} onClick={() => setOpen(true)}>
          Issue new PIN
        </button>
      </div>

      <Modal
        open={open}
        onClose={close}
        title="Issue a new PIN"
        description="Set it, or keep the random one — saving logs out every signed-in device."
      >
        <IssuePinForm key={formKey} studentId={studentId} onDone={close} />
      </Modal>
    </Card>
  );
}
