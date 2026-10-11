"use client";

import { useState, useSyncExternalStore } from "react";
import { focusable, input } from "@/app/_components/ui";
import { GIG_TYPES } from "../gig-types";

/**
 * What to charge for a gig, worked out from the musician's own numbers:
 * their hourly worth where they live, every hour the gig really takes,
 * the band, the costs and what kind of gig it is. No country's rates are
 * built in, so it works in any currency and any market.
 */

const CURRENCIES = ["EUR", "USD", "GBP", "DKK", "SEK", "NOK", "CHF", "CAD", "AUD", "NZD", "JPY", "INR", "BRL", "MXN", "ZAR", "PLN"];

/** A best guess from the browser's region, so most visitors start in their own money. */
const REGION_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", DK: "DKK", SE: "SEK", NO: "NOK", CH: "CHF", CA: "CAD", AU: "AUD", NZ: "NZD",
  JP: "JPY", IN: "INR", BR: "BRL", MX: "MXN", ZA: "ZAR", PL: "PLN",
};

function guessCurrency() {
  const region = new Intl.Locale(navigator.language).maximize().region ?? "";
  return REGION_CURRENCY[region] ?? "EUR";
}

const noSubscribe = () => () => {};


const HOURS = [
  { key: "prep", label: "Rehearsal and prep", fallback: 2, color: "bg-brand-300" },
  { key: "travel", label: "Travel, both ways", fallback: 1.5, color: "bg-brand-200" },
  { key: "setup", label: "Setup and soundcheck", fallback: 1, color: "bg-brand-400" },
  { key: "play", label: "Playing", fallback: 2, color: "bg-brand-600" },
  { key: "pack", label: "Packing up", fallback: 0.5, color: "bg-brand-500/40" },
] as const;

type HourKey = (typeof HOURS)[number]["key"];

/** Round to a sum you'd actually quote, within about 2%: 1,234 becomes 1,250, 15,700 becomes 15,500. */
function niceRound(value: number) {
  if (value <= 0) return 0;
  const step = Math.max(1, Math.pow(10, Math.floor(Math.log10(value)) - 1) / 2);
  return Math.round(value / step) * step;
}

export function GigCalculator() {
  const guessed = useSyncExternalStore(noSubscribe, guessCurrency, () => null);
  const [chosen, setChosen] = useState<string | null>(null);
  const currency = chosen ?? guessed ?? "EUR";

  // Empty until the musician enters it: any default would be some country's rate.
  const [rate, setRate] = useState<number | null>(null);
  const [hours, setHours] = useState<Record<HourKey, number>>(
    Object.fromEntries(HOURS.map((h) => [h.key, h.fallback])) as Record<HourKey, number>,
  );
  const [musicians, setMusicians] = useState(1);
  const [costs, setCosts] = useState(0);
  const [type, setType] = useState<(typeof GIG_TYPES)[number]["key"]>("bar");

  const money = new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 });
  const totalHours = HOURS.reduce((sum, h) => sum + hours[h.key], 0);
  const multiplier = GIG_TYPES.find((g) => g.key === type)!.multiplier;
  const time = totalHours * (rate ?? 0) * musicians;
  const fee = niceRound(time * multiplier + costs);
  const walkAway = niceRound(time + costs);
  const perMusician = niceRound((fee - costs) / musicians);
  // Pay only: the costs are passed on, not earned.
  const perStageHour = hours.play > 0 ? niceRound((fee - costs) / musicians / hours.play) : 0;
  const stageShare = totalHours > 0 ? Math.round((hours.play / totalHours) * 100) : 0;

  const label = "text-xs font-semibold uppercase tracking-[0.08em] text-muted";

  return (
    <div className="overflow-hidden rounded-4xl border border-line bg-surface shadow-soft">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <label className="block">
              <span className={label}>Your hourly rate</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                placeholder="Per hour"
                value={rate ?? ""}
                onChange={(event) =>
                  setRate(event.target.value === "" ? null : Math.max(0, Number(event.target.value) || 0))
                }
                className={`${input} mt-2`}
              />
            </label>
            <label className="block">
              <span className={label}>Currency</span>
              <select value={currency} onChange={(event) => setChosen(event.target.value)} className={`${input} mt-2`}>
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="-mt-3 text-xs leading-relaxed text-faint">
            What an hour of skilled work costs where you live. A good yardstick: what a local
            electrician or hairdresser charges.
          </p>

          <fieldset>
            <legend className={label}>Every hour the gig takes</legend>
            <div className="mt-3 space-y-3">
              {HOURS.map((h) => (
                <label key={h.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${h.color}`} />
                    {h.label}
                  </span>
                  <span className="w-14 text-right font-semibold tabular-nums">{hours[h.key]} h</span>
                  <input
                    type="range"
                    min={0}
                    max={h.key === "prep" ? 12 : 6}
                    step={0.5}
                    value={hours[h.key]}
                    onChange={(event) => setHours((current) => ({ ...current, [h.key]: Number(event.target.value) }))}
                    className="col-span-2 accent-brand-600"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Musicians</span>
              <input
                type="number"
                min={1}
                max={20}
                value={musicians}
                onChange={(event) => setMusicians(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
                className={`${input} mt-2`}
              />
            </label>
            <label className="block">
              <span className={label}>Costs</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={costs}
                onChange={(event) => setCosts(Math.max(0, Number(event.target.value) || 0))}
                className={`${input} mt-2`}
              />
            </label>
          </div>

          <fieldset>
            <legend className={label}>What kind of gig</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {GIG_TYPES.map((gig) => (
                <button
                  key={gig.key}
                  type="button"
                  aria-pressed={type === gig.key}
                  onClick={() => setType(gig.key)}
                  className={`rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors ${focusable} ${
                    type === gig.key
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-surface text-foreground hover:border-line-strong"
                  }`}
                >
                  <span className="block font-semibold">{gig.label}</span>
                  <span className={`text-xs ${type === gig.key ? "text-white/80" : "text-faint"}`}>×{gig.multiplier}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-brand-500/[0.06] p-5 sm:p-6" aria-live="polite">
          <div>
            <p className={label}>Quote this</p>
            {rate ? (
              <>
                <p className="mt-1 text-5xl font-semibold tracking-tight text-brand-700 tabular-nums">{money.format(fee)}</p>
                {musicians > 1 && (
                  <p className="mt-1 text-sm text-muted">{money.format(perMusician)} per musician, plus costs</p>
                )}
              </>
            ) : (
              <p className="mt-2 text-lg font-semibold text-foreground">Enter your hourly rate to see your price.</p>
            )}
          </div>

          <div>
            <p className={label}>Where the hours go</p>
            <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
              {HOURS.map((h) =>
                hours[h.key] > 0 ? (
                  <span key={h.key} className={h.color} style={{ width: `${(hours[h.key] / Math.max(totalHours, 0.5)) * 100}%` }} />
                ) : null,
              )}
            </div>
            <p className="mt-2 text-sm text-muted">
              {totalHours} hours in all. The stage is only{" "}
              <span className="font-semibold text-foreground">{stageShare}%</span> of the work.
            </p>
          </div>

          {rate ? (
            <>
              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface p-4">
                  <dt className="text-xs text-muted">Per hour on stage, each</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">{money.format(perStageHour)}</dd>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <dt className="text-xs text-muted">Walk-away price</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">{money.format(walkAway)}</dd>
                </div>
              </dl>
              <p className="text-xs leading-relaxed text-muted">
                The walk-away price pays every hour at your base rate, plus costs. Below it, you&rsquo;re
                paying to play.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
