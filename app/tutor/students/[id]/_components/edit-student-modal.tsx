"use client";

import { useState, useTransition } from "react";
import { updateStudentAction } from "../../../actions";
import { LevelSelect } from "@/app/_components/level-select";
import { Modal } from "@/app/_components/modal";
import { PhoneInput } from "@/app/_components/phone-input";
import {
  ErrorText,
  button,
  buttonGhost,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

export function EditStudentModal({
  student,
}: {
  student: {
    id: string;
    name: string;
    phone: string | null;
    instrument: string | null;
    level: string | null;
    parentEmail: string | null;
    active: boolean;
  };
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Submitted by hand rather than with a form action, so the modal can
    // close itself once the save actually succeeds.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateStudentAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setOpen(false);
    });
  }

  return (
    <>
      <button className={buttonGhost} onClick={() => setOpen(true)}>
        Edit details
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Edit ${student.name}`}
        description="Name, sign-in number and the rest of their record."
      >
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-7"
        >
          <input type="hidden" name="studentId" value={student.id} />

          <div className="sm:col-span-2">
            <label className={label} htmlFor="edit-name">
              Name
            </label>
            <input
              className={input}
              id="edit-name"
              name="name"
              defaultValue={student.name}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="edit-phone">
              Phone number{" "}
              <span className="font-normal normal-case tracking-normal text-faint">
                (what they sign in with)
              </span>
            </label>
            <PhoneInput
              id="edit-phone"
              name="phone"
              defaultValue={student.phone}
              required
            />
          </div>

          <div>
            <label className={label} htmlFor="edit-instrument">
              Instrument
            </label>
            <input
              className={input}
              id="edit-instrument"
              name="instrument"
              defaultValue={student.instrument ?? ""}
            />
          </div>

          <div>
            <label className={label} htmlFor="edit-level">
              Level
            </label>
            <LevelSelect id="edit-level" defaultValue={student.level} />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="edit-email">
              Email
            </label>
            <input
              className={input}
              id="edit-email"
              name="parentEmail"
              type="email"
              defaultValue={student.parentEmail ?? ""}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-muted px-4 py-3.5 text-sm text-muted sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-600"
              name="active"
              defaultChecked={student.active}
            />
            Active — unchecking blocks their sign-in
          </label>

          {error && (
            <div className="sm:col-span-2">
              <ErrorText>{error}</ErrorText>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button className={button} disabled={pending}>
              {pending ? "Saving…" : "Save details"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
