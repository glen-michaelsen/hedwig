"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * A phone bezel around real, full-size product UI shrunk to fit — not a
 * screenshot. `children` is laid out at `nativeWidth` (its real size) and
 * then scaled down as one block, so whatever's inside never needs its own
 * "mockup" sizing classes.
 *
 * It's centered before the scale is applied: scaling happens around the
 * transformed box's own midpoint, which only lines up with the frame's
 * actual center if the box was centered to begin with — a fixed-width
 * block just laid out on its own left-aligns and drags everything right
 * of true center once scaled.
 */
export function PhoneFrame({
  children,
  screenStyle,
  screenClassName = "",
  nativeWidth = 340,
  scale = 0.62,
  frameWidth = 248,
  screenHeight = 536,
}: {
  children: ReactNode;
  screenStyle?: CSSProperties;
  screenClassName?: string;
  nativeWidth?: number;
  scale?: number;
  frameWidth?: number;
  screenHeight?: number;
}) {
  return (
    <div
      className="rise-in relative mx-auto rounded-[2.75rem] bg-neutral-900 p-2.5 shadow-float"
      style={{ width: frameWidth }}
    >
      <div
        className="relative overflow-hidden rounded-[2.25rem]"
        style={{ height: screenHeight }}
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-2.5 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black"
        />

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
