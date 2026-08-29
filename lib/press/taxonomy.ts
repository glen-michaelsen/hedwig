/**
 * Curated vocabularies an artist picks from when tagging a release — closed
 * lists rather than free text, so tags aggregate cleanly into future SEO
 * hub pages instead of fragmenting into near-duplicates ("chill pop" vs
 * "pop/chill"). First draft — easy to edit, not meant to be final.
 */

export type TaxonomyOption = { value: string; label: string };

export const GENRES: readonly TaxonomyOption[] = [
  { value: "pop", label: "Pop" },
  { value: "indie", label: "Indie" },
  { value: "electronic", label: "Electronic" },
  { value: "hip-hop", label: "Hip-Hop / Rap" },
  { value: "rnb", label: "R&B / Soul" },
  { value: "rock", label: "Rock" },
  { value: "folk", label: "Folk / Singer-Songwriter" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "metal", label: "Metal" },
  { value: "punk", label: "Punk" },
  { value: "country", label: "Country" },
  { value: "reggae", label: "Reggae" },
  { value: "latin", label: "Latin" },
  { value: "world", label: "World" },
  { value: "experimental", label: "Experimental" },
] as const;

export const GENRE_MAX = 3;

export const MOODS: readonly TaxonomyOption[] = [
  { value: "upbeat", label: "Upbeat" },
  { value: "melancholic", label: "Melancholic" },
  { value: "chill", label: "Chill" },
  { value: "driving", label: "Driving" },
  { value: "dreamy", label: "Dreamy" },
  { value: "dark", label: "Dark" },
  { value: "romantic", label: "Romantic" },
  { value: "energetic", label: "Energetic" },
  { value: "stripped-back", label: "Stripped-back" },
  { value: "anthemic", label: "Anthemic" },
] as const;

export const MOOD_MAX = 3;

export const LANGUAGES: readonly TaxonomyOption[] = [
  { value: "da", label: "Danish" },
  { value: "en", label: "English" },
  { value: "sv", label: "Swedish" },
  { value: "no", label: "Norwegian" },
  { value: "de", label: "German" },
  { value: "instrumental", label: "Instrumental (no lyrics)" },
  { value: "other", label: "Other" },
] as const;

export const LABEL_STATUSES: readonly TaxonomyOption[] = [
  { value: "unsigned", label: "Unsigned" },
  { value: "independent", label: "Independent label" },
  { value: "signed", label: "Signed" },
] as const;

/** Nordic countries pinned first — Trenodo's actual market — then the rest alphabetically. */
export const NORDIC_COUNTRIES: readonly TaxonomyOption[] = [
  { value: "DK", label: "Denmark" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "FI", label: "Finland" },
  { value: "IS", label: "Iceland" },
] as const;

export const OTHER_COUNTRIES: readonly TaxonomyOption[] = [
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BR", label: "Brazil" },
  { value: "BG", label: "Bulgaria" },
  { value: "KH", label: "Cambodia" },
  { value: "CA", label: "Canada" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czechia" },
  { value: "EG", label: "Egypt" },
  { value: "EE", label: "Estonia" },
  { value: "ET", label: "Ethiopia" },
  { value: "FR", label: "France" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GR", label: "Greece" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungary" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KR", label: "South Korea" },
  { value: "KW", label: "Kuwait" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MY", label: "Malaysia" },
  { value: "MT", label: "Malta" },
  { value: "MX", label: "Mexico" },
  { value: "MD", label: "Moldova" },
  { value: "MC", label: "Monaco" },
  { value: "MA", label: "Morocco" },
  { value: "NL", label: "Netherlands" },
  { value: "NZ", label: "New Zealand" },
  { value: "NG", label: "Nigeria" },
  { value: "MK", label: "North Macedonia" },
  { value: "PK", label: "Pakistan" },
  { value: "PS", label: "Palestine" },
  { value: "PA", label: "Panama" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "QA", label: "Qatar" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "RS", label: "Serbia" },
  { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "ZA", label: "South Africa" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "CH", label: "Switzerland" },
  { value: "TW", label: "Taiwan" },
  { value: "TH", label: "Thailand" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
] as const;

export const COUNTRIES: readonly TaxonomyOption[] = [
  ...NORDIC_COUNTRIES,
  ...OTHER_COUNTRIES,
] as const;

/** Reads a genre/mood column (a JSON array of slugs, or null) back into a plain list. */
export function parseTagList(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}
