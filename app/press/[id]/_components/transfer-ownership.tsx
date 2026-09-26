"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Modal } from "@/app/_components/modal";
import { ErrorText, actionPill, button, buttonQuiet, focusable, input } from "@/app/_components/ui";
import {
  searchAccountsAction,
  transferReleaseAction,
  type AccountMatch,
} from "../../actions";

/**
 * Admin only (the page renders it only for admins, and both actions check
 * again). Search by name or email, pick an account, confirm.
 */
export function TransferOwnership({
  releaseId,
  releaseTitle,
  currentOwnerId,
}: {
  releaseId: string;
  releaseTitle: string;
  currentOwnerId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AccountMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<AccountMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Only the newest search may fill the list: an older, slower answer
  // arriving late must not overwrite it.
  const latest = useRef(0);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setPicked(null);
    setError(null);
  }

  function onSearch(value: string) {
    setQuery(value);
    setPicked(null);
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      const ticket = ++latest.current;
      const found = await searchAccountsAction(value);
      if (ticket !== latest.current) return;
      setResults(found.filter((account) => account.id !== currentOwnerId));
      setSearching(false);
    }, 250);
  }

  function transfer() {
    if (!picked) return;
    setError(null);
    startTransition(async () => {
      const result = await transferReleaseAction(releaseId, picked.id);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      close();
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" className={actionPill} onClick={() => setOpen(true)}>
        Transfer ownership
      </button>

      <Modal
        open={open}
        onClose={close}
        title="Transfer ownership"
        description={`Give "${releaseTitle}" to another account. Files, stats, coverage and its Spotlight go with it.`}
      >
        <div className="space-y-4 px-6 py-6 sm:px-7">
          {picked ? (
            <>
              <div className="rounded-3xl border border-line bg-surface-muted/50 px-5 py-4">
                <p className="text-sm text-muted">New owner</p>
                <p className="mt-1 font-semibold">{picked.name}</p>
                <p className="text-sm text-muted">{picked.email}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted text-pretty">
                The press kit moves to their Press Kit list straight away, and
                leaves the current owner&rsquo;s. Its public link stays the same.
              </p>
              {error && <ErrorText>{error}</ErrorText>}
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className={button} onClick={transfer} disabled={pending}>
                  {pending ? "Transferring…" : `Transfer to ${picked.name}`}
                </button>
                <button type="button" className={buttonQuiet} onClick={() => setPicked(null)}>
                  Back
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                className={input}
                type="search"
                autoFocus
                value={query}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search by name or email"
                aria-label="Search accounts by name or email"
              />
              {query.trim().length < 2 ? (
                <p className="text-sm text-faint">Type at least two letters.</p>
              ) : searching && results.length === 0 ? (
                <p className="text-sm text-faint">Searching…</p>
              ) : results.length === 0 ? (
                <p className="text-sm text-faint">No accounts match &ldquo;{query}&rdquo;.</p>
              ) : (
                <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line">
                  {results.map((account) => (
                    <li key={account.id}>
                      <button
                        type="button"
                        onClick={() => setPicked(account)}
                        className={`block w-full px-5 py-3 text-left transition-colors hover:bg-surface-muted ${focusable}`}
                      >
                        <span className="block text-sm font-medium">{account.name}</span>
                        <span className="block text-xs text-muted">{account.email}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
