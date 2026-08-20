"use client";

import { useRef, useState } from "react";
import { buttonGhost, focusable } from "@/app/_components/ui";

/**
 * Drag the header photo to choose which part of it survives the crop.
 *
 * The preview is the same 21:9 band the article uses, so what you drag is
 * what runs at the top of the page — not an approximation of it. The value
 * is a CSS object-position, which means the public page needs no code to
 * apply it beyond a style attribute.
 *
 * Dragging the width of the box sweeps the full range, which matches the
 * feel of moving the image itself rather than a slider under it.
 */
export function HeaderPosition({
  src,
  x,
  y,
  onChange,
}: {
  src: string;
  x: number;
  y: number;
  onChange: (next: { x: number; y: number }) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ pointerX: 0, pointerY: 0, x: 50, y: 50 });

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x,
      y,
    };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const box = boxRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    // Moving right should reveal what's on the right, which means the
    // object-position percentage goes up as the pointer goes left.
    const dx = ((start.current.pointerX - event.clientX) / rect.width) * 100;
    const dy = ((start.current.pointerY - event.clientY) / rect.height) * 100;

    onChange({
      x: Math.min(100, Math.max(0, Math.round(start.current.x + dx))),
      y: Math.min(100, Math.max(0, Math.round(start.current.y + dy))),
    });
  }

  function stop(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }

  return (
    <div>
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        className={`relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-surface-muted ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: `${x}% ${y}%` }}
        />

        {!dragging && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white">
            Drag to reposition
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange({ x: 50, y: 50 })}
          className={`${buttonGhost} !py-1.5 text-xs ${focusable}`}
        >
          Centre
        </button>
        <span className="text-xs tabular-nums text-faint">
          {x}% / {y}%
        </span>
      </div>

      <input type="hidden" name="headerFocusX" value={x} />
      <input type="hidden" name="headerFocusY" value={y} />
    </div>
  );
}
