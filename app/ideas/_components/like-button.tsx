"use client";

import { useState, useTransition } from "react";
import { toggleVoteAction } from "../actions";
import { focusable } from "@/app/_components/ui";

/**
 * Optimistic on purpose: the count moves on the press, before the round
 * trip. A vote is not worth making anyone wait for, and if the server
 * disagrees the count snaps back with the reason.
 */
export function LikeButton({
  ideaId,
  votes,
  voted,
}: {
  ideaId: string;
  votes: number;
  voted: boolean;
}) {
  const [state, setState] = useState({ votes, voted });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // The page revalidates after a vote, so new props arrive with the true
  // count. Adopt them during render rather than letting local state win.
  const [fromServer, setFromServer] = useState({ votes, voted });
  if (fromServer.votes !== votes || fromServer.voted !== voted) {
    setFromServer({ votes, voted });
    setState({ votes, voted });
  }

  function press() {
    const previous = state;
    setState({
      voted: !previous.voted,
      votes: previous.votes + (previous.voted ? -1 : 1),
    });
    setError(null);

    startTransition(async () => {
      const result = await toggleVoteAction(ideaId);
      if (result.error) {
        setState(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={press}
        disabled={pending}
        aria-pressed={state.voted}
        aria-label={state.voted ? "Remove your vote" : "Vote for this idea"}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium leading-none transition-all ${
          state.voted
            ? "border-brand-500/30 bg-brand-500/12 text-brand-700 dark:text-brand-300"
            : "border-line bg-surface text-muted hover:border-line-strong hover:text-foreground"
        } ${focusable}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
          <path
            d="M10 16.5s-6-3.7-6-7.6A3.4 3.4 0 0 1 10 6.6a3.4 3.4 0 0 1 6 2.3c0 3.9-6 7.6-6 7.6Z"
            fill={state.voted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        <span className="tabular-nums">{state.votes}</span>
      </button>

      {error && <span className="text-xs text-muted">{error}</span>}
    </div>
  );
}
