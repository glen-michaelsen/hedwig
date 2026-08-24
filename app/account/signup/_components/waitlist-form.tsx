"use client";

import { useActionState, useState } from "react";
import { joinWaitlistAction, type WaitlistFormState } from "../../actions";
import { WAITLIST_FEATURES } from "@/lib/waitlist";
import { Card, ErrorText, button, input, label } from "@/app/_components/ui";

export function WaitlistForm() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [state, action, pending] = useActionState<WaitlistFormState, FormData>(
    joinWaitlistAction,
    {},
  );

  function toggle(key: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (state.done) {
    return (
      <Card raised>
        <h2 className="text-xl font-semibold tracking-tight">
          You&rsquo;re on the list
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
          We&rsquo;ll be in touch at the email you gave us — either with an
          invite, or when it opens up for everyone.
        </p>
      </Card>
    );
  }

  return (
    <Card raised>
      <h2 className="text-xl font-semibold tracking-tight">
        Join the waitlist
      </h2>
      <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
        Tell us who you are and what you&rsquo;d use it for — it&rsquo;s what
        we look at when deciding who to invite next.
      </p>

      <form action={action} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="name">
              Your name
            </label>
            <input className={input} id="name" name="name" required />
          </div>
          <div>
            <label className={label} htmlFor="email">
              Email
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
        </div>

        <div>
          <label className={label} htmlFor="phone">
            Phone{" "}
            <span className="font-normal normal-case tracking-normal text-faint">
              (optional)
            </span>
          </label>
          <input
            className={input}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
          />
        </div>

        <div>
          <p className={label}>What would you use</p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {WAITLIST_FEATURES.map((feature) => {
              const active = selected.has(feature.key);
              return (
                <button
                  key={feature.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(feature.key)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    active
                      ? "border-brand-500 bg-brand-500/8 text-foreground"
                      : "border-line text-muted hover:border-line-strong hover:text-foreground"
                  }`}
                >
                  {feature.label}
                </button>
              );
            })}
          </div>
          {[...selected].map((key) => (
            <input key={key} type="hidden" name="features" value={key} />
          ))}
        </div>

        {/* Bots fill every field they find; people never see this one. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button
          className={`${button} w-full py-3.5 text-base`}
          disabled={pending}
        >
          {pending ? "Joining…" : "Join the waitlist"}
        </button>
      </form>
    </Card>
  );
}
