"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createStudentAction, type NewStudentState } from "../../actions";
import { LevelSelect } from "@/app/_components/level-select";
import { Modal } from "@/app/_components/modal";
import { PhoneInput } from "@/app/_components/phone-input";
import { ErrorText, button, buttonQuiet, input, label } from "@/app/_components/ui";

function NewStudentForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState<NewStudentState, FormData>(
    createStudentAction,
    {},
  );

  // The PIN is stored hashed, so this is the only time it can be displayed.
  if (state.created) {
    return (
      <div className="px-6 py-6 sm:px-7">
        <p className="text-sm leading-relaxed text-muted text-pretty">
          Give them this PIN now — it&rsquo;s hashed and can&rsquo;t be shown
          again. If it&rsquo;s lost, issue a new one from their page.
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
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
          <button className={buttonQuiet} onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-7">
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
        <input className={input} id="parentEmail" name="parentEmail" type="email" />
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
  );
}

export function NewStudentModal() {
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
    <>
      <button className={button} onClick={() => setOpen(true)}>
        New student
      </button>

      <Modal
        open={open}
        onClose={close}
        title="Add a student"
        description="They'll sign in with a phone number and PIN — no email, no account."
      >
        <NewStudentForm key={formKey} onDone={close} />
      </Modal>
    </>
  );
}
