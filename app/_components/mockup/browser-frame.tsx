"use client";

import type { CSSProperties, ReactNode } from "react";

/** Desktop counterpart to PhoneFrame — same real-UI-scaled-down mechanism, a browser chrome instead of a phone bezel. */
export function BrowserFrame({
  children,
  screenStyle,
  screenClassName = "",
  nativeWidth = 900,
  scale = 0.42,
  frameWidth = 420,
  screenHeight = 320,
  url = "trenodo.com",
}: {
  children: ReactNode;
  screenStyle?: CSSProperties;
  screenClassName?: string;
  nativeWidth?: number;
  scale?: number;
  frameWidth?: number;
  screenHeight?: number;
  url?: string;
}) {
  return (
    <div
      className="rise-in overflow-hidden rounded-2xl border border-black/10 bg-neutral-900 shadow-float"
      style={{ width: frameWidth }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-full bg-white/10 px-3 py-1 text-center text-[11px] text-white/60">
          {url}
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ height: screenHeight }}
      >
        <div
          style={screenStyle}
          className={`pointer-events-none flex h-full w-full items-start justify-center overflow-hidden ${screenClassName}`}
        >
          <div
            className="shrink-0 origin-top"
            style={{ width: nativeWidth, transform: `scale(${scale})` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
