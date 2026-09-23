import type { ReactNode } from "react";
import { focusable } from "./ui";

/** Trenodo's own profiles. Add a row here, and the footer picks it up. */
const SOCIAL_LINKS: { name: string; href: string; icon: ReactNode }[] = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@trenodo-com",
    icon: (
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.5 4.5h13A4.5 4.5 0 0 1 23 9v6a4.5 4.5 0 0 1-4.5 4.5h-13A4.5 4.5 0 0 1 1 15V9a4.5 4.5 0 0 1 4.5-4.5ZM10 8.75v6.5L15.5 12Z"
      />
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/trenodo.app/",
    icon: (
      <>
        <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/trenodo",
    icon: (
      <path
        fill="currentColor"
        d="M13.5 21.5v-8h2.7l.45-3.1H13.5V8.6c0-.9.3-1.55 1.6-1.55h1.65V4.3a22 22 0 0 0-2.4-.13c-2.4 0-4.05 1.45-4.05 4.15v2.08H7.6v3.1h2.7v8Z"
      />
    ),
  },
];

/** Round icon buttons, made for the dark purple footer. */
export function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {SOCIAL_LINKS.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Trenodo on ${link.name}`}
            title={link.name}
            className={`grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white ${focusable}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              {link.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
