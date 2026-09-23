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
import { FaqSection } from "@/app/_components/marketing/faq-section";
import { StepsSection } from "@/app/_components/marketing/steps-section";

const PAGE_DESCRIPTION =
  "Make an electronic press kit (EPK) for every release. Singles, EPs and albums, with cover art, photos, masters and the one sheet a promoter or blog asks for. All in one place.";

export const metadata: Metadata = {
  title: "Electronic Press Kit (EPK) for Musicians | Trenodo",
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
    a: "One page with everything a promoter, blog or radio station needs to write about your release. Cover art, photos, the masters, a bio and a one sheet. Trenodo builds one for each release, as you add the files.",
  },
  {
    q: "Do singles, EPs and albums all get their own press kit?",
    a: "Yes. Each release gets its own kit. A blog writing about your new single doesn't have to dig through photos from an album you released two years ago.",
  },
  {
    q: "What should be in a press kit for a music release?",
    a: "At least: cover art in full size, a few press photos, the masters (not demos) and a short bio or one sheet. Trenodo keeps all four together per release, in the size you uploaded them.",
  },
  {
    q: "Can I control who sees it?",
    a: "Yes. A press kit only goes public when you publish it. And you can make it private again at any time, without losing anything.",
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
              Every release comes with a cover, a pile of photos, the
              masters, a bio and a lyric sheet. Usually spread over old
              drives and email threads. Press Kit keeps it all in one place,
              sorted by release. So &ldquo;send me your press kit&rdquo; doesn&rsquo;t
              turn into an afternoon of digging. 📸
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

          <div className="flex min-w-0 justify-center lg:justify-end">
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
      body: "3000×3000, ready for a store or a blog post. No more exporting from an old design file, only to find out it got smaller.",
    },
    {
      icon: icons.photo,
      title: "Press photos, full resolution",
      body: "A magazine can make a photo smaller, but never bigger. The size you upload is the size that stays.",
    },
    {
      icon: icons.track,
      title: "Masters, not demos",
      body: "MP3, WAV or FLAC. Uploaded in small pieces, so a big lossless master doesn't stop halfway.",
    },
    {
      icon: icons.document,
      title: "Bio, lyrics, one sheet",
      body: "The paperwork that belongs to the music, right next to it. Not in a separate folder you have to remember.",
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
            Sorted the way people ask for it
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            By release, not in one big pile. Exactly the way a booker or a
            blog asks for it.
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
      body: "Title, artist, type (single, EP or album) and a release date, if you have one.",
    },
    {
      n: "02",
      title: "Drop the files in",
      body: "Cover, photos, tracks, documents. Upload them when they are ready. Nothing has to come all at once.",
    },
    {
      n: "03",
      title: "Send what they ask for",
      body: "Download exactly what a promoter or a blog needs, in the size they need.",
    },
  ];

  return (
    <StepsSection title="Set up once, per release" steps={steps}>
        Add the release, drop the files in when they&rsquo;re ready, and it&rsquo;s
        there when someone asks. Always ready to press send. 🙂
    </StepsSection>
  );
}

function Faq() {
  return <FaqSection items={FAQS} />;
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
