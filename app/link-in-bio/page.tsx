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
import { BioMockup } from "./_components/bio-mockup";

const PAGE_DESCRIPTION =
  "A free link in bio page for musicians — your music, tour dates and links in one place. Blocks and themes built for artists, not just anyone.";

export const metadata: Metadata = {
  title: "Free Link in Bio for Musicians — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/link-in-bio",
  },
  openGraph: {
    title: "Free Link in Bio for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/link-in-bio",
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
    q: "Is Trenodo's Link in Bio really free?",
    a: "Yes — free, forever. It's how musicians find the rest of Trenodo, not a trial that runs out.",
  },
  {
    q: "How is it different from Linktree or other link-in-bio tools?",
    a: "It's built around what musicians actually share — a release, a player, tour dates — instead of a generic grid of buttons. A track link looks like a track link, not a t-shirt link.",
  },
  {
    q: "Do I need an invite to sign up?",
    a: "Right now, yes — Trenodo's still small and growing carefully. Join the waitlist and you'll hear back with an invite, or when it opens up for everyone.",
  },
  {
    q: "Can I pick my own handle, and change it later?",
    a: "Yes. Your page lives at trenodo.com/@yourhandle, and if you change it, the old one keeps redirecting — handy since printed QR codes and old bio links outlive handle changes.",
  },
  {
    q: "Do I need to be a musician to use it?",
    a: "It's built specifically for musicians — the release, player and video blocks assume that's what you're sharing. If that's not you, a general-purpose link-in-bio tool will probably fit better.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Trenodo Link in Bio",
      url: "https://trenodo.com/link-in-bio",
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
  link: (
    <Icon
      path={
        <>
          <path d="M9.5 14.5 14.5 9.5" />
          <path d="M11 7.5 12.6 5.9a3.5 3.5 0 0 1 5 5L16 12.5" />
          <path d="M13 16.5 11.4 18.1a3.5 3.5 0 0 1-5-5L8 11.5" />
        </>
      }
    />
  ),
  palette: (
    <Icon
      path={
        <>
          <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.7-.8 1.7-1.7 0-.45-.18-.85-.46-1.15-.28-.3-.46-.7-.46-1.15 0-.9.75-1.65 1.65-1.65h1.9c2 0 3.65-1.65 3.65-3.65 0-4.4-4-7.7-8-7.7Z" />
          <circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
        </>
      }
    />
  ),
  chart: (
    <Icon
      path={
        <>
          <path d="M4.5 19.5V9" />
          <path d="M11 19.5v-13" />
          <path d="M17.5 19.5v-7" />
          <path d="M4 19.5h16" />
        </>
      }
    />
  ),
  shield: (
    <Icon
      path={
        <>
          <path d="M12 3.5 5 6v5.3c0 4.2 2.9 7.4 7 9.2 4.1-1.8 7-5 7-9.2V6z" />
          <path d="m9 12 2 2 4-4" />
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
              <span aria-hidden>🔗</span>
              Free Link in Bio
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              One page for everything you point people at.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              I got tired of a link-in-bio tool built for everyone that fit a
              musician awkwardly — a track link that looked like a t-shirt
              link, no way to route a student toward my portal. So this one is
              built for musicians specifically, and it&rsquo;s the second
              thing I made.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Claim your page
              </Link>
              <Link href="/" className={`${buttonGhost} ${buttonLarge}`}>
                Back to Trenodo
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted">
              Free, forever — your page lives at trenodo.com/@yourhandle.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <BioMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: icons.link,
      title: "Blocks that actually fit a set",
      body: "Links, short text, a music player and video — reorder them however you like, and hide one without deleting it.",
    },
    {
      icon: icons.palette,
      title: "Presets, or your own colours",
      body: "Start from a designed theme, or pick your own accent and background. If the contrast won't read, the page tells you before your audience finds out.",
    },
    {
      icon: icons.chart,
      title: "The numbers that matter",
      body: "Views over time and clicks per block, so you can see what people actually tap — not a wall of vanity metrics.",
    },
    {
      icon: icons.shield,
      title: "No app chrome, no distractions",
      body: "The public page is just your page — no Trenodo header or navigation pulling focus from what you're sharing.",
    },
  ];

  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            What&rsquo;s on the page
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Built for one link in a bio, not a landing page
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            A handful of blocks, chosen and themed with musicians in mind —
            not a generic grid you have to fight into shape.
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
      title: "Claim your handle",
      body: "Pick trenodo.com/@yourhandle. Change your mind later and the old one keeps redirecting — printed QR codes outlive handle changes.",
    },
    {
      n: "02",
      title: "Add your blocks",
      body: "A link to your latest release, a player, a video, a line of text. Drag them into the order you want people to see.",
    },
    {
      n: "03",
      title: "Publish",
      body: "Flip it live and put the link everywhere you already are — Instagram, a poster, a setlist card at the merch table.",
    },
  ];

  return (
    <section className={`${container} py-24 sm:py-32`}>
      <div className="max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Live in a few minutes
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
          No draft to remember to publish — edits to a live page go out
          straight away.
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
          Your page, your handle, your colours
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          Claim your handle and add your first block. It takes about as long
          as this page did to read.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Claim your page
          </Link>
          <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
            I already have one
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LinkInBioPage() {
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
