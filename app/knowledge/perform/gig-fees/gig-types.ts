/**
 * The kinds of gig and what each is worth against a bar gig. Its own
 * module, without "use client", so both the server-rendered page and the
 * calculator can read the list itself (a value exported from a client
 * module reaches the server only as a reference).
 */
export const GIG_TYPES = [
  { key: "bar", label: "Bar, café or club", multiplier: 1, why: "Your base rate." },
  { key: "party", label: "Private party", multiplier: 1.25, why: "More planning, someone's big night." },
  { key: "wedding", label: "Wedding", multiplier: 1.5, why: "No second chances, long days, special requests." },
  { key: "corporate", label: "Corporate event", multiplier: 1.75, why: "Budgets are bigger, and so is the pressure." },
] as const;
