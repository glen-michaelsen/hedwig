import type { Metadata } from "next";
import { GuitarTuner } from "../../_components/guitar-tuner";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Standard guitar tuning, an easy way to remember the string names, and the apps, clip-on tuners and online tools that make tuning easy.";

export const metadata: Metadata = {
  title: "How to Tune a Guitar: String Names and the Best Tuners | Trenodo",
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
    a: "From the thickest string to the thinnest: E, A, D, G, B, E. The lowest and the highest string have the same name. They are two octaves apart. Same note, much lower or higher.",
  },
  {
    q: "How can I remember the string names?",
    a: "\"Eddie Ate Dynamite, Good Bye Eddie.\" The first letter of each word gives you E, A, D, G, B, E. From the thickest string to the thinnest.",
  },
  {
    q: "Can I tune a guitar without a tuner?",
    a: "Yes. You can tune by ear against a reference note, like a piano or another instrument. You can also press each string on the 5th fret, and match it to the next open string. It is a good skill to have. But a tuner is faster and more precise, especially while your ear is still learning.",
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
    {
      "@type": "SoftwareApplication",
      name: "Trenodo Guitar Tuner",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web-based)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "A free chromatic guitar tuner in your browser. It uses your microphone. No app and no account needed.",
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
        intro="Tuning is simple when you know what each string should sound like. Try the tuner below with your own microphone. Or read on for the string names and the other tools that help. Let's get you in tune. 🎸"
      >
        <GuitarTuner />

        <GuideSection title="Standard tuning">
          <p>
            From the thickest string to the thinnest, standard tuning is: E,
            A, D, G, B, E. When you play a string open, with no finger on it,
            it should ring at exactly that note. That is the goal for every
            tuning method on this page.
          </p>
          <p>
            An easy way to remember the order: &ldquo;Eddie Ate Dynamite, Good Bye
            Eddie.&rdquo;
          </p>
        </GuideSection>

        <GuideSection title="Tuning with an app">
          <p>
            This is the fastest way for most people. Point your phone&rsquo;s
            microphone at the guitar. The app tells you if each string is too
            high, too low or in tune. GuitarTuna, Fender Tune, BOSS Tuner and
            ClearTune all do this well.
          </p>
        </GuideSection>

        <GuideSection title="Tuning with a clip-on tuner">
          <p>
            A small tuner you clip onto the head of the guitar. It reads the
            vibration, not the sound. That makes it great in a noisy room,
            where a phone app struggles. The TC Electronic PolyTune and the
            Korg TM-60 are both reliable and cheap. Nice to keep in your gig
            bag.
          </p>
        </GuideSection>

        <GuideSection title="Tuning online">
          <p>
            Many free tuners run in your browser and only need your
            computer&rsquo;s microphone. The one at the top of this page is one of
            them. 👆 Very handy when you practice at your desk, and your phone
            is in the other room.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
