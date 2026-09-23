import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why one note actually sounds like several notes at once. And how to play a single overtone on its own, as a natural harmonic.";

export const metadata: Metadata = {
  title: "Overtones Explained: Why One Note Sounds Full | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory/overtones" },
  openGraph: {
    title: "Overtones Explained: Why One Note Sounds Full",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory/overtones",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Can I hear the overtones on their own?",
    a: "Not when you play normally. They blend into the main note and give it a full, rich sound. A natural harmonic is the exception. It lets you hear one overtone on its own.",
  },
  {
    q: "How do I play a natural harmonic on guitar?",
    a: "Put a finger lightly on a string, right above a fret. Don't press it down. Play the string, and then lift your finger. What keeps ringing is a single overtone.",
  },
  {
    q: "Why does a natural harmonic sound so different?",
    a: "You hear one overtone alone, without the main note and the other overtones. That makes it brighter, thinner and less full than a normal note. It is also quieter.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Overtones Explained: Why One Note Sounds Full",
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

export default function OvertonesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Music Theory"
        categoryHref="/knowledge/theory"
        title="Overtones Explained: Why One Note Sounds Full"
        intro="When you play one note, you never hear just one note. You hear the main note, plus a row of quieter and higher notes on top. All at the same time."
      >
        <GuideSection title="What overtones are">
          <p>
            The main note is called the fundamental. Together with the
            overtones, they are called partials. The fundamental is the first
            partial. The overtones work like backing singers. You don&rsquo;t hear
            them as separate notes. But they are what makes an instrument
            sound full and rich, instead of flat. 🎶
          </p>
          <p>
            Overtones also make their own overtones. But they are so quiet
            that you can&rsquo;t really hear them.
          </p>
        </GuideSection>

        <GuideSection title="Play one alone: natural harmonics">
          <p>
            On a guitar, you can play a single overtone on its own. Put a
            finger lightly on a string, right above a fret. Don&rsquo;t press it
            down to the fretboard. Play the string, and then lift your finger.
            What keeps ringing is a natural harmonic. One overtone, without
            the main note under it.
          </p>
          <p>
            A natural harmonic sounds very different from a normal note. It
            is brighter, thinner and less full. And it is quieter. That makes
            it perfect when a part needs a soft, bell like sound. But because
            it is quiet, you can&rsquo;t use it everywhere.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
