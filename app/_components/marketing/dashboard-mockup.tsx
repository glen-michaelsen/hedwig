import type { ReactNode } from "react";
import { BrowserFrame } from "@/app/_components/mockup/browser-frame";

/**
 * A browser window showing the account home screen — same card grid, same
 * icons, as the real one at app/account/(app)/page.tsx. That page's icons
 * and StatCard aren't exported (they're private to a server component that
 * reads live DB counts), so this hand-copies the exact SVG paths and card
 * classNames rather than importing it — the same fidelity, with sample
 * numbers standing in for a real account's stats.
 */

function Icon({ path }: { path: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {path}
    </svg>
  );
}

const tutorIcon = (
  <Icon
    path={
      <>
        <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h8.4L19 7.1v12.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5z" />
        <path d="M14.5 3v4.5H19" />
        <path d="M8.5 12h7M8.5 15.5h4.5" />
      </>
    }
  />
);

const bioIcon = (
  <Icon
    path={
      <>
        <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7l-1.1 1.1" />
        <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.1-1.1" />
      </>
    }
  />
);

const pressIcon = (
  <Icon
    path={
      <>
        <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l.9-1.8A1 1 0 0 1 9.5 4.6h5a1 1 0 0 1 .9.6L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
        <circle cx="12" cy="12.5" r="3" />
      </>
    }
  />
);

const setlistIcon = (
  <Icon
    path={
      <>
        <path d="M5 6.5h14M5 11h14M5 15.5h8" />
        <circle cx="17" cy="15.5" r="1.8" />
      </>
    }
  />
);

const TOOLS = [
  { icon: tutorIcon, name: "Tutor", stat: "6 students · 24 items" },
  { icon: bioIcon, name: "Link in Bio", stat: "Live at /@glen" },
  { icon: pressIcon, name: "Press Kit", stat: "4 releases" },
  { icon: setlistIcon, name: "Setlists", stat: "5 gigs" },
];

export function DashboardMockup() {
  return (
    <BrowserFrame
      screenClassName="bg-background"
      frameWidth={460}
      screenHeight={360}
      nativeWidth={480}
      scale={0.62}
      url="trenodo.com/account"
    >
      <div className="px-6 py-8">
        <p className="text-lg font-semibold tracking-tight">Hello, Glen</p>
        <p className="mt-1 text-sm text-muted">
          Your tools, all in one account.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-3xl border border-line bg-surface p-4 shadow-soft"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/12 text-brand-600">
                {tool.icon}
              </span>
              <p className="mt-3 text-sm font-semibold tracking-tight">
                {tool.name}
              </p>
              <p className="mt-1 text-xs text-faint">{tool.stat}</p>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
