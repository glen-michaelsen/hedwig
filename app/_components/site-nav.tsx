"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { featureItems, loginItems, type NavItem } from "./nav-items";
import { button, focusable } from "./ui";

const triggerBase = `inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${focusable}`;

/**
 * A menu button and its panel.
 *
 * Opens on click rather than hover: a hover menu has no equivalent on a
 * touch screen, where the first tap only ever reads as a hover and the
 * second one has to land somewhere the menu has already moved.
 */
function Dropdown({
  label,
  items,
  align = "left",
}: {
  label: string;
  items: NavItem[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Navigating with the menu open would otherwise leave it hanging over the
  // new page — App Router keeps the header mounted across routes. Done
  // during render rather than in an effect so the menu is already closed in
  // the same pass that draws the new route.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = items.some((item) => pathname.startsWith(item.href));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`${triggerBase} ${
          open || active
            ? "bg-surface-muted text-foreground"
            : "text-muted hover:bg-surface-muted hover:text-foreground"
        }`}
      >
        {label}
        <Chevron open={open} />
      </button>

      {open && (
        <div
          id={panelId}
          className={`absolute top-full z-50 mt-2 w-72 overflow-hidden rounded-3xl border border-line bg-surface p-2 shadow-float ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 transition-colors hover:bg-surface-muted ${focusable}`}
            >
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Desktop nav. Hidden on small screens, where MobileNav takes over. */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <Dropdown label="Features" items={featureItems} />
      <Link
        href="/ideas"
        className={`${triggerBase} ${
          pathname.startsWith("/ideas")
            ? "bg-surface-muted text-foreground"
            : "text-muted hover:bg-surface-muted hover:text-foreground"
        }`}
      >
        Ideas
      </Link>
      <span className="mx-2 h-6 w-px bg-line" aria-hidden="true" />
      <Dropdown label="Log in" items={loginItems} align="right" />
    </nav>
  );
}

/**
 * Small screens get one panel with everything already expanded — nested
 * dropdowns inside a drawer cost a tap each and hide the very thing the
 * drawer was opened to find.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();

  // Same reset-on-navigation as Dropdown, for the same reason.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className={`grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-foreground shadow-soft ${focusable}`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          {open ? (
            <path
              d="m5 5 10 10M15 5 5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-18 z-40 cursor-default bg-foreground/20 backdrop-blur-sm"
          />
          <div
            id={panelId}
            className="fixed inset-x-0 top-18 z-50 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-surface px-6 py-6 shadow-float"
          >
            <MobileSection title="Features" items={featureItems} />

            <Link
              href="/ideas"
              className={`mt-2 block rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-muted ${focusable}`}
            >
              Ideas
              <span className="mt-0.5 block text-xs font-normal text-muted">
                Tell us what to build next.
              </span>
            </Link>

            <MobileSection title="Log in" items={loginItems} />

            <Link
              href="/account/signup"
              className={`${button} mt-6 w-full`}
              onClick={() => setOpen(false)}
            >
              Create an account
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function MobileSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="mt-2 first:mt-0">
      <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-[0.1em] text-faint">
        {title}
      </p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block rounded-2xl px-4 py-3 transition-colors hover:bg-surface-muted ${focusable}`}
        >
          <span className="block text-sm font-medium">{item.label}</span>
          <span className="mt-0.5 block text-xs text-muted">
            {item.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
