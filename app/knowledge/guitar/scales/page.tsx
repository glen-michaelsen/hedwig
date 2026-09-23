import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ScaleFigure } from "../../_components/scale-figure";
import { GUITAR_SCALES } from "@/lib/scale-diagrams/guitar-scales";

const PAGE_DESCRIPTION =
  "The four scales every guitarist learns first. Major, minor and their pentatonic versions, and which chords each one fits over.";

export const metadata: Metadata = {
  title: "Guitar Scales for Beginners: Major, Minor and Pentatonic | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/scales" },
  openGraph: {
    title: "Guitar Scales for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/scales",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What is the difference between a scale and its pentatonic version?",
    a: "The pentatonic scale is the full scale with two notes removed. These are the two notes that most easily clash when you improvise. That is why it is the classic starting point for solos. It is very hard to play a wrong note in it.",
  },
  {
    q: "Do I need to learn scales before I can play a solo?",
    a: "You need at least one. Usually the minor pentatonic, in the key of the song. It is the smallest and most forgiving toolkit for a solo that still sounds like you meant it.",
  },
  {
    q: "Can I move a scale shape to another key, like a barre chord?",
    a: "Yes. All the scales here are shown in C, but the pattern can move. Slide the whole shape up or down the fretboard, and you get the same scale in a new key.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Guitar Scales for Beginners: Major, Minor and Pentatonic",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: GUITAR_SCALES.map(
        (scale) =>
          `https://trenodo.com/images/knowledge/guitar/scales/${scale.slug}.svg`,
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

export default function GuitarScalesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="Guitar Scales for Beginners"
        intro="A scale is a fixed pattern on the fretboard. Learn the shape once, and you can slide it up or down to play it in any key. These four scales cover most of what a beginner needs. All of them are shown here in C. Time to scale up. 🎸"
      >
        <GuideSection title="How to read a scale diagram">
          <p>
            Each diagram shows the fretboard from the nut. You see one compact
            position on the A, D and G strings. We don&rsquo;t show every place
            the notes repeat further up the neck. This is the shape you
            actually practice.
          </p>
        </GuideSection>

        <GuideSection title="Major scale">
          <p>
            The major scale fits major chords. It is the natural choice when
            you solo or write a melody over a song in a major key. The pattern
            of whole and half steps is always the same: whole, whole, half,
            whole, whole, whole, half. You only move it up or down the neck to
            change key.
          </p>
          <ScaleFigure
            slug="major"
            name={GUITAR_SCALES[0].name}
            shortName={GUITAR_SCALES[0].shortName}
          />
        </GuideSection>

        <GuideSection title="Minor scale">
          <p>
            The natural minor scale does the same job over minor chords. It
            shares most of its notes with its relative major scale. But it
            starts from another point in the pattern. That gives it a darker,
            more melancholic feeling. So it is the go to scale for songs in a
            minor key.
          </p>
          <ScaleFigure
            slug="minor"
            name={GUITAR_SCALES[1].name}
            shortName={GUITAR_SCALES[1].shortName}
          />
        </GuideSection>

        <GuideSection title="Major pentatonic">
          <p>
            &ldquo;Penta&rdquo; is Greek for five. This is the major scale with two
            notes taken out, the 4th and the 7th. Five notes are left. Those
            two notes are the ones that most easily sound unfinished over a
            major chord. Without them, it is almost impossible to play a bad
            solo.
          </p>
          <ScaleFigure
            slug="major-pentatonic"
            name={GUITAR_SCALES[2].name}
            shortName={GUITAR_SCALES[2].shortName}
          />
        </GuideSection>

        <GuideSection title="Minor pentatonic">
          <p>
            The minor version: the natural minor scale without the 2nd and
            the 6th. It is the most used scale for solos in rock and blues.
            Five safe notes that work over almost any minor or blues song. If
            you only learn one scale, learn this one. 💡
          </p>
          <ScaleFigure
            slug="minor-pentatonic"
            name={GUITAR_SCALES[3].name}
            shortName={GUITAR_SCALES[3].shortName}
          />
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
