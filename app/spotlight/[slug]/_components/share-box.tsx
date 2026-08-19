"use client";

import { useState, useSyncExternalStore } from "react";
import { actionPill, actionPillBrand } from "@/app/_components/ui";

type IconProps = { className?: string };

function ShareIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.7 9 13.3 6M6.7 11l6.6 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8.5 11.5 11.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 13 4.5 15.5a2.5 2.5 0 0 1-3.5-3.5L3.5 9.5a2.5 2.5 0 0 1 3.5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 7l2.5-2.5a2.5 2.5 0 0 1 3.5 3.5L16.5 10.5a2.5 2.5 0 0 1-3.5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4.5 10.5 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PLATFORMS = [
  {
    label: "X",
    hrefFor: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Facebook",
    hrefFor: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "WhatsApp",
    hrefFor: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    label: "Email",
    hrefFor: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
] as const;

function subscribe() {
  return () => {};
}

function getUrl() {
  return window.location.href;
}

function getServerUrl() {
  return null;
}

function getCanNativeShare() {
  return typeof navigator.share === "function";
}

function getServerCanNativeShare() {
  return false;
}

/**
 * Renders nothing until mount: the share links are built from
 * `window.location.href`, which the server doesn't have.
 * `useSyncExternalStore` reads it without the render/commit split an effect
 * would need, so there's no placeholder flash to account for.
 */
export function ShareBox({ title }: { title: string }) {
  const url = useSyncExternalStore(subscribe, getUrl, getServerUrl);
  const canNativeShare = useSyncExternalStore(
    subscribe,
    getCanNativeShare,
    getServerCanNativeShare,
  );
  const [copied, setCopied] = useState(false);

  if (!url) return null;
  const shareUrl = url;

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url: shareUrl });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — the visible links still work.
    }
  }

  return (
    <div className="mt-16 border-t border-line pt-8">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
        Share
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className={actionPillBrand}
          >
            <ShareIcon />
            Share
          </button>
        )}

        {PLATFORMS.map((platform) => (
          <a
            key={platform.label}
            href={platform.hrefFor(url, title)}
            target="_blank"
            rel="noreferrer noopener"
            className={actionPill}
          >
            {platform.label}
          </a>
        ))}

        <button type="button" onClick={handleCopy} className={actionPill}>
          {copied ? <CheckIcon /> : <LinkIcon />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
