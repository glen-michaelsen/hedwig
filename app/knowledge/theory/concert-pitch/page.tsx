import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why A is tuned to 440 Hz, where concert pitch sits on the staff, and what it actually means to be in tune with other musicians.";

export const metadata: Metadata = {
  title: "Concert Pitch Explained: Why A = 440 Hz — Trenodo",
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
    a: "Not strictly — practicing alone, it makes no difference. It matters the moment you play with other musicians, since 440 Hz is the shared reference that keeps everyone's instruments compatible with each other.",
  },
  {
    q: "How do I actually tune to concert pitch?",
    a: "The simplest way is a tuner set to A440, or a tuning fork built for that exact pitch. On guitar, the second string from the top (the A string) is the natural starting point — tune it to A440, then tune the rest of the strings relative to it.",
  },
  {
    q: "Has concert pitch always been 440 Hz?",
    a: "440 Hz is a widely adopted international standard today, but historically the reference pitch has varied — it's a convention that's been settled on over time, not a fixed law of physics.",
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
        intro="Concert pitch is the reference tone every instrument — acoustic or electronic — is tuned against: the note A, set to 440 Hz."
      >
        <GuideSection title="What it is and where it sits">
          <p>
            On a standard staff, concert pitch sits just above the treble
            clef&rsquo;s own reference line. In practical terms, it&rsquo;s simply the
            starting point every other note gets tuned relative to.
          </p>
          <p>
            The easiest way to find it is a tuner set to A440, or a tuning
            fork built for that exact pitch. On guitar specifically, the
            second string from the top — the A string — is the natural
            reference point: tune it to concert pitch first, then tune the
            rest of the strings relative to it.
          </p>
        </GuideSection>

        <GuideSection title="Is it actually required?">
          <p>
            No — nothing stops you from tuning to a different reference
            entirely, and playing alone it makes no practical difference.
            What concert pitch actually solves is compatibility: it&rsquo;s a
            shared, globally adopted convention that keeps every musician&rsquo;s
            instrument in tune with everyone else&rsquo;s. It matters the moment
            you want to play with other people, which is why it&rsquo;s so widely
            adopted by professionals even though it&rsquo;s not a hard requirement.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
