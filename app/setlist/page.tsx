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
import { SetlistMockup } from "./_components/setlist-mockup";

const PAGE_DESCRIPTION =
  "Make a setlist online, for free. Drag songs into sets, keep an eye on the minutes, and take a printed sheet on stage. No more squinting at your phone.";

export const metadata: Metadata = {
  title: "Free Setlist Creator for Musicians | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/setlist",
  },
  openGraph: {
    title: "Free Setlist Creator for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/setlist",
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
    q: "Is Trenodo's setlist creator really free?",
    a: "Yes. Free, forever, just like Link in Bio. Not a trial that runs out.",
  },
  {
    q: "How do I make a setlist online with Trenodo?",
    a: "Add the gig. Add a set with a target length. Then drag songs in. The total time updates as you go, so you know if a set is too short or too long before soundcheck.",
  },
  {
    q: "Can I reuse a setlist from a past gig?",
    a: "Yes. Copy a whole gig, or just one set, and adjust from there. Most nights look a lot like the last one.",
  },
  {
    q: "Do I need my phone on stage?",
    a: "No. Print the sheet. Big letters, nothing else on it, easy to read at arm's length in the dark. Or open it on your phone at soundcheck, if you like that better.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Trenodo Setlist",
      url: "https://trenodo.com/setlist",
      description: PAGE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web-based)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      audience: { "@type": "Audience", audienceType: "Musicians" },
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
  drag: (
    <Icon
      path={
        <>
          <circle cx="8" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
          <path d="M17 6.5h3M17 12h3M17 17.5h3" />
        </>
      }
    />
  ),
  clock: (
    <Icon
      path={
        <>
          <circle cx="12" cy="12.5" r="8" />
          <path d="M12 8v4.5l3 2" />
          <path d="M9 2.5h6" />
        </>
      }
    />
  ),
  copy: (
    <Icon
      path={
        <>
          <rect x="8.5" y="8.5" width="11" height="12.5" rx="2" />
          <path d="M15.5 8.5V5.5A2 2 0 0 0 13.5 3.5h-8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </>
      }
    />
  ),
  print: (
    <Icon
      path={
        <>
          <path d="M7 8.5V3.5h10v5" />
          <rect x="4" y="8.5" width="16" height="8" rx="2" />
          <path d="M7 15.5h10v5H7z" />
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
              <span aria-hidden>🎤</span>
              Free Setlist Creator
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              Build the sets, hit the minutes, walk on stage ready.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              One gig, as many sets as it needs. Drag the songs where they
              belong. See each set grow towards its target length. And take a
              printed sheet on stage, instead of squinting at a phone between
              songs. Set for success. 🎤
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create account
              </Link>
              <Link href="/" className={`${buttonGhost} ${buttonLarge}`}>
                Back to Trenodo
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted">
              Free, forever. Make your first setlist in a few minutes.
            </p>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <SetlistMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: icons.drag,
      title: "Drag songs into place",
      body: "Move a song to another set, or change the order in one. It saves as you go. No save button to remember.",
    },
    {
      icon: icons.clock,
      title: "Target minutes per set",
      body: "Give each set a length to aim for, and watch it while you build. Too short, too long, or exactly what the venue wants.",
    },
    {
      icon: icons.copy,
      title: "Copy a gig or a set",
      body: "Most nights look like the last one. Start from a copy of an old gig, or one of its sets, and adjust from there.",
    },
    {
      icon: icons.print,
      title: "A print view for the stage",
      body: "Big letters, black on white, nothing else. Made to read at arm's length in the dark.",
    },
  ];

  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            Inside Setlist
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Made for how a gig really comes together
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            Not a shared document that slowly gets messy. You think in sets,
            so the tool is built around sets.
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
      title: "Add the gig",
      body: "Name, date and place, if you have them. A gig can wait without a date, as a plan, until it is booked.",
    },
    {
      n: "02",
      title: "Build the sets",
      body: "Add a set, give it a target length, and drag the songs in where they make sense.",
    },
    {
      n: "03",
      title: "Take it on stage",
      body: "Print the sheet, or open it on your phone at soundcheck. Either way, the order is ready before you walk on.",
    },
  ];

  return (
    <section className={`${container} py-24 sm:py-32`}>
      <div className="max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          From a blank gig to a printed sheet
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
          The whole way, from booking the gig to walking on stage with the
          order ready.
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
          Add your next gig, build the first set, and watch it come
          together. It takes about five minutes.
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

export default function SetlistLandingPage() {
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
