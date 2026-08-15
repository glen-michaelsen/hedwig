import "server-only";
import parsePhoneNumberFromString, {
  type CountryCode,
} from "libphonenumber-js";

/**
 * Assumed when a number arrives without a country code. The UI always sends a
 * country, so this is only a fallback for older rows and hand-entered data.
 */
export const DEFAULT_COUNTRY: CountryCode = "DK";

/**
 * Canonical E.164, or null if it isn't a valid number.
 *
 * Everything that touches a phone number — sign-in, student creation, edits —
 * goes through here, so the tutor typing "12 34 56 78" and the student typing
 * "+45 12 34 56 78" end up as the same stored string.
 */
export function normalizePhone(
  input: string,
  country: CountryCode = DEFAULT_COUNTRY,
): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (!parsed || !parsed.isValid()) return null;

  return parsed.number;
}

/** "+45 12 34 56 78" — for display only; storage is always E.164. */
export function formatPhone(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164);
  return parsed ? parsed.formatInternational() : e164;
}

/** Which country a stored number belongs to, for prefilling the selector. */
export function countryOfPhone(e164: string): CountryCode | null {
  const parsed = parsePhoneNumberFromString(e164);
  return parsed?.country ?? null;
}
