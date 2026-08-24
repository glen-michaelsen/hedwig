/**
 * The tools someone can say they're interested in when joining the
 * waitlist. Not server-only: the client form needs these labels too.
 */
export const WAITLIST_FEATURES = [
  { key: "tutor", label: "Tutor" },
  { key: "bio", label: "Link in Bio" },
  { key: "press", label: "Press Kit" },
  { key: "setlists", label: "Setlists" },
] as const;

export type WaitlistFeature = (typeof WAITLIST_FEATURES)[number]["key"];

export function isWaitlistFeature(value: string): value is WaitlistFeature {
  return WAITLIST_FEATURES.some((option) => option.key === value);
}
