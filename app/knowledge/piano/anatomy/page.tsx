import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ZoomableImage } from "../../_components/zoomable-image";

const PAGE_DESCRIPTION =
  "How a piano keyboard is laid out — white keys, black keys, and the one landmark that lets you find any note without counting from the end.";

export const metadata: Metadata = {
  title: "Piano Keyboard Layout: White Keys, Black Keys and How to Find Any Note — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/piano/anatomy" },
  openGraph: {
    title: "Piano Keyboard Layout: White Keys, Black Keys and How to Find Any Note",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/piano/anatomy",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "How many keys does a piano have?",
    a: "A full-size modern piano has 88 keys — 52 white and 36 black, spanning a little over seven octaves. A keyboard or digital piano often has fewer (61 or 76 are common), which is plenty for almost everything a beginner plays.",
  },
  {
    q: "Why are the black keys grouped in twos and threes instead of spaced evenly?",
    a: "Because the underlying pattern is seven unevenly-spaced whole tones (the white keys), and the black keys fill in the five gaps between them — the two spots without a gap (between E and F, and between B and C) are what breaks the black keys into groups of two and three.",
  },
  {
    q: "Are C# and Db the same key?",
    a: "Yes — same physical key, two names. Which name is used depends on the surrounding key signature, but for finding notes on the keyboard itself, it makes no difference.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline:
        "Piano Keyboard Layout: White Keys, Black Keys and How to Find Any Note",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: ["https://trenodo.com/images/knowledge/piano/reference/find-c.svg"],
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

export default function PianoAnatomyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Piano"
        categoryHref="/knowledge/piano"
        title="Piano Keyboard Layout: White Keys, Black Keys and How to Find Any Note"
        intro="A modern piano has 88 keys, but they're all built from the same short repeating pattern — learn that pattern once and you can find any note on any size keyboard."
      >
        <GuideSection title="White keys: the seven whole tones">
          <p>
            The white keys are the seven natural notes — C, D, E, F, G, A and
            B — repeating up the keyboard, one octave after another. Every
            other key on the piano, black or white, is named relative to
            these seven.
          </p>
        </GuideSection>

        <GuideSection title="Black keys: the five semitones">
          <p>
            The black keys fill the gaps between white keys, and each one has
            two names: it&rsquo;s a sharp (♯) of the white key just below it, and a
            flat (♭) of the white key just above it. C♯ and D♭ are the exact
            same physical key — which name gets used just depends on the
            musical context, not on the keyboard itself.
          </p>
          <p>
            There are only five black keys per octave, not seven, because two
            pairs of white keys sit right next to each other with no gap: E
            and F, and B and C. That&rsquo;s the whole reason the black keys come
            in groups of two and three instead of being evenly spaced — and
            it&rsquo;s also the landmark that makes the keyboard easy to read at a
            glance.
          </p>
        </GuideSection>

        <GuideSection title="Finding C without counting">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <p className="sm:flex-1">
              Look for a group of exactly two black keys. The white key
              immediately to its left is always C — every time, anywhere on
              the keyboard. From there, the rest of the natural notes just
              follow in order: C, D, E (the three white keys around that
              group of two), then F, G, A, B (the four white keys around the
              next group of three), then C again.
            </p>
            <ZoomableImage
              src="/images/knowledge/piano/reference/find-c.svg"
              alt="Piano keyboard with C marked as the white key to the left of the two-black-key group"
              width={492}
              height={182}
              title="Finding C on the keyboard"
              className="mx-auto w-full max-w-xs sm:mx-0 sm:max-w-xs sm:shrink-0"
            />
          </div>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
