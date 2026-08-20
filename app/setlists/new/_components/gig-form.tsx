"use client";

import { useActionState } from "react";
import { createGigAction, type GigFormState } from "../../actions";
import { ErrorText, button, input, label } from "@/app/_components/ui";

/**
 * The booking as it's usually described: a night, and "three forty-fives".
 * The sets it creates are ordinary sets — renameable, retimeable, deletable
 * — this form only saves typing out the common case by hand.
 */
export function GigForm() {
  const [state, formAction, pending] = useActionState<GigFormState, FormData>(
    createGigAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className={label} htmlFor="name">
          Gig
        </label>
        <input
          className={input}
          id="name"
          name="name"
          placeholder="Jazzhus Montmartre"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="date">
            Date
          </label>
          <input className={input} id="date" name="date" type="date" />
        </div>
        <div>
          <label className={label} htmlFor="location">
            Location{" "}
            <span className="font-normal normal-case tracking-normal text-faint">
              (optional)
            </span>
          </label>
          <input
            className={input}
            id="location"
            name="location"
            placeholder="Copenhagen"
          />
        </div>
      </div>

      <div>
        <label className={label}>How long are you playing</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            className={`${input} w-20`}
            name="setCount"
            type="number"
            min={1}
            max={6}
            defaultValue={3}
            aria-label="Number of sets"
          />
          <span className="text-sm text-muted">sets of</span>
          <input
            className={`${input} w-24`}
            name="setMinutes"
            type="number"
            min={5}
            max={300}
            step={5}
            defaultValue={45}
            aria-label="Minutes per set"
          />
          <span className="text-sm text-muted">minutes</span>
        </div>
        <p className="mt-2 text-xs text-faint">
          You can rename, retime, add and remove sets afterwards.
        </p>
      </div>

      <div>
        <label className={label} htmlFor="notes">
          Notes{" "}
          <span className="font-normal normal-case tracking-normal text-faint">
            (optional)
          </span>
        </label>
        <textarea
          className={`${input} min-h-24 resize-y`}
          id="notes"
          name="notes"
          placeholder="Load-in 17:00, backline provided…"
        />
      </div>

      {state.error && <ErrorText>{state.error}</ErrorText>}

      <button className={button} disabled={pending}>
        {pending ? "Creating…" : "Create gig"}
      </button>
    </form>
  );
}
