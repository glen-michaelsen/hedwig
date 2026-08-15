import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { containerNarrow } from "./ui";

/** Shared frame for the three sign-in surfaces. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden py-16 sm:py-24">
        <div className="brand-wash" />
        <div className={`${containerNarrow} max-w-md`}>{children}</div>
      </main>
    </>
  );
}
