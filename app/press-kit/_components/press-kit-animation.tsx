"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrowserFrame } from "@/app/_components/mockup/browser-frame";

/**
 * The Press Kit page's hero: a press kit being made, in a loop. Basics are
 * typed in, the cover drops in, three press photos arrive, and the kit goes
 * live with its link copied.
 *
 * The release is real: ISSE's "Vita Nova" EP, with its actual cover and
 * press photos (public/images/press-kit-demo), supplied by Glen for this page.
 *
 * One clock drives everything: every element's state is a function of how
 * far into the loop we are, so there's no chain of timers to drift. The
 * clock only runs while the frame is on screen, and people who ask their
 * system for less motion get the finished press kit as a still.
 */

const LOOP_MS = 15_000;
/** Where the still (reduced motion) stops: the published kit, link copied. */
const STILL_MS = 13_500;

const SCENES = [
  { label: "Basics", start: 0 },
  { label: "Cover", start: 4_200 },
  { label: "Press photos", start: 7_200 },
  { label: "Share", start: 10_400 },
] as const;

const COVER = "/images/press-kit-demo/vita-nova-cover.jpg";
const PHOTOS = [
  "/images/press-kit-demo/isse-press-1.jpg",
  "/images/press-kit-demo/isse-press-2.jpg",
  "/images/press-kit-demo/isse-press-3.jpg",
];

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The part of `text` typed by time `t`, typing from `start` at `speed` ms a letter. */
function typed(text: string, t: number, start: number, speed: number) {
  if (t < start) return { value: "", active: false };
  const count = Math.min(text.length, Math.floor((t - start) / speed) + 1);
  return { value: text.slice(0, count), active: count < text.length || t < start + text.length * speed + 250 };
}

function Field({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <div
        className={`mt-1.5 flex h-11 items-center rounded-2xl border bg-surface px-4 text-[15px] transition-colors ${
          active ? "border-brand-400 ring-4 ring-brand-500/12" : "border-line"
        }`}
      >
        {value}
        {active && <span className="ml-px h-4 w-px animate-pulse bg-brand-600" />}
      </div>
    </div>
  );
}

function Progress({ done }: { done: boolean }) {
  return (
    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted">
      <div
        className="h-full rounded-full bg-brand-500 transition-[width] duration-1000 ease-out"
        style={{ width: done ? "100%" : "0%" }}
      />
    </div>
  );
}

function Check({ show, children }: { show: boolean; children: string }) {
  return (
    <p className={`mt-3 text-sm font-medium text-emerald-700 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      ✓ {children}
    </p>
  );
}

export function PressKitAnimation() {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [elapsed, setElapsed] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (rootRef.current) observer.observe(rootRef.current);

    const tick = (now: number) => {
      const step = now - last;
      last = now;
      if (visible && !document.hidden) setElapsed((value) => (value + step) % LOOP_MS);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reducedMotion]);

  const t = reducedMotion ? STILL_MS : elapsed;
  const scene = SCENES.findLastIndex((item) => t >= item.start);

  const title = typed("Vita Nova", t, 400, 70);
  const artist = typed("ISSE", t, 1_250, 80);
  const date = typed("20 August 2026", t, 2_050, 45);
  const pressed = t > 3_000 && t < 3_250;
  const published = t > 11_300;

  const sceneClass = (index: number) =>
    `absolute inset-0 px-9 py-9 transition-all duration-500 ${
      scene === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
    }`;

  return (
    <div ref={rootRef} className="w-full">
      <BrowserFrame
        screenClassName="bg-background"
        frameWidth={460}
        screenHeight={400}
        nativeWidth={560}
        scale={0.82}
        url={scene === 0 ? "trenodo.com/press/new" : "trenodo.com/press/vita-nova"}
      >
        {/* A fixed-height stage (the screen's height at this scale), so
            the stacked scenes can cross-fade in place. */}
        <div className="relative h-[488px] text-foreground">
          <div className={sceneClass(0)}>
            <div className="space-y-4">
              <Field label="Title" {...title} />
              <Field label="Artist" {...artist} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Type</p>
                <div className="mt-1.5 flex gap-2">
                  {["Single", "EP", "Album"].map((kind) => {
                    const selected = kind === "EP" && t > 1_800;
                    return (
                      <span
                        key={kind}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                          selected
                            ? "border-brand-500/40 bg-brand-500/12 text-brand-700"
                            : "border-line bg-surface text-muted"
                        }`}
                      >
                        {kind}
                      </span>
                    );
                  })}
                </div>
              </div>
              <Field label="Release date" {...date} />
              <span
                className={`inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-brand transition-transform ${
                  pressed ? "scale-95" : ""
                }`}
              >
                Create release
              </span>
            </div>
          </div>

          <div className={sceneClass(1)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Album cover</p>
            <div className="relative mt-3 aspect-square w-64 overflow-hidden rounded-3xl border-2 border-dashed border-line-strong bg-surface-muted/40">
              <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted">
                Drop your cover here
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={COVER}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                  t > 4_600 ? "translate-y-0" : "-translate-y-full"
                }`}
              />
            </div>
            <Progress done={t > 4_600} />
            <Check show={t > 5_800}>Cover uploaded at full size</Check>
          </div>

          <div className={sceneClass(2)}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Press photos</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {PHOTOS.map((photo, index) => {
                const shown = t > 7_600 + index * 400;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={photo}
                    src={photo}
                    alt=""
                    className={`aspect-4/5 w-full rounded-2xl object-cover shadow-soft transition-all duration-500 ${
                      shown ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    }`}
                  />
                );
              })}
            </div>
            <Progress done={t > 7_600} />
            <Check show={t > 9_400}>3 press photos · Photo: Christian Krog</Check>
          </div>

          <div className={sceneClass(3)}>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={COVER} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-soft" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-semibold tracking-tight">Vita Nova</p>
                <p className="mt-0.5 text-sm text-muted">ISSE · EP · 20 August 2026</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  published ? "bg-emerald-500/12 text-emerald-700" : "bg-rose-500/12 text-rose-700"
                }`}
              >
                {published ? "Published" : "Unpublished"}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {PHOTOS.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={photo} src={photo} alt="" className="aspect-4/5 w-full rounded-2xl object-cover shadow-soft" />
              ))}
            </div>
            <div
              className={`absolute inset-x-0 bottom-8 mx-auto w-fit rounded-full bg-foreground px-5 py-2.5 text-sm text-white transition-all duration-300 ${
                t > 12_000 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              Link copied · trenodo.com/kit/isse-vita-nova
            </div>
          </div>
        </div>
      </BrowserFrame>

      <ol className="mt-5 flex flex-wrap justify-center gap-2" aria-hidden="true">
        {SCENES.map((item, index) => (
          <li
            key={item.label}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${
              index === scene
                ? "bg-brand-500/12 text-brand-700"
                : index < scene
                  ? "text-foreground"
                  : "text-faint"
            }`}
          >
            {index + 1} · {item.label}
          </li>
        ))}
      </ol>
      <p className="sr-only">
        An example press kit being made on Trenodo: the release details, the
        cover, three press photos, and then publishing it and copying the link.
      </p>
    </div>
  );
}
