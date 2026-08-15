"use client";

import { useState } from "react";
import { claimHandleAction } from "../actions";
import { checkHandle, normalizeHandle } from "@/lib/bio/handles";
import {
  Card,
  ErrorText,
  button,
  input,
  inputBase,
  label,
} from "@/app/_components/ui";
import { useAction } from "./use-action";

export function ClaimHandle({ defaultTitle }: { defaultTitle: string }) {
  const [handle, setHandle] = useState("");
  const { error, pending, onSubmit } = useAction((formData) =>
    claimHandleAction({}, formData).then((state) =>
      state.error ? { error: state.error } : undefined,
    ),
  );

  // Same check the server runs, so problems surface before submitting.
  const local = handle ? checkHandle(handle) : null;

  return (
    <Card raised className="max-w-xl">
      <h2 className="text-xl font-semibold tracking-tight">
        Pick your link
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        This is the address you&rsquo;ll put in your bio. You can change it
        later — the old one keeps working.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div>
          <label className={label} htmlFor="handle">
            Your handle
          </label>
          <div className="flex items-stretch gap-0">
            <span
              className={`${inputBase} rounded-r-none border-r-0 text-muted`}
              aria-hidden
            >
              trenodo.com/@
            </span>
            <input
              className={`${inputBase} flex-1 rounded-l-none`}
              id="handle"
              name="handle"
              value={handle}
              onChange={(event) =>
                setHandle(normalizeHandle(event.target.value))
              }
              placeholder="yourname"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>
          {local && !local.ok && (
            <p className="mt-2 text-xs text-rose-600">{local.error}</p>
          )}
        </div>

        <div>
          <label className={label} htmlFor="title">
            Display name
          </label>
          <input
            className={input}
            id="title"
            name="title"
            defaultValue={defaultTitle}
            required
          />
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <button
          className={button}
          disabled={pending || (local !== null && !local.ok)}
        >
          {pending ? "Creating…" : "Create my page"}
        </button>
      </form>
    </Card>
  );
}
