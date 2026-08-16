import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "../_components/site-header";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
} from "../_components/ui";

export const metadata: Metadata = {
  title: "Tutor — Trenodo",
  description:
    "Tutor keeps your teaching in one place: sheet music, chord links and practice videos in one library, a lesson note for every session, and a portal your students open with their phone number and a PIN.",
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
    <section className="relative isolate overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-24">
      <div className="brand-wash" />
      <div className={container}>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
            <span aria-hidden>🎓</span>
            Tutor
          </span>

          <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Teaching, without the admin tax.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            I taught lessons for years before I taught myself to code, and the
            part that wore me down was never the teaching — it was the
            spreadsheet of PINs, the scattered PDFs, the homework I meant to
            text and forgot. Tutor is what I built to carry that instead.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
              Create your account
            </Link>
            <Link href="/" className={`${buttonGhost} ${buttonLarge}`}>
              Back to Trenodo
            </Link>
          </div>
        </div>
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
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/12 text-brand-600">
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
            <span className="font-mono text-sm font-medium text-brand-600">
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

export default function TutoringPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <Details />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
