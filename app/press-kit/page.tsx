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
import { PressKitMockup } from "./_components/press-kit-mockup";

const PAGE_DESCRIPTION =
  "Create an electronic press kit (EPK) for every release — singles, EPs and albums — with cover art, photos, masters and the one-sheet a promoter or blog actually asks for, all in one place.";

export const metadata: Metadata = {
  title: "Electronic Press Kit (EPK) for Musicians — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/press-kit",
  },
  openGraph: {
    title: "Electronic Press Kit (EPK) for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/press-kit",
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
    q: "What is an electronic press kit (EPK)?",
    a: "A one-stop page with everything a promoter, blog or radio station needs to cover your release — cover art, photos, the masters, and the bio and one-sheet that explain what it is. Trenodo builds one for every release as you add files to it.",
  },
  {
    q: "Do singles, EPs and albums all get their own press kit?",
    a: "Yes — each release gets its own kit, organised separately. A blog covering your new single doesn't wade through photos from an album you put out two years ago.",
  },
  {
    q: "What should be in a press kit for a music release?",
    a: "At minimum: cover art at full resolution, a handful of press photos, the masters (not demos), and a short bio or one-sheet. Trenodo keeps all four together by release, at the sizes they were uploaded at.",
  },
  {
    q: "Can I control who sees it?",
    a: "Yes — a press kit is only public once you publish it, and you can flip it back to private any time without losing anything on it.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Trenodo Press Kit",
      url: "https://trenodo.com/press-kit",
      description: PAGE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web-based)",
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
  cover: (
    <Icon
      path={
        <>
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
          <circle cx="9" cy="9.5" r="1.5" />
          <path d="m5 17 4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16" />
          <path d="m13.5 14.5 1-1a1.5 1.5 0 0 1 2.1 0L19 16" />
        </>
      }
    />
  ),
  photo: (
    <Icon
      path={
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="M3.5 15.5 8 11a1.8 1.8 0 0 1 2.5 0l6 4.5" />
          <circle cx="15.5" cy="9.5" r="1.4" />
        </>
      }
    />
  ),
  track: (
    <Icon
      path={
        <>
          <path d="M8 17.5V6.5l10-2v11" />
          <circle cx="6" cy="17.5" r="2" />
          <circle cx="16" cy="15.5" r="2" />
        </>
      }
    />
  ),
  document: (
    <Icon
      path={
        <>
          <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h5.4L17 7.1v12.4a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 19.5z" />
          <path d="M12.5 3v4.5H17" />
          <path d="M9 12h5M9 15.5h5" />
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
              <span aria-hidden>📸</span>
              Electronic Press Kit
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
              Stop hunting through old folders when someone asks for your
              press kit.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              Every release drags along a cover, a stack of photos, the
              masters, a bio, a lyric sheet — usually scattered across
              drives and old email threads. This keeps all of it in one
              place, organised by release, so &ldquo;send me your press
              kit&rdquo; doesn&rsquo;t turn into an afternoon of digging.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create account
              </Link>
              <Link href="/" className={`${buttonGhost} ${buttonLarge}`}>
                Back to Trenodo
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PressKitMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: icons.cover,
      title: "Cover art, at full size",
      body: "3000×3000 in, ready for a store listing or a blog post — no re-exporting from an old design file to find out it shrank.",
    },
    {
      icon: icons.photo,
      title: "Press photos, full resolution",
      body: "A magazine can shrink a photo, it can't grow one. Whatever size you upload is the size that stays there.",
    },
    {
      icon: icons.track,
      title: "Masters, not demos",
      body: "MP3, WAV or FLAC, uploaded in chunks so a lossless master doesn't time out halfway through.",
    },
    {
      icon: icons.document,
      title: "Bio, lyrics, one-sheet",
      body: "The paperwork that goes with the music, sitting right next to it instead of in a separate folder you have to remember.",
    },
  ];

  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={container}>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            Inside Press Kit
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Organised the way people actually ask for it
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            By release, not one big pile — the way a booker or a blog
            actually asks for it.
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
      title: "Add the release",
      body: "Title, artist, kind — single, EP or album — and a release date if you've got one.",
    },
    {
      n: "02",
      title: "Drop the files in",
      body: "Cover, photos, tracks, documents. Upload as they're ready — nothing has to arrive all at once.",
    },
    {
      n: "03",
      title: "Send what's asked for",
      body: "Download exactly what a promoter or a blog needs, at the size they actually need it.",
    },
  ];

  return (
    <section className={`${container} py-24 sm:py-32`}>
      <div className="max-w-2xl">
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Set up once, per release
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
          Add the release, drop files in as they&rsquo;re ready, and it&rsquo;s
          there whenever someone asks.
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
          Add your first release and see everything sit in one place. It
          takes about five minutes.
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

export default function PressKitPage() {
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
