"use client";

import { useActionState, useState } from "react";
import { createInviteAction, type InviteFormState } from "../actions";
import { CopyLink } from "./copy-link";
import { Modal } from "@/app/_components/modal";
import {
  ErrorText,
  button,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

/**
 * The invite email is sent server-side the moment the invite is created
 * (see actions.ts) — this just reports what happened and keeps the link
 * around to copy, since a failed send shouldn't leave the admin with
 * nothing to fall back on. The form and the "here's your invite" result
 * share one modal: closing either one resets it, so reopening always
 * starts from a blank email field.
 */
export function InviteMusicianButton() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<InviteFormState, FormData>(
    createInviteAction,
    {},
  );

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button type="button" className={button} onClick={() => setOpen(true)}>
        Invite a musician
      </button>

      <Modal open={open} onClose={close} title="Invite a musician">
        <div className="px-6 py-6 sm:px-7">
          {state.link ? (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-muted">
                {state.emailSent ? (
                  <>
                    Emailed{" "}
                    <span className="font-medium text-foreground">{state.email}</span>{" "}
                    their invite. Signs them straight into a signup form
                    addressed to that email.
                  </>
                ) : (
                  <>
                    Invited{" "}
                    <span className="font-medium text-foreground">{state.email}</span>,
                    but the email didn&rsquo;t go out — send them this link
                    yourself.
                  </>
                )}
              </p>
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-muted px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {state.link}
                </span>
                <CopyLink url={state.link} />
              </div>
            </div>
          ) : (
            <form action={action} className="space-y-5">
              <div>
                <label className={label} htmlFor="invite-email">
                  Their email
                </label>
                <input
                  className={input}
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  autoFocus
                  required
                />
                <p className="mt-2 text-xs text-faint">
                  The link only works for this address, and expires in 14
                  days.
                </p>
              </div>

              {state.error && <ErrorText>{state.error}</ErrorText>}

              <div className="flex items-center gap-3">
                <button className={button} disabled={pending}>
                  {pending ? "Creating…" : "Create invite"}
                </button>
                <button type="button" className={buttonQuiet} onClick={close}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
