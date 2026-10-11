import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection, GuideStep } from "../../_components/guide-layout";
import { CalendarIcon, ChecklistIcon, CoinsIcon, WarningIcon } from "../../_components/guide-icons";
import { TermLink } from "@/app/_components/term-link";
import { GigCalculator } from "./_components/gig-calculator";
import { GIG_TYPES } from "./gig-types";

const TITLE = "How Much to Charge for a Gig";
const PAGE_DESCRIPTION =
  "Work out what to charge for a gig, in your own currency: count every hour, not just stage time, price by the kind of gig, and get it in writing. With a free gig fee calculator.";

export const metadata: Metadata = {
  title: `${TITLE}: Gig Fee Calculator for Musicians | Trenodo`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/perform/gig-fees" },
  openGraph: {
    title: `${TITLE}: Gig Fee Calculator for Musicians`,
    description: PAGE_DESCRIPTION,
    url: "/knowledge/perform/gig-fees",
    siteName: "Trenodo",
    type: "article",
  },
};

const DEALS = [
  {
    title: "Fixed fee",
    body: "One agreed sum, whatever happens on the night. The safest deal, and the one to aim for.",
    good: "You know what you'll earn",
    watch: "Agree it before the gig, in writing",
  },
  {
    title: "Door split",
    body: "A share of the ticket money. Common in clubs and for touring bands.",
    good: "A full room pays more than a fee",
    watch: "An empty room pays nothing",
  },
  {
    title: "Fee plus a bonus",
    body: "A smaller guaranteed fee, plus a share of the door above a set number of tickets.",
    good: "A floor and an upside",
    watch: "Ask how tickets are counted",
  },
] as const;

const CONTRACT = [
  "Date, arrival time and set times",
  "The fee, and when and how it's paid",
  "Deposit and what happens if it's cancelled",
  "Who brings the sound system and the lights",
  "Number and length of sets, and breaks",
  "Parking, food and drinks for the band",
];

const FAQS = [
  {
    q: "How much should I charge for a gig?",
    a: "Count every hour the gig takes, from rehearsal and travel to packing up, and multiply by what an hour of skilled work is worth where you live. Add your costs, then adjust for the kind of gig: a wedding or a corporate event is worth more than a bar. The calculator on this page does the sums in any currency.",
  },
  {
    q: "Should I ask for a deposit?",
    a: "Yes, for private parties, weddings and corporate events. A quarter to half of the fee, paid when the date is booked, is normal. It holds the date for them, and protects you if they cancel.",
  },
  {
    q: "Why can I charge more for a wedding?",
    a: "Because there's no second chance. A wedding means a long day, special songs to learn, a tight schedule and a couple who will remember every minute. That responsibility is worth paying for.",
  },
  {
    q: "What do I say when they say it's too expensive?",
    a: "Explain what the price includes: the hours behind the set, the gear and the rehearsals. Then offer a smaller version, like a shorter set or fewer musicians, instead of the same show for less.",
  },
  {
    q: "Should I ever play for free?",
    a: "Sometimes. For a cause you care about, or a showcase in front of people who book bands. But a business that makes money on the night can pay the musicians who make the night.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
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

export default function GigFeesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Performing"
        categoryHref="/knowledge/perform"
        title={TITLE}
        intro="An hour on stage is never an hour of work. Rehearsal, travel, setup and the drive home all come first. Count them, and your price makes sense anywhere in the world. 💸"
      >
        <section aria-labelledby="calculator-heading">
          <h2 id="calculator-heading" className="sr-only">
            Gig fee calculator
          </h2>
          <GigCalculator />
        </section>

        <GuideStep step={1} icon={<CalendarIcon />} title="Count every hour, not just the set">
          <p>
            A two-hour set is often an eight-hour day. Rehearsing the songs, loading the car,
            driving there, setting up, the soundcheck, the wait, the set itself, and packing it all
            down again. If you only charge for the stage, you&rsquo;re working most of the day for
            free.
          </p>
        </GuideStep>

        <GuideStep step={2} icon={<CoinsIcon />} title="Start from your local hourly worth">
          <p>
            What a musician can charge depends on where you live, so start from your own market. A
            fair yardstick: what a skilled tradesperson charges per hour where you play, like an
            electrician or a hairdresser. You&rsquo;re a skilled professional too, with years of
            practice behind every hour.
          </p>
        </GuideStep>

        <GuideStep step={3} icon={<ChecklistIcon />} title="Price by what the gig means to them">
          <p>Same songs, different stakes. The more depends on the night, the more it&rsquo;s worth.</p>
          <ol className="grid gap-2 sm:grid-cols-4">
            {GIG_TYPES.map((gig, index) => (
              <li key={gig.key} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
                <div className="flex items-end gap-1" aria-hidden="true">
                  {GIG_TYPES.map((_, bar) => (
                    <span
                      key={bar}
                      className={`w-2 rounded-full ${bar <= index ? "bg-brand-600" : "bg-surface-muted"}`}
                      style={{ height: `${8 + bar * 6}px` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{gig.label}</p>
                <p className="text-lg font-semibold text-brand-700">×{gig.multiplier}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{gig.why}</p>
              </li>
            ))}
          </ol>
        </GuideStep>

        <GuideStep step={4} icon={<WarningIcon />} title="Get it in writing" rail={false}>
          <p>
            A short agreement, even an email, saves a long argument. Before the date is confirmed,
            agree on:
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CONTRACT.map((item) => (
              <li key={item} className="flex items-start gap-2.5 rounded-2xl bg-surface-muted/60 px-4 py-3 text-sm text-foreground">
                <span aria-hidden="true" className="mt-0.5 font-bold text-brand-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </GuideStep>

        <GuideSection title="Three ways to get paid">
          <div className="grid gap-3 sm:grid-cols-3">
            {DEALS.map((deal) => (
              <div key={deal.title} className="flex flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft">
                <p className="text-base font-semibold text-foreground">{deal.title}</p>
                <p className="mt-2 text-sm leading-relaxed">{deal.body}</p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-emerald-700">+</span> {deal.good}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold text-rose-700">−</span> {deal.watch}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Make booking you easy">
          <p>
            Bookers pick the band that&rsquo;s easiest to say yes to. Put your best live video, your
            songs and your contact details in one place with a{" "}
            <TermLink href="/link-in-bio">Link in Bio</TermLink> page, and walk into the gig with a
            ready <TermLink href="/setlist">Setlist</TermLink>. 🎤
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
