import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { FaqSection } from "@/app/_components/marketing/faq-section";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
  focusable,
} from "@/app/_components/ui";

/**
 * An honest comparison. Every Linktree fact below is sourced (SOURCES), and
 * the page says out loud where Linktree is the better pick. Competitor
 * prices change, so LAST_CHECKED is shown on the page: re-check the sources
 * and bump it every quarter, or when Linktree changes its plans.
 *
 * Trenodo facts come from the code, not the marketing copy: lib/bio/blocks.ts
 * (block kinds), lib/embed.ts (players), lib/bio/theme.ts (themes and the
 * contrast check), app/[handle]/page.tsx (the "Made with Trenodo" toggle).
 */
const LAST_CHECKED = "24 September 2026";

const PAGE_DESCRIPTION =
  "Trenodo vs Linktree for musicians. An honest side by side of price, music features, branding, analytics and fees, including where Linktree is the better choice.";

export const metadata: Metadata = {
  title: "Trenodo vs Linktree: An Honest Comparison for Musicians | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/compare/linktree" },
  openGraph: {
    title: "Trenodo vs Linktree: An Honest Comparison for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/compare/linktree",
    siteName: "Trenodo",
    type: "article",
  },
};

type Row = { feature: string; trenodo: string; linktree: string };

const ROWS: { group: string; rows: Row[] }[] = [
  {
    group: "Price",
    rows: [
      {
        feature: "Cost",
        trenodo: "Free. There is no paid plan.",
        linktree: "Free plan, plus Starter ($8), Pro ($15) and Premium ($35) per month. Cheaper billed yearly. Prices vary by region.",
      },
      {
        feature: "Fees when you sell",
        trenodo: "No shop, so no fees.",
        linktree: "You can sell digital products. Linktree takes 12% on Free, 9% on Starter and Pro, 0% on Premium. Payment processing comes on top.",
      },
    ],
  },
  {
    group: "Music",
    rows: [
      {
        feature: "Music player on your page",
        trenodo: "Yes. Spotify, Apple Music and SoundCloud.",
        linktree: "Yes. Several platforms, like Spotify, SoundCloud and Audiomack.",
      },
      {
        feature: "Smart link to every streaming service",
        trenodo: "No. You paste your own link, for example from your distributor.",
        linktree: "Yes. Paste one link, and it finds the same track on the other services.",
      },
      {
        feature: "Pre-save",
        trenodo: "Partly. A release button says \"Pre-save\" before the release date and \"Listen\" after. You bring the pre-save link.",
        linktree: "Yes, built in. Spotify, Apple Music and TIDAL.",
      },
      {
        feature: "Tour dates",
        trenodo: "Not yet.",
        linktree: "Yes, from Bandsintown or Seated.",
      },
      {
        feature: "Video",
        trenodo: "Yes. YouTube and Vimeo.",
        linktree: "Yes.",
      },
    ],
  },
  {
    group: "Look and feel",
    rows: [
      {
        feature: "Themes and colours",
        trenodo: "Ready themes or your own colours. It warns you if text gets hard to read. All free.",
        linktree: "Basic themes are free. More design control on paid plans.",
      },
      {
        feature: "Remove the platform's logo",
        trenodo: "Free. One switch.",
        linktree: "Pro or Premium.",
      },
      {
        feature: "Your address",
        trenodo: "trenodo.com/@you. Change it later, and the old one still works.",
        linktree: "linktr.ee/you",
      },
    ],
  },
  {
    group: "Growth",
    rows: [
      {
        feature: "Analytics",
        trenodo: "Views over time and clicks per block. Free.",
        linktree: "Basic on Free. Longer history on paid plans, up to lifetime on Premium.",
      },
      {
        feature: "Collect emails from fans",
        trenodo: "No.",
        linktree: "Yes, from Starter.",
      },
      {
        feature: "Schedule links",
        trenodo: "No. You show and hide blocks by hand.",
        linktree: "Yes, from Starter.",
      },
    ],
  },
  {
    group: "The bigger picture",
    rows: [
      {
        feature: "Made for",
        trenodo: "Musicians only.",
        linktree: "Everyone: creators, brands and businesses. With good music features on top.",
      },
      {
        feature: "Other tools in the same account",
        trenodo: "Press Kit, Setlist and Tutor. A release block reads straight from your press kit. And your releases can be picked for Spotlight.",
        linktree: "Link in bio, plus its own shop and marketing tools.",
      },
      {
        feature: "Track record",
        trenodo: "New and small. Built by one musician.",
        linktree: "Around since 2016, with millions of users.",
      },
    ],
  },
];

const LINKTREE_WINS = [
  "Smart links that find your track on every streaming service by themselves.",
  "Built in pre-saves, and tour dates from Bandsintown or Seated.",
  "Email collection and link scheduling, if you pay for them.",
  "A shop for merch and digital products.",
  "Many years of track record, and a big team behind it.",
];

const TRENODO_WINS = [
  "Everything is free. No trial, no plan to upgrade to.",
  "Remove the logo, pick your colours and see your numbers. All free.",
  "Made only for musicians, so the page stays simple.",
  "Your link in bio, press kit and setlists live in one account.",
  "A release button that switches from Pre-save to Listen on release day.",
];

const FAQS = [
  {
    q: "Is Trenodo really free, or is that a trial?",
    a: "Really free. Link in Bio has no paid plan, and no feature on this page costs money. Trenodo is small, and free is how musicians find the rest of the toolbox.",
  },
  {
    q: "Is Linktree bad for musicians?",
    a: "No. Linktree has strong music features, like smart links, pre-saves and tour dates. If you use those, or you sell merch from your bio, Linktree is a good choice. This page tries to show that honestly.",
  },
  {
    q: "Can I move from Linktree to Trenodo?",
    a: "Yes, but by hand. There is no import button. You add your links again, which takes about ten minutes for most artists. Then you swap the link in your bio.",
  },
  {
    q: "Where do these facts come from?",
    a: "Linktree's own help center and pricing guides, linked at the bottom of the page. Prices are in US dollars and change often. We check again every few months.",
  },
] as const;

