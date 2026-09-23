export type NavItem = {
  href: string;
  label: string;
};

/*
 * Shared by the header (a client component, for its menus) and the footer
 * (a server component). It lives in its own module without "use client"
 * because a value exported from a client module reaches the server as a
 * reference to that module, not as the array itself.
 */

/**
 * Released tools, in the order they should be offered. Adding a feature here
 * puts it in the header, the mobile menu and the footer at once — there is no
 * second list to keep in step.
 */
export const featureItems: NavItem[] = [
  { href: "/link-in-bio", label: "Link in Bio" },
  { href: "/tutoring", label: "Tutor" },
  { href: "/press-kit", label: "Press Kit" },
  { href: "/setlist", label: "Setlist" },
  { href: "/ideas", label: "Ideas" },
];

/** Spotlight is two things: the articles, and how to get your own release in them. */
export const spotlightItems: NavItem[] = [
  { href: "/spotlight", label: "Spotlight articles" },
  { href: "/spotlight/get-featured", label: "Get featured" },
];

export const loginItems: NavItem[] = [
  { href: "/login", label: "Student" },
  { href: "/account/login", label: "Musician" },
];

/**
 * The footer's Knowledge column — the instrument tracks by name, since
 * that's what a musician searches for, plus one escape hatch to the rest
 * of the hub (theory, recording, performing, promoting, teaching) rather
 * than listing every pillar here.
 */
export const knowledgeItems: NavItem[] = [
  { href: "/knowledge/guitar", label: "Guitar" },
  { href: "/knowledge/piano", label: "Piano" },
  { href: "/knowledge/drums", label: "Drums" },
  { href: "/knowledge/bass", label: "Bass" },
  { href: "/knowledge/vocals", label: "Vocals" },
  { href: "/knowledge", label: "All guides" },
];
