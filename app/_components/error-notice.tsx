"use client";

import Link from "next/link";
import { useTransition } from "react";
import { button, buttonGhost } from "./ui";

export type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * What every error boundary shows. A failed load is nearly always a blip
 * on the way to the database, so "Try again" re-fetches the page from the
 * server rather than only re-rendering what's already here.
 */
export function ErrorNotice({
  error,
  retry,
  home = "/",
  homeLabel = "Go to the front page",
}: ErrorBoundaryProps & { home?: string; homeLabel?: string }) {
  const [retrying, startRetry] = useTransition();

  return (
    <div role="alert" className="mx-auto w-full max-w-md py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M9 18V5.5l10-2V16" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      </span>
      <h1 className="mt-6 text-xl font-semibold tracking-tight">
        This page hit a wrong note
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
        Something went wrong on our end. A second try usually does it.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className={button}
          disabled={retrying}
          onClick={() => startRetry(() => retry())}
        >
          {retrying ? "Trying again…" : "Try again"}
        </button>
        <Link className={buttonGhost} href={home}>
          {homeLabel}
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-faint">Reference {error.digest}</p>
      )}
    </div>
  );
}

/** For the signed-in tools: the rail stays, and home is the dashboard. */
export function DashboardError(props: ErrorBoundaryProps) {
  return <ErrorNotice {...props} home="/account" homeLabel="Back to Home" />;
}
