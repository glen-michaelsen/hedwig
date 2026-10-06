/**
 * The people who write for Trenodo. Every Spotlight is Glen's so far, so
 * articles take SPOTLIGHT_AUTHOR rather than an author column; the day
 * someone else writes one, it becomes a column and this the default.
 *
 * Google matches the structured author to the visible byline, so both
 * read from here, as does the author's page at /authors/<slug>.
 */

export type AuthorProfile = {
  name: "LinkedIn" | "Instagram" | "Facebook" | "Medium" | "Unsplash" | "YouTube";
  href: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  profiles: AuthorProfile[];
};

export const AUTHORS: Author[] = [
  {
    slug: "glen-michaelsen",
    name: "Glen Michaelsen",
    role: "Founder of Trenodo",
    bio: "I'm passionate about music and entrepreneurship, and I started building Trenodo to help upcoming artists.",
    image: "/images/authors/glen-michaelsen.jpg",
    profiles: [
      { name: "LinkedIn", href: "https://www.linkedin.com/in/glenmichaelsen/" },
      { name: "Instagram", href: "https://www.instagram.com/glenmichaelsen/" },
      { name: "Facebook", href: "https://www.facebook.com/Glenovic/" },
      { name: "Medium", href: "https://medium.com/@glenmichaelsen" },
      { name: "Unsplash", href: "https://unsplash.com/@glenm" },
    ],
  },
];

export const SPOTLIGHT_AUTHOR = AUTHORS[0];

export function getAuthor(slug: string) {
  return AUTHORS.find((author) => author.slug === slug) ?? null;
}

export const authorPath = (author: Author) => `/authors/${author.slug}`;
export const authorUrl = (author: Author) => `https://trenodo.com${authorPath(author)}`;

export function authorSchema(author: Author) {
  return {
    "@type": "Person",
    name: author.name,
    url: authorUrl(author),
    image: `https://trenodo.com${author.image}`,
    jobTitle: author.role,
    sameAs: author.profiles.map((profile) => profile.href),
  } as const;
}

export const trenodoPublisherSchema = {
  "@type": "Organization",
  name: "Trenodo",
  url: "https://trenodo.com",
} as const;
