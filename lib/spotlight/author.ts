/**
 * Who writes Spotlight. Every article so far is Glen's, so this is one
 * record rather than a column on `spotlight`; the day someone else writes
 * one, it becomes a column and this becomes the default.
 *
 * `url` is the author's profile. Google matches the structured author to
 * the byline on the page, so both read from here.
 */
export const SPOTLIGHT_AUTHOR = {
  name: "Glen Michaelsen",
  url: "https://trenodo.com/@glen",
  path: "/@glen",
};

export const spotlightAuthorSchema = {
  "@type": "Person",
  name: SPOTLIGHT_AUTHOR.name,
  url: SPOTLIGHT_AUTHOR.url,
} as const;

export const spotlightPublisherSchema = {
  "@type": "Organization",
  name: "Trenodo",
  url: "https://trenodo.com",
} as const;
