import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Singing is the one instrument you can't buy or swap out — how to get comfortable with your own voice before worrying about technique.";

export const metadata: Metadata = {
  title: "Getting Started with Singing — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals/getting-started" },
  openGraph: {
    title: "Getting Started with Singing",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals/getting-started",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "I don't like the sound of my own voice — is that normal?",
    a: "Very. Most people are unused to hearing their voice the way a microphone or a recording captures it, rather than the way it sounds inside their own head. That reaction fades with exposure, not with a different voice.",
  },
  {
    q: "Do I need lessons to start singing?",
    a: "No — singing along to songs you like at home, with no pressure or audience, is a completely valid way to start. Lessons matter more once you're trying to unlock range, power or control you don't have yet.",
  },
  {
    q: "What should I actually practice first?",
    a: "Comfort before technique. Get used to your own tone and how your voice sits in a song before layering in the more technical breath-support work.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Getting Started with Singing",
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

export default function VocalsGettingStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Vocals"
        categoryHref="/knowledge/vocals"
        title="Getting Started with Singing"
        intro="Singing is different from every other instrument on this site in one specific way: you use your own body as the instrument, which means every voice is a little different by default."
      >
        <GuideSection title="Your voice is already an instrument">
          <p>
            That uniqueness isn&rsquo;t a flaw to fix — it&rsquo;s the raw material a
            personal singing style is built from. Two singers can learn the
            exact same technique and still sound completely different,
            because the instrument itself (their voice) is different. That&rsquo;s
            not true of two guitarists playing the same guitar.
          </p>
        </GuideSection>

        <GuideSection title="Where to actually start">
          <p>
            The simplest starting point is also the most effective one:
            sing along to songs you already like, at home, with no pressure.
            The goal at this stage isn&rsquo;t correctness — it&rsquo;s comfort. Get
            used to the sound and feel of your own voice, and start
            noticing which songs sit naturally in your range and which ones
            feel like a stretch.
          </p>
          <p>
            From there, two natural next steps: find a singing teacher to
            start unlocking range and control you don&rsquo;t have yet, or start
            performing along to an instrument — a guitarist or pianist
            playing while you sing — which teaches you to hold your own
            part against a real accompaniment.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
