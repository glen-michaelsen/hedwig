import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
} from "@/app/_components/ui";
import { FaqSection } from "@/app/_components/marketing/faq-section";

const PAGE_DESCRIPTION =
  "How to get your release featured in Trenodo Spotlight. Create a free account, build a press kit for your release, and we take it from there.";

export const metadata: Metadata = {
  title: "Get Your Music in the Spotlight: How to Get Featured | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/spotlight/get-featured" },
  openGraph: {
    title: "Get Your Music in the Spotlight",
    description: PAGE_DESCRIPTION,
    url: "/spotlight/get-featured",
    siteName: "Trenodo",
    type: "website",
  },
};

const STEPS = [
  {
    n: "01",
    title: "Create a free account",
    body: "It takes about a minute, and it's free. No credit card needed.",
  },
  {
    n: "02",
    title: "Make a press kit for your release",
    body: "Add your release in Press Kit. A single, an EP or an album. Fill in the basics below, and that's it. No email, no form to send.",
  },
  {
    n: "03",
    title: "It lands on our list",
    body: "Every new release shows up on our Spotlight list automatically. We listen through the list and pick the releases we want to write about.",
  },
  {
    n: "04",
    title: "You get the link and the social posts",
    body: "If we pick your release, we write the Spotlight and send you the link. Plus a ready made image and caption for your social media, so you can share it right away.",
  },
] as const;

const CHECKLIST = [
  { item: "Title", note: "The name of the release." },
  { item: "Type", note: "Single, EP or album." },
  { item: "Cover art", note: "In full size. 3000×3000 is perfect." },
  { item: "A press photo", note: "Of you or your band. The bigger, the better." },
  { item: "An audio file", note: "The track itself. MP3, WAV or FLAC." },
  { item: "A few tags", note: "Genre, mood and where you are from. It takes a few clicks." },
] as const;

const FAQS = [
  {
    q: "Does it cost anything to get featured?",
    a: "No. Creating an account is free, and a Spotlight never costs money. We only write about music we actually like.",
  },
  {
    q: "Does every release get a Spotlight?",
    a: "No, and we want to be honest about that. We listen to every release on the list, but we can only write about a few of them. If yours isn't picked this time, your press kit is still yours to use. Send it to blogs, radio and promoters.",
  },
  {
    q: "Do I need to send you an email or a link?",
    a: "No. When your press kit exists, your release is already on our list. That's the whole point. No emails that get lost in an inbox.",
  },
  {
    q: "What do I get if my release is picked?",
    a: "A Spotlight article on Trenodo with your music, your photo and a rating. Plus the link and a ready made image and caption for Instagram and other social media.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to get your music featured in Trenodo Spotlight",
      description: PAGE_DESCRIPTION,
      step: STEPS.map((step) => ({
        "@type": "HowToStep",
        name: step.title,
        text: step.body,
      })),
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

export default function GetFeaturedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-24">
          <div className="brand-wash" />
          <div className={container}>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
                <span aria-hidden>🔦</span>
                Get featured
              </span>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
                Get your music in the Spotlight.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
                Spotlight is where I write about releases that deserve more
                ears. Want yours to be one of them? It doesn&rsquo;t take a
                pitch email or a PR agency. Just four simple steps. 🎧
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                  Create your free account
                </Link>
                <Link href="/spotlight" className={`${buttonGhost} ${buttonLarge}`}>
                  Read the Spotlights
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
          <div className={container}>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
                How it works
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
                From upload to Spotlight
              </h2>
            </div>

            <ol className="mt-14 grid gap-6 sm:grid-cols-2">
              {STEPS.map((step) => (
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
          </div>
        </section>

        <section className={`${containerNarrow} py-24 sm:py-32`}>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            What we need
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            Your press kit, the short version
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            You can add much more to a press kit. But this is the minimum we
            need to listen to your release and write about it.
          </p>

          <ul className="mt-10 divide-y divide-line overflow-hidden rounded-4xl border border-line bg-surface shadow-soft">
            {CHECKLIST.map((row) => (
              <li key={row.item} className="flex items-start gap-4 px-6 py-5">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                    <path
                      d="m5 10.5 3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold">{row.item}</p>
                  <p className="mt-0.5 text-sm text-muted">{row.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <FaqSection items={FAQS} />

        <section className={`${containerNarrow} py-24 sm:py-32`}>
          <div className="brand-wash-clip relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
            <div className="brand-wash" />
            <h2 className="text-4xl font-semibold tracking-tight text-balance">
              Ready for your moment in the Spotlight?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
              Create your free account and add your release. It takes about
              five minutes. The rest is up to your music. 🎶
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create your free account
              </Link>
              <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
