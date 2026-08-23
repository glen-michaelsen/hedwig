"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/**
 * A submit button that says what it's doing.
 *
 * Server-action forms give no feedback of their own: the click looks
 * ignored until the action finishes and the page re-renders, which on a
 * page that reloads a release, its assets and its statistics can be several
 * seconds. `useFormStatus` reads the pending state of the form this sits
 * in — which is why it has to be its own component, inside that form.
 */
export function SubmitButton({
  children,
  pendingLabel,
  className,
  ...rest
}: {
  children: ReactNode;
  /** Shown while the action runs. Defaults to the label plus an ellipsis. */
  pendingLabel?: ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"button">, "className" | "children">) {
  const { pending } = useFormStatus();

  return (
    <button
      {...rest}
      className={className}
      disabled={pending || rest.disabled}
      aria-busy={pending || undefined}
    >
      {pending ? (pendingLabel ?? <>{children}…</>) : children}
    </button>
  );
}
