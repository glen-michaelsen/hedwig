/**
 * Line icons for guide steps, in the app's own style (20×20 viewBox,
 * 1.5 stroke, rounded caps, as in app/_components/nav-icons.tsx), so a
 * guide gets visual markers without an icon library.
 */

import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ className = "h-6 w-6", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="3.5" width="12" height="14" rx="2" />
      <path d="M7.5 3.5V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v.5" />
      <path d="m7 9 1.5 1.5L11 8" />
      <path d="M7 13.5h6" />
    </Svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17.5 2.5 9 11" />
      <path d="m17.5 2.5-5 15-3.5-6.5-6.5-3.5 15-5Z" />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M3 8h14M7 2.5V5.5M13 2.5V5.5" />
      <path d="M10 11.5v2.5M8.75 12.75h2.5" />
    </Svg>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="7.5" r="3" />
      <path d="M4.5 16.5c.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4" />
      <path d="m13 4 1.2 1.2L16.5 3" />
    </Svg>
  );
}

export function CoinsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="8" cy="6" rx="5" ry="2.5" />
      <path d="M3 6v3c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V6" />
      <path d="M7 13.3c.3 1.3 2.4 2.2 5 2.2 2.8 0 5-1.1 5-2.5v-3c0-1-1.1-1.8-2.8-2.2" />
    </Svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 6.5h12l-1 10.5H5L4 6.5Z" />
      <path d="M7.5 8.5V5.5a2.5 2.5 0 0 1 5 0v3" />
    </Svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 3 2.5 16.5h15L10 3Z" />
      <path d="M10 8.5v3.5M10 14.25v.01" />
    </Svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 2.5 11.6 7.4 16.5 9l-4.9 1.6L10 15.5l-1.6-4.9L3.5 9l4.9-1.6L10 2.5Z" />
      <path d="M16 14v3M14.5 15.5h3" />
    </Svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 13V3.5M6.5 7 10 3.5 13.5 7" />
      <path d="M3.5 12.5v2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2" />
    </Svg>
  );
}

export function HubIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="10" r="2.5" />
      <circle cx="4" cy="4.5" r="1.5" />
      <circle cx="16" cy="4.5" r="1.5" />
      <circle cx="4" cy="15.5" r="1.5" />
      <circle cx="16" cy="15.5" r="1.5" />
      <path d="m5.2 5.6 2.9 2.7M14.8 5.6l-2.9 2.7M5.2 14.4l2.9-2.7M14.8 14.4l-2.9-2.7" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M8.5 7v6l5-3-5-3Z" />
    </Svg>
  );
}

export function RecordIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <circle cx="10" cy="10" r="2" />
      <path d="M5.5 10a4.5 4.5 0 0 1 4.5-4.5" />
    </Svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m13.5 3.5 3 3L7 16H4v-3l9.5-9.5Z" />
      <path d="m11.5 5.5 3 3" />
    </Svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="2.5" width="6" height="9" rx="3" />
      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5M7 17.5h6" />
    </Svg>
  );
}
