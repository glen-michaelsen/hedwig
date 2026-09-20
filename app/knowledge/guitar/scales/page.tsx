import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ScaleFigure } from "../../_components/scale-figure";
import { GUITAR_SCALES } from "@/lib/scale-diagrams/guitar-scales";

const PAGE_DESCRIPTION =
  "The four scales every guitarist learns first — major, minor, and their pentatonic versions — and which chords each one is built to play over.";

export const metadata: Metadata = {
  title: "Guitar Scales for Beginners: Major, Minor and Pentatonic — Trenodo",
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
    q: "What's the difference between a scale and the pentatonic version of it?",
    a: "The pentatonic scale is the full scale with two notes removed — the ones most likely to clash or sound unresolved when you're improvising. That's exactly why it's the standard starting point for soloing: it's very hard to hit a genuinely wrong note in it.",
  },
  {
    q: "Do I need to learn scales before I can solo?",
    a: "You need at least one — usually the minor pentatonic in whatever key the song is in. It's the smallest, most forgiving toolkit for improvising a solo that still sounds intentional.",
  },
  {
    q: "Can I move a scale shape to a different key, the same way as a barre chord?",
    a: "Yes. Every scale shown here is shown in C, but the fingering pattern is movable — shift the whole shape up or down the fretboard and you get the same scale in a different key.",
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
        intro="A scale is a set fretboard pattern — learn the shape once, and you can slide it up or down to play it in any key. These four cover most of what a beginner needs, all shown here rooted on C."
      >
        <GuideSection title="Reading a scale diagram">
          <p>
            Each diagram is the fretboard in open position, nut on the left.
            The solid dot is the root note (C, in every diagram here) — the
            note the scale is named after and the one a solo usually resolves
            back to. The outlined dots are the rest of the scale.
          </p>
        </GuideSection>

        <GuideSection title="Major scale">
          <p>
            The major scale is built for major chords — it&rsquo;s the natural
            choice to solo or write a melody over a major-key progression.
            Its pattern of whole and half steps (whole, whole, half, whole,
            whole, whole, half) is the same shape wherever you play it on the
            neck, just shifted up or down to change key.
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
            shares most of its notes with the relative major scale, but
            starting from a different point in the pattern gives it a darker,
            more melancholy character — which is exactly why it&rsquo;s the go-to
            choice over a minor-key progression.
          </p>
          <ScaleFigure
            slug="minor"
            name={GUITAR_SCALES[1].name}
            shortName={GUITAR_SCALES[1].shortName}
          />
        </GuideSection>

        <GuideSection title="Major pentatonic">
          <p>
            &ldquo;Penta&rdquo; is Greek for five — this is the major scale with two
            notes removed (the 4th and 7th degrees), leaving five. Those two
            notes are the ones most likely to sound unresolved against a
            major chord, so cutting them gives you a scale that&rsquo;s almost
            impossible to solo badly with.
          </p>
          <ScaleFigure
            slug="major-pentatonic"
            name={GUITAR_SCALES[2].name}
            shortName={GUITAR_SCALES[2].shortName}
          />
        </GuideSection>

        <GuideSection title="Minor pentatonic">
          <p>
            The minor equivalent: the natural minor scale with the 2nd and
            6th degrees removed. It&rsquo;s the single most-used scale in rock and
            blues guitar soloing — a small, forgiving set of five notes that
            works over almost any minor or blues progression.
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
