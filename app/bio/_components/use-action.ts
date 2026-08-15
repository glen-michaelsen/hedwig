"use client";

import { useState, useTransition, type FormEvent } from "react";

type Action = (formData: FormData) => Promise<{ error?: string } | void>;

/**
 * Submits a form to a server action by hand so the result can be shown
 * inline. Every bio form does this, hence the shared hook.
 */
export function useAction(action: Action, onDone?: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read the form before the transition — currentTarget is gone by then.
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        setSaved(false);
        return;
      }
      setError(null);
      setSaved(true);
      onDone?.();
    });
  }

  return { error, pending, saved, onSubmit, setError };
}
