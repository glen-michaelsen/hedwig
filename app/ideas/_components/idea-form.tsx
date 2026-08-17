"use client";

import { useActionState } from "react";
import { submitIdeaAction, type IdeaFormState } from "../actions";
import {
  Card,
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";

export function IdeaForm() {
  const [state, action, pending] = useActionState<IdeaFormState, FormData>(
    submitIdeaAction,
    {},
  );

  if (state.done) {
    return (
      <Card raised>
        <h2 className="text-xl font-semibold tracking-tight">Thank you</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
          Your idea has landed. Every one gets read, and the ones we take on
          show up on this page.
        </p>
      </Card>
    );
  }

  return (
    <Card raised>
      <h2 className="text-xl font-semibold tracking-tight">Share an idea</h2>
      <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
        No account needed. Tell us what would make your week easier.
      </p>

      <form action={action} className="mt-8 space-y-5">
        <div>
          <label className={label} htmlFor="area">
            What is it about
          </label>
          <select className={input} id="area" name="area" defaultValue="platform">
            <option value="platform">Trenodo overall</option>
            <option value="link-in-bio">Link in Bio</option>
            <option value="tutor">Tutor</option>
          </select>
        </div>

        <div>
          <label className={label} htmlFor="title">
            The idea
          </label>
          <input
            className={input}
            id="title"
            name="title"
            maxLength={120}
            placeholder="Let students book their own lessons"
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="detail">
            Anything more{" "}
            <span className="font-normal normal-case tracking-normal text-faint">
              (optional)
            </span>
          </label>
          <textarea
            className={`${input} min-h-32 resize-y`}
            id="detail"
            name="detail"
            maxLength={2000}
            placeholder="What are you doing today that this would replace?"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="name">
              Your name{" "}
              <span className="font-normal normal-case tracking-normal text-faint">
                (optional)
              </span>
            </label>
            <input className={input} id="name" name="name" maxLength={80} />
          </div>
          <div>
            <label className={label} htmlFor="email">
              Email{" "}
              <span className="font-normal normal-case tracking-normal text-faint">
                (optional)
              </span>
            </label>
            <input
              className={input}
              id="email"
              name="email"
              type="email"
              maxLength={200}
              placeholder="Only if you'd like a reply"
            />
          </div>
        </div>

        {/* Bots fill every field they find; people never see this one. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={button} disabled={pending}>
          {pending ? "Sending…" : "Send it in"}
        </button>
      </form>
    </Card>
  );
}
