"use client";

import { useActionState, useState, useTransition } from "react";
import {
  deleteGigAction,
  updateGigAction,
  type GigFormState,
} from "../../actions";
import { Modal } from "@/app/_components/modal";
import {
  Card,
  ErrorText,
  actionPill,
  button,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

/** The gig's own details, kept out of the way of the setlist itself. */
export function GigDetails({
  gigId,
  name,
  date,
  location,
  notes,
}: {
  gigId: string;
  name: string;
  date: string | null;
  location: string | null;
  notes: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pendingDelete, startDelete] = useTransition();

  const [state, formAction, pending] = useActionState<GigFormState, FormData>(
    async (previous, formData) => {
      const result = await updateGigAction(previous, formData);
      if (!result.error) setOpen(false);
      return result;
    },
    {},
  );

  return (
    <>
      {notes ? (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="min-w-0 text-sm leading-relaxed text-muted text-pretty">
              {notes}
            </p>
            <button
              type="button"
              className={actionPill}
              onClick={() => setOpen(true)}
            >
              Edit details
            </button>
          </div>
        </Card>
      ) : (
        <button
          type="button"
          className={actionPill}
          onClick={() => setOpen(true)}
        >
          Edit details
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Gig details">
        <form action={formAction} className="space-y-5 px-6 py-6 sm:px-7">
          <input type="hidden" name="gigId" value={gigId} />

          <div>
            <label className={label} htmlFor="gig-name">
              Gig
            </label>
            <input
              className={input}
              id="gig-name"
              name="name"
              defaultValue={name}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="gig-date">
                Date
              </label>
              <input
                className={input}
                id="gig-date"
                name="date"
                type="date"
                defaultValue={date ?? ""}
              />
            </div>
            <div>
              <label className={label} htmlFor="gig-location">
                Location
              </label>
              <input
                className={input}
                id="gig-location"
                name="location"
                defaultValue={location ?? ""}
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="gig-notes">
              Notes
            </label>
            <textarea
              className={`${input} min-h-24 resize-y`}
              id="gig-notes"
              name="notes"
              defaultValue={notes ?? ""}
            />
          </div>

          {state.error && <ErrorText>{state.error}</ErrorText>}

          <div className="flex flex-wrap items-center gap-3">
            <button className={button} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className={`${actionPill} ml-auto hover:text-rose-700`}
              onClick={() => setConfirming(true)}
            >
              Delete gig
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Delete “${name}”?`}
      >
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <p className="text-sm leading-relaxed text-muted">
            The sets and every song in them go with it. This can&rsquo;t be
            undone.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={`${button} bg-rose-600 shadow-none hover:bg-rose-500`}
              disabled={pendingDelete}
              onClick={() => {
                const formData = new FormData();
                formData.set("gigId", gigId);
                startDelete(() => deleteGigAction(formData));
              }}
            >
              {pendingDelete ? "Deleting…" : "Delete it"}
            </button>
            <button
              type="button"
              className={buttonQuiet}
              onClick={() => setConfirming(false)}
            >
              Keep it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