const SOURCES = [
  { label: "Linktree pricing", href: "https://linktr.ee/s/pricing" },
  {
    label: "Linktree Help Center: Can I hide the Linktree logo?",
    href: "https://help.linktr.ee/en/articles/5434182-can-i-hide-the-linktree-logo",
  },
  {
    label: "Linktree Help Center: Tours and Events links",
    href: "https://help.linktr.ee/en/articles/5915532-how-to-add-a-bandsintown-link",
  },
  {
    label: "Linktree for musicians: smart links and pre-saves",
    href: "https://linktr.ee/blog/share-streaming-music-link-on-linktree",
  },
  {
    label: "Talkspresso: Linktree pricing, plans and seller fees (2026)",
    href: "https://talkspresso.com/blog/linktree-pricing",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Trenodo vs Linktree: An Honest Comparison for Musicians",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
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

function WinList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
          <span
            aria-hidden
            className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
              <path
                d="m5 10.5 3 3 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TrenodoVsLinktreePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="brand-wash" />
          <div className={container}>
            <div className="max-w-2xl">
              <Link
                href="/compare"
                className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft transition-colors hover:text-foreground ${focusable}`}
              >
                <span aria-hidden>⚖️</span>
                Compare
              </Link>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
                Trenodo vs Linktree
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
                Both give you one link for your bio. But they are built for
                different people. Here is an honest side by side. Yes, we
                are Trenodo. So we link every Linktree fact to its source,
                and we tell you where Linktree is the better pick.
              </p>
              <p className="mt-4 text-sm text-faint">
                Last checked {LAST_CHECKED}. Prices in US dollars.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-line/70 bg-surface-muted/40 py-20 sm:py-24">
          <div className={container}>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
              The short answer
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-4xl border border-line bg-surface p-8 shadow-soft">
                <h2 className="text-xl font-semibold tracking-tight">Choose Linktree if…</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                  you want smart links, built in pre-saves and tour dates. Or
                  you sell merch from your bio, or want to grow an email list.
                  And you don&rsquo;t mind paying for the extras.
                </p>
              </div>
              <div className="rounded-4xl border-2 border-brand-500/40 bg-surface p-8 shadow-soft">
                <h2 className="text-xl font-semibold tracking-tight">Choose Trenodo if…</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                  you want a clean page for your music that is free all the
                  way. No logo, your own colours, real numbers. Plus a press
                  kit and setlists in the same account. 🎸
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${container} py-24 sm:py-32`}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
              Side by side
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
              Feature by feature
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-4xl border border-line bg-surface shadow-soft">
            <div className="grid grid-cols-2 border-b border-line bg-surface-muted/60 text-sm font-semibold sm:grid-cols-[1.1fr_1fr_1fr]">
              <div className="hidden px-6 py-4 text-muted sm:block">Feature</div>
              <div className="px-5 py-4 text-brand-700 sm:px-6">Trenodo</div>
              <div className="px-5 py-4 sm:px-6">Linktree</div>
            </div>

            {ROWS.map((group) => (
              <div key={group.group}>
                <div className="border-b border-line bg-surface-muted/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:px-6">
                  {group.group}
                </div>
                {group.rows.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-2 border-b border-line last:border-b-0 sm:grid-cols-[1.1fr_1fr_1fr]"
                  >
                    <div className="col-span-2 px-5 pt-4 text-[15px] font-semibold sm:col-span-1 sm:px-6 sm:py-4">
                      {row.feature}
                    </div>
                    <div className="px-5 py-3 text-sm leading-relaxed text-foreground text-pretty sm:px-6 sm:py-4">
                      {row.trenodo}
                    </div>
                    <div className="px-5 py-3 text-sm leading-relaxed text-muted text-pretty sm:px-6 sm:py-4">
                      {row.linktree}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-linear-to-br from-brand-700 via-brand-800 to-brand-900 py-24 sm:py-32">
          <div className={container}>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-200">
                Credit where it&rsquo;s due
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white text-balance">
                Where each one wins
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/35">
                <h3 className="text-lg font-semibold tracking-tight">Linktree is stronger at</h3>
                <WinList items={LINKTREE_WINS} />
              </div>
              <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/35">
                <h3 className="text-lg font-semibold tracking-tight">Trenodo is stronger at</h3>
                <WinList items={TRENODO_WINS} />
              </div>
            </div>
          </div>
        </section>

        <FaqSection items={FAQS} />

        <section className={`${containerNarrow} py-16`}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
            Sources
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {SOURCES.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`text-brand-700 hover:underline ${focusable} rounded`}
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted text-pretty">
            Spotted something that&rsquo;s out of date? Tell us on the{" "}
            <Link href="/ideas" className={`text-brand-700 hover:underline ${focusable} rounded`}>
              Ideas page
            </Link>
            , and we fix it. Linktree is a trademark of Linktree Pty Ltd.
            Trenodo is not connected to Linktree in any way.
          </p>
        </section>

        <section className={`${containerNarrow} pb-24 sm:pb-32`}>
          <div className="brand-wash-clip relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
            <div className="brand-wash" />
            <h2 className="text-4xl font-semibold tracking-tight text-balance">
              Try it. It costs nothing.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
              Claim your handle and add your first block. If Linktree still
              fits you better, no hard feelings. 🙂
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create your free account
              </Link>
              <Link href="/link-in-bio" className={`${buttonGhost} ${buttonLarge}`}>
                See Link in Bio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
