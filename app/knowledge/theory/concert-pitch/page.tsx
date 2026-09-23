import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why A is tuned to 440 Hz, where concert pitch sits on the staff, and what it means to be in tune with other musicians.";

export const metadata: Metadata = {
  title: "Concert Pitch Explained: Why A = 440 Hz | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory/concert-pitch" },
  openGraph: {
    title: "Concert Pitch Explained: Why A = 440 Hz",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory/concert-pitch",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Do I have to tune to 440 Hz?",
    a: "Not really. When you practice alone, it makes no difference. It matters when you play with others. 440 Hz is the shared reference that keeps everybody's instruments in tune with each other.",
  },
  {
    q: "How do I tune to concert pitch?",
    a: "The easiest way is a tuner set to A440, or a tuning fork made for that note. On guitar, start with the second string from the top, the A string. Tune it to A440, and then tune the other strings to it.",
  },
  {
    q: "Has concert pitch always been 440 Hz?",
    a: "No. Today 440 Hz is the international standard. But in the past, the reference note has changed a lot. It is an agreement between musicians, not a law of physics.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Concert Pitch Explained: Why A = 440 Hz",
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

export default function ConcertPitchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Music Theory"
        categoryHref="/knowledge/theory"
        title="Concert Pitch Explained: Why A = 440 Hz"
        intro="Concert pitch is the reference note that all instruments tune to. Acoustic or electronic. It is the note A, set to 440 Hz. A pitch perfect agreement, you could say. 🎵"
      >
        <GuideSection title="What it is, and where it sits">
          <p>
            On the staff, concert pitch sits just above the line the treble
            clef curls around. In practice, it is simply the starting point.
            All the other notes are tuned from it.
          </p>
          <p>
            The easiest way to find it is a tuner set to A440, or a tuning
            fork made for that note. On guitar, the second string from the
            top is the A string. Tune that one to concert pitch first. Then
            tune the other strings to it.
          </p>
        </GuideSection>

        <GuideSection title="Is it really needed?">
          <p>
            No. Nothing stops you from tuning to another reference. And when
            you play alone, it makes no difference. What concert pitch solves
            is playing together. It is a shared agreement, used all over the
            world, that keeps everyone&rsquo;s instrument in tune with everyone
            else&rsquo;s. The moment you play with other people, it matters. That
            is why almost all professional musicians use it.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
