import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How to transpose a song to a different key on guitar — the fast way with a capo, and the manual way without one.";

export const metadata: Metadata = {
  title: "How to Transpose Guitar Chords (With or Without a Capo) — Trenodo",
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
    a: "It clamps across all six strings at a chosen fret, acting as a movable nut. Every chord shape you already know sounds higher in pitch by however many frets up the capo sits, without changing a single finger position.",
  },
  {
    q: "How many frets equal one tone?",
    a: "Two frets equal one whole tone; one fret equals a half-tone (semitone). A capo on the 2nd fret raises everything by a whole tone; the 1st fret raises it by a semitone.",
  },
  {
    q: "Why transpose a song at all?",
    a: "Usually to fit a singer's vocal range, or to swap awkward chords (like barre chords) for easier open-chord shapes in a different key.",
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
        intro="Transposing means shifting every chord in a song up or down by the same amount, to play it in a different key. There are two ways to do it."
      >
        <GuideSection title="With a capo — the fast way">
          <p>
            Clamp a capo on the fretboard and play the exact same chord
            shapes you already know — the capo does the transposing for you.
            A song in C major (chords C, Am, G, F) played with a capo on the
            2nd fret sounds in D major: those same shapes now ring out as D,
            Bm, A and G. Move the capo to the 3rd fret instead and the same
            shapes sound a half-tone higher again.
          </p>
        </GuideSection>

        <GuideSection title="Without a capo — the manual way">
          <p>
            Work out the new chord names directly and play them as their own
            shapes. Raising that same C, Am, F, G progression by one whole
            tone (without a capo) gives you D, Bm, G and A — the same chords
            a capo on the 2nd fret would have given you, just played as
            their actual shapes instead of borrowed ones. A tone scale (or
            the circle of fifths) is the standard reference for working out
            which chord a given shift lands on.
          </p>
        </GuideSection>

        <GuideSection title="Which one should you use?">
          <p>
            A capo is faster and asks nothing new of your fretting hand,
            which is why it&rsquo;s the default choice for most guitarists.
            Transposing manually is worth learning too — it&rsquo;s what lets you
            play the new key&rsquo;s chords without a capo at all, and it builds a
            much better working knowledge of how keys relate to each other.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
