import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Standard guitar tuning, an easy way to remember the string names, and the tuner apps, clip-ons and online tools that make tuning painless.";

export const metadata: Metadata = {
  title: "How to Tune a Guitar: String Names and the Best Tuners — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/tuning" },
  openGraph: {
    title: "How to Tune a Guitar: String Names and the Best Tuners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/tuning",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What are the guitar string names?",
    a: "From the thickest string to the thinnest: E, A, D, G, B, E. The low and high strings share a name because they're two octaves apart — the same note, just far lower or higher in pitch.",
  },
  {
    q: "What's a good way to remember the string names?",
    a: "\"Eddie Ate Dynamite, Good Bye Eddie\" — each word's first letter spells out E, A, D, G, B, E in order from the thickest string to the thinnest.",
  },
  {
    q: "Can I tune a guitar without a tuner?",
    a: "Yes, by ear against a reference pitch — a piano, another instrument, or fretting each string at the 5th fret to match the pitch of the next open string down. It's a useful skill, but a tuner is faster and more accurate, especially while you're still learning to hear pitch differences.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Tune a Guitar: String Names and the Best Tuners",
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

export default function GuitarTuningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="How to Tune a Guitar: String Names and the Best Tuners"
        intro="Tuning is simple once you know the target pitches. Here's what each string should sound like, and the easiest tools for getting there."
      >
        <GuideSection title="Standard tuning">
          <p>
            From the thickest string to the thinnest, a guitar in standard
            tuning is: E, A, D, G, B, E. Each string, played open (without
            fretting anything), should ring out at that exact pitch — that&rsquo;s
            the target every tuning method below is aiming for.
          </p>
          <p>
            A common way to remember the order: &ldquo;Eddie Ate Dynamite, Good Bye
            Eddie.&rdquo;
          </p>
        </GuideSection>

        <GuideSection title="Tuning with an app">
          <p>
            The fastest option for most people — point your phone&rsquo;s
            microphone at the guitar and it tells you whether each string is
            sharp, flat, or in tune. GuitarTuna, Fender Tune, BOSS Tuner and
            ClearTune all do this well and work off a single phone mic.
          </p>
        </GuideSection>

        <GuideSection title="Tuning with a clip-on tuner">
          <p>
            A small tuner that clips onto the headstock and reads pitch
            through vibration rather than sound — useful in a noisy room
            where a microphone-based app struggles. The TC Electronic
            PolyTune and Korg TM-60 are both reliable, inexpensive options
            worth keeping in a gig bag.
          </p>
        </GuideSection>

        <GuideSection title="Tuning online">
          <p>
            Plenty of free, browser-based tuners work off nothing more than
            your computer&rsquo;s built-in microphone — handy if you&rsquo;re practising
            at a desk and don&rsquo;t have a phone or clip-on tuner to hand.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
