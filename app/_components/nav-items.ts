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
];

export const loginItems: NavItem[] = [
  { href: "/login", label: "Student" },
  { href: "/account/login", label: "Musician" },
];
