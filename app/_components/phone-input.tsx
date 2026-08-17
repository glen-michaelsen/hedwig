"use client";

import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { useEffect, useMemo, useState } from "react";
import { inputBase } from "./ui";

/** Offered first, since these are the studios we expect. */
const PRIORITY: CountryCode[] = ["DK", "NO", "SE", "DE", "NL", "GB", "US"];

const DEFAULT_COUNTRY: CountryCode = "DK";

/**
 * ISO 3166 code → regional indicator pair. Renders as a flag on macOS, iOS and
 * Android; Windows has no flag glyphs and falls back to the letters, which is
 * why the dial code is always shown next to it.
 */
function flagEmoji(country: string): string {
  return String.fromCodePoint(
    ...[...country.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function useCountryOptions() {
  return useMemo(() => {
    // Pinned to "en" deliberately. This list is prerendered on the server and
    // hydrated in the browser; leaving the locale undefined resolves to the
    // server's locale in one and the visitor's in the other, so a Danish
    // browser would hydrate "Danmark" over a server-rendered "Denmark".
    const names =
      typeof Intl !== "undefined" && "DisplayNames" in Intl
        ? new Intl.DisplayNames(["en"], { type: "region" })
        : null;

    const all = getCountries().map((code) => ({
      code,
      name: names?.of(code) ?? code,
      dial: getCountryCallingCode(code),
    }));
    all.sort((a, b) => a.name.localeCompare(b.name));

    return {
      priority: PRIORITY.map((code) => all.find((c) => c.code === code)).filter(
        (c) => c !== undefined,
      ),
      rest: all.filter((c) => !PRIORITY.includes(c.code)),
    };
  }, []);
}

/**
 * Country selector plus an as-you-type formatted national number. The value
 * submitted with the form is always E.164, in a hidden field — the visible
 * input is presentation only.
 */
export function PhoneInput({
  name,
  id,
  defaultValue,
  required,
  autoComplete = "tel",
  autoFocus,
  onValueChange,
}: {
  name: string;
  id?: string;
  /** An E.164 number, e.g. from the database or localStorage. */
  defaultValue?: string | null;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  onValueChange?: (e164: string) => void;
}) {
  const options = useCountryOptions();

  const parsedDefault = defaultValue
    ? parsePhoneNumberFromString(defaultValue)
    : null;

  const [country, setCountry] = useState<CountryCode>(
    parsedDefault?.country ?? DEFAULT_COUNTRY,
  );
  const [national, setNational] = useState(
    parsedDefault ? parsedDefault.formatNational() : "",
  );

  const e164 = useMemo(() => {
    const digits = national.replace(/\D/g, "");
    if (!digits) return "";
    return `+${getCountryCallingCode(country)}${digits}`;
  }, [country, national]);

  useEffect(() => {
    onValueChange?.(e164);
    // onValueChange is a render-scoped callback in every caller here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e164]);

  function handleNumberChange(raw: string) {
    // Someone pasting a full international number should move the selector
    // rather than end up with the dial code twice.
    if (raw.trim().startsWith("+")) {
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.country) {
        setCountry(parsed.country);
        setNational(parsed.formatNational());
        return;
      }
    }
    setNational(new AsYouType(country).input(raw));
  }

  function handleCountryChange(next: CountryCode) {
    setCountry(next);
    // Re-format what's already typed against the new country's rules.
    setNational(new AsYouType(next).input(national.replace(/\D/g, "")));
  }

  return (
    <div className="flex gap-2">
      <div className="relative w-24 shrink-0">
        {/* Closed state should read as just the flag and dial code, but a
            native select always paints the selected option's full label
            (flag + dial + country name) into its own closed box — there's
            no way to give the two states different text on the same
            element. So the select's own text is made transparent (options
            keep an explicit color so the opened list still shows names)
            and a pointer-events-none overlay renders the short label on
            top of it. */}
        <select
          className={`${inputBase} w-full text-transparent`}
          value={country}
          onChange={(event) =>
            handleCountryChange(event.target.value as CountryCode)
          }
          aria-label="Country code"
        >
          <optgroup label="Common">
            {options.priority.map((c) => (
              <option key={c.code} value={c.code} className="text-foreground">
                {flagEmoji(c.code)} +{c.dial} {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {options.rest.map((c) => (
              <option key={c.code} value={c.code} className="text-foreground">
                {flagEmoji(c.code)} +{c.dial} {c.name}
              </option>
            ))}
          </optgroup>
        </select>
        <div className="pointer-events-none absolute inset-0 flex items-center px-4 text-sm text-foreground">
          {flagEmoji(country)} +{getCountryCallingCode(country)}
        </div>
      </div>

      <input
        className={`${inputBase} flex-1 min-w-0`}
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        placeholder="Phone number"
        value={national}
        onChange={(event) => handleNumberChange(event.target.value)}
        required={required}
      />

      <input type="hidden" name={name} value={e164} />
    </div>
  );
}
