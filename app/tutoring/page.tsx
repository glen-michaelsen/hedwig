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
import { TutorMockup } from "./_components/tutor-mockup";

const PAGE_DESCRIPTION =
  "Student management built for private music tutors — a library of teaching material, a lesson note for every session, and a portal each student opens with just their phone number and a PIN.";

export const metadata: Metadata = {
  title: "Student Management for Music Tutors — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/tutoring",
  },
  openGraph: {
    title: "Student Management for Music Tutors",
    description: PAGE_DESCRIPTION,
    url: "/tutoring",
    siteName: "Trenodo",
    type: "website",
  },
};

/**
 * The one place both the visible FAQ and its schema.org markup are written,
 * so they can't drift apart — Google's FAQ rich result (and any AI answer
 * engine reading the JSON-LD) has to match what a visitor actually sees.
 */
const FAQS = [
  {
    q: "What is a student management tool for music tutors?",
    a: "Software that keeps your teaching organised in one place — who you teach, what you've covered with each of them, and the material you use, instead of scattered notebooks, texts and files.",
  },
  {
    q: "Do my students need to download an app or create an account?",
    a: "No — each student signs into their own portal with just their phone number and a 4-digit PIN you read out once. No app, no password to forget.",
  },
  {
    q: "Can I keep some notes private?",
    a: "Yes — every lesson note has a section only you see, separate from what gets shared with the student.",
  },
  {
    q: "Is it built for one instrument or teaching style?",
    a: "No — it's instrument-agnostic. Sheet music, chord links, practice videos, whatever your students need, tagged and searchable in your own library.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Trenodo Tutor",
      url: "https://trenodo.com/tutoring",
      description: PAGE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web-based)",
      audience: { "@type": "Audience", audienceType: "Music tutors" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
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
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
              <span aria-hidden>🎓</span>
              Student Management
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              Organising and making every session more efficient.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              You get a clean overview of everything you teach with, ready to
              share the moment you write up a lesson note. A few minutes
              after each session is all it takes to make a real difference.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create account
              </Link>
              <Link href="/login" className={`${buttonGhost} ${buttonLarge}`}>
                Student
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <TutorMockup />
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
      title: "Your own library",
      body: "Sheet music, chord links and practice videos, all tagged and easy to find — right when you need it mid-lesson.",
    },
    {
      icon: icons.note,
      title: "Lesson notes",
      body: "Write what you covered, set the homework, attach the material. Your student sees it all in one place — nothing extra to send.",
    },
    {
      icon: icons.lock,
      title: "Private notes",
      body: "Keep a section on every lesson note just for yourself, for the things you'd rather not put in front of the student.",
    },
    {
      icon: icons.shelf,
      title: "Shelf for base material",
      body: "Scales, theory, the piece they're working towards. Pin it once and it stays there, however many lessons go by.",
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
      body: "Name and phone number. Trenodo generates a PIN you read out once.",
    },
    {
      n: "02",
      title: "Write up the lesson",
      body: "What you covered, the homework, and tick the material you worked through.",
    },
    {
      n: "03",
      title: "They practise",
      body: "Phone number, PIN, and their week is on screen. With all the material at hand, they practise more — and better.",
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

function Faq() {
  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={containerNarrow}>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
          Questions
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
          Before you ask
        </h2>

        <dl className="mt-12 space-y-9">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <dt className="text-lg font-semibold tracking-tight text-balance">
                {faq.q}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className={`${containerNarrow} py-24 sm:py-32`}>
      <div className="brand-wash-clip relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
        <div className="brand-wash" />
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Set up your musician account
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          Add one student, write one lesson note, and see what they see. It takes
          about five minutes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Create account
          </Link>
          <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TutoringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only — never user input — so this is
        // safe without further escaping.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
