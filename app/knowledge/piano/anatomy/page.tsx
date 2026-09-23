import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ZoomableImage } from "../../_components/zoomable-image";

const PAGE_DESCRIPTION =
  "How a piano keyboard is laid out. White keys, black keys, and the one trick that lets you find any note without counting.";

export const metadata: Metadata = {
  title: "Piano Keyboard Layout: White Keys, Black Keys and How to Find Any Note | Trenodo",
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
    a: "A full size piano has 88 keys: 52 white and 36 black. That is a little more than seven octaves. A keyboard or digital piano often has fewer, like 61 or 76. That is plenty for almost everything a beginner plays.",
  },
  {
    q: "Why are the black keys in groups of two and three?",
    a: "The white keys are seven natural notes, and the gaps between them are not all the same size. The black keys fill the five gaps. Between E and F, and between B and C, there is no gap. That is what splits the black keys into groups of two and three.",
  },
  {
    q: "Are C# and Db the same key?",
    a: "Yes. Same key, two names. Which name you use depends on the key of the music. For finding the note on the keyboard, it makes no difference.",
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
        intro="A modern piano has 88 keys. That sounds like a lot. But they all follow the same short pattern, again and again. Learn the pattern once, and you can find any note on any keyboard. 🎹"
      >
        <GuideSection title="White keys: the seven natural notes">
          <p>
            The white keys are the seven natural notes: C, D, E, F, G, A and
            B. They repeat all the way up the keyboard, one octave after the
            other. Every other key on the piano gets its name from these
            seven.
          </p>
        </GuideSection>

        <GuideSection title="Black keys: the five in between">
          <p>
            The black keys sit in the gaps between the white keys. Each black
            key has two names. It is the sharp (♯) of the white key below it,
            and the flat (♭) of the white key above it. So C♯ and D♭ are the
            exact same key. The name you use depends on the music, not on the
            keyboard.
          </p>
          <p>
            There are only five black keys in each octave, not seven. Why?
            Because two pairs of white keys have no gap between them: E and F,
            and B and C. That is why the black keys come in groups of two and
            three. And that pattern is exactly what makes the keyboard easy to
            read.
          </p>
        </GuideSection>

        <GuideSection title="Find C without counting">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <p className="sm:flex-1">
              Look for a group of two black keys. The white key just to the
              left of it is always C. Every time, everywhere on the keyboard.
              From there, the other notes follow in order: C, D, E around the
              group of two. Then F, G, A, B around the group of three. And
              then C again. 💡
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
