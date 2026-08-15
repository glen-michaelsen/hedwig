import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./_components/site-header";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
} from "./_components/ui";

export const metadata: Metadata = {
  title: "Trenodo — the musician's toolbox",
  description:
    "Tools for working musicians. Tutor keeps your teaching in one place: sheet music, chord links and practice videos in one library, a lesson note for every session, and a portal your students open with their phone number and a PIN.",
};

/* --------------------------------- icons --------------------------------- */

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

const icons = {
  library: (
    <Icon
      path={
        <>
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H9v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
          <path d="M9 4h4.5A1.5 1.5 0 0 1 15 5.5v13A1.5 1.5 0 0 1 13.5 20H9z" />
          <path d="m17.5 5.6 2.2 12.1" />
        </>
      }
    />
  ),
  note: (
    <Icon
      path={
        <>
          <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h8.4L19 7.1v12.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5z" />
          <path d="M14.5 3v4.5H19" />
          <path d="M8.5 12h7M8.5 15.5h4.5" />
        </>
      }
    />
  ),
  lock: (
    <Icon
      path={
        <>
          <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
          <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
        </>
      }
    />
  ),
  shelf: (
    <Icon
      path={
        <>
          <path d="M4 7.5h16M4 12h16M4 16.5h16" />
          <circle cx="8" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="14" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
        </>
      }
    />
  ),
};

/* -------------------------------- sections ------------------------------- */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="brand-wash" />
      <div className={container}>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Tools for working musicians
          </span>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            The toolbox for{" "}
            <span className="text-brand-600">everything else</span> you do.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            Most musicians teach, release and play — and end up with a different
            tool for each, none of which know about the others. Trenodo is one
            account for all of it. Tutor, for your teaching, is here now.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
              Create your account
            </Link>
            <Link href="/login" className={`${buttonGhost} ${buttonLarge}`}>
              I&rsquo;m a student
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted">
            Free while it&rsquo;s young. Students never create an account.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Status is stated plainly per tool. Two of these don't exist yet, and
 * pretending otherwise is how a landing page stops being trustworthy.
 */
function Tools() {
  const tools = [
    {
      name: "Tutor",
      status: "Available now",
      live: true,
      body: "Your students, your library, and a lesson note for every session — with a private half only you can read.",
    },
    {
      name: "Link in Bio",
      status: "In build",
      live: false,
      body: "One page for everything you point people at: your music, your dates, your links. Designed for musicians rather than everyone.",
    },
    {
      name: "Press Kit",
      status: "Planned",
      live: false,
      body: "Photos, tracks, lyrics and the story, in a page you can send to a promoter without attaching nine files.",
    },
  ];

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className={`rounded-4xl border p-8 ${
              tool.live
                ? "border-line bg-surface shadow-soft"
                : "border-dashed border-line"
            }`}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {tool.name}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                  tool.live
                    ? "bg-brand-500/12 text-brand-700"
                    : "bg-surface-muted text-faint"
                }`}
              >
                {tool.status}
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              {tool.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Doors() {
  const doors = [
    {
      title: "For the musician",
      body: "A private workspace: your library, your students, and a lesson note for every session — including a section only you can read.",
      href: "/account/login",
      cta: "Musician sign in",
      primary: true,
    },
    {
      title: "For the student",
      body: "No account, no password to forget. Their phone number and a four-digit PIN open a feed of their lessons and the material that goes with them.",
      href: "/login",
      cta: "Student sign in",
      primary: false,
    },
  ];

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="grid gap-6 md:grid-cols-2">
        {doors.map((door) => (
          <div
            key={door.title}
            className="group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-10"
          >
            <h2 className="text-xl font-semibold tracking-tight">
              {door.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              {door.body}
            </p>
            <Link
              href={door.href}
              className={`mt-8 ${door.primary ? button : buttonGhost}`}
            >
              {door.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: icons.library,
      title: "One library, tagged not foldered",
      body: "PDF sheet music, links to chords and theory, YouTube and Vimeo — all in one place. Tag by grade, technique or composer and find it mid-lesson.",
    },
    {
      icon: icons.note,
      title: "Lesson notes that do the sharing",
      body: "Write what you covered, set the homework, attach the material. That's the delivery — no separate assignment to remember to send.",
    },
    {
      icon: icons.lock,
      title: "A private half, always",
      body: "Every note has a section the student never sees. Record the honest observation — the nerves, the parent pushing too hard — without a second system.",
    },
    {
      icon: icons.shelf,
      title: "A shelf that stays put",
      body: "Scales, theory reference, the piece they're working towards. Pin it once and it stays available, whichever lesson it came from.",
    },
  ];

  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            Inside Tutor
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Built around how a lesson actually goes
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            Not a file share with a music skin. The week is the unit of work, so
            that&rsquo;s what the tool is shaped around.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600 dark:text-brand-300">
                {feature.icon}
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted text-pretty">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    {
      n: "01",
      title: "Add your students",
      body: "Name and phone number. Trenodo generates a PIN you read out once — siblings can share one number, the PIN tells them apart.",
    },
    {
      n: "02",
      title: "Write up the lesson",
      body: "What you covered, the homework, and tick the material you worked through. Keep the candid part in the private section.",
    },
    {
      n: "03",
      title: "They practise",
      body: "Phone number, PIN, and their week is on screen — with the PDF, the chord chart and the video right there under it.",
    },
  ];

  return (
    <section className={`${container} py-24 sm:py-32`}>
      <div className="max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Three minutes after the lesson
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
          The whole loop, from a student who&rsquo;s never used it to a student
          practising the right thing.
        </p>
      </div>

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-4xl border border-line bg-surface p-8 shadow-soft"
          >
            <span className="font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
              {step.n}
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted text-pretty">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Details() {
  const details = [
    {
      title: "Made for families",
      body: "One phone number can cover every sibling at your studio. They each get their own PIN, their own feed, and their own notes.",
    },
    {
      title: "Files stay yours",
      body: "Sheet music is served only to the student it was shared with, through a check on every request. Nothing sits on a public URL.",
    },
    {
      title: "Dead links surface",
      body: "Chord and theory links rot. Trenodo keeps track of which ones stopped working so your library doesn't quietly decay.",
    },
  ];

  return (
    <section className="border-t border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={container}>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.title}>
              <h3 className="text-base font-semibold tracking-tight">
                {detail.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted text-pretty">
                {detail.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className={`${containerNarrow} py-24 sm:py-32`}>
      <div className="relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
        <div className="brand-wash" />
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Set up your studio tonight
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          Add one student, write one lesson note, and see what they see. It takes
          about five minutes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Create your studio
          </Link>
          <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
            I already have one
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Tools />
        <Doors />
        <Features />
        <Steps />
        <Details />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
