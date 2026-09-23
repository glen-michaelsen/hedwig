import type { Metadata } from "next";
import { ChordFigure } from "../../_components/chord-figure";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import {
  BARRE_CHORDS,
  CAPO_TRANSPOSE_EXAMPLE,
  OPEN_CHORDS,
} from "@/lib/chord-diagrams/guitar-chords";

const findChord = (slug: string) =>
  [...OPEN_CHORDS, ...BARRE_CHORDS].find((c) => c.slug === slug)!;

const ORIGINAL_SHAPES = ["c-major", "a-minor", "f-major", "g-major"].map(
  findChord,
);
const REAL_SHAPES = ["d-major", "b-minor", "g-major", "a-major"].map(
  findChord,
);

const PAGE_DESCRIPTION =
  "How to move a song to a new key on guitar. The fast way with a capo, and the manual way without one.";

export const metadata: Metadata = {
  title: "How to Transpose Guitar Chords (With or Without a Capo) | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/transposing" },
  openGraph: {
    title: "How to Transpose Guitar Chords (With or Without a Capo)",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/transposing",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What does a capo actually do?",
    a: "It clamps across all six strings on a fret you choose. It works like a nut you can move. Every chord shape you know now sounds higher, one half step for each fret. Your fingers don't change at all.",
  },
  {
    q: "How many frets is one whole tone?",
    a: "Two frets is one whole tone. One fret is a half tone, also called a semitone. A capo on the 2nd fret raises everything a whole tone. On the 1st fret, it is a semitone.",
  },
  {
    q: "Why transpose a song at all?",
    a: "Usually so it fits the singer's voice better. Or to swap hard chords, like barre chords, for easier open chords in another key.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Transpose Guitar Chords (With or Without a Capo)",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: [
        ...ORIGINAL_SHAPES,
        ...CAPO_TRANSPOSE_EXAMPLE,
        ...REAL_SHAPES,
      ].map(
        (chord) =>
          `https://trenodo.com/images/knowledge/guitar/chords/${chord.slug}.svg`,
      ),
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

export default function GuitarTransposingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="How to Transpose Guitar Chords (With or Without a Capo)"
        intro="To transpose means to move every chord in a song up or down by the same amount. Then you play it in a new key. There are two ways to do it."
      >
        <GuideSection title="With a capo: the fast way">
          <p>
            Put a capo on the neck, and play the same chord shapes you already
            know. The capo does the transposing for you. Take a song in C
            major with the chords C, Am, F and G. Put a capo on the 2nd fret,
            and the song is now in D major. The same shapes now sound as D,
            Bm, G and A.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ORIGINAL_SHAPES.map((chord) => (
              <ChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
          <p>
            Put the capo on the 2nd fret and play the same four shapes. This
            is what you hear:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CAPO_TRANSPOSE_EXAMPLE.map((chord) => (
              <ChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
          <p>
            Move the capo to the 3rd fret, and the same shapes sound one more
            half step higher. Easy, right? 🙂
          </p>
        </GuideSection>

        <GuideSection title="Without a capo: the manual way">
          <p>
            Here you find the new chord names yourself, and play them as their
            real shapes. Raise C, Am, F and G by one whole tone, without a
            capo, and you get the chords below. They are the same chords the
            capo gave you. You just play the real shapes instead of borrowed
            ones. A tone scale or the circle of fifths helps you find the
            right chord for any shift.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {REAL_SHAPES.map((chord) => (
              <ChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Which one should you use?">
          <p>
            A capo is faster, and your hand doesn&rsquo;t need to learn anything
            new. That is why most guitarists reach for it first. But learn the
            manual way too. It lets you play in the new key without a capo.
            And it teaches you how keys connect to each other. That knowledge
            pays off again and again. 💡
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
