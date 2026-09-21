import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why a single played note actually sounds like several tones at once, and how to isolate one of them as a natural harmonic.";

export const metadata: Metadata = {
  title: "Overtones Explained: Why One Note Sounds Full — Trenodo",
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
    q: "Can I actually hear overtones separately?",
    a: "Not individually during normal playing — they blend into the fundamental to create a note's full, rich timbre. A natural harmonic is the exception: it isolates one overtone on its own.",
  },
  {
    q: "How do I play a natural harmonic on guitar?",
    a: "Rest a finger lightly on a string directly over a fret — without pressing it down to the fretboard — pluck the string, then lift the touching finger away. What's left ringing is an isolated overtone.",
  },
  {
    q: "Why does a natural harmonic sound so different from a normal note?",
    a: "It's a single overtone in isolation rather than the fundamental plus its usual backing overtones, which gives it a distinctly brighter, thinner, less “full” character — and a naturally lower volume than a fretted note.",
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
        intro="A single played note is never really just one tone — it's the fundamental note plus a series of quieter, higher tones layered on top, all sounding at once."
      >
        <GuideSection title="What overtones actually are">
          <p>
            Together, the fundamental and its overtones are called partial
            tones, with the fundamental itself counted as the first
            partial. The overtones above it act as backup tones — you don&rsquo;t
            consciously hear them as separate notes, but they&rsquo;re exactly
            what gives an instrument&rsquo;s sound its full, rich character rather
            than a flat, single-frequency tone.
          </p>
          <p>
            Overtones produce further overtones of their own, but those are
            quiet enough to be effectively inaudible in practice.
          </p>
        </GuideSection>

        <GuideSection title="Isolating one: natural harmonics">
          <p>
            On a guitar, you can isolate a single overtone directly. Rest a
            finger lightly on a string exactly over a fret — without
            pressing it down to the fretboard — pluck the string, and then
            lift the touching finger away. What keeps ringing is a natural
            harmonic: one overtone on its own, without the fundamental
            underneath it.
          </p>
          <p>
            A natural harmonic sounds noticeably different from a normal
            fretted note — brighter, thinner and less &ldquo;full,&rdquo; with a lower
            natural volume. That makes it a useful texture when a delicate,
            bell-like sound is what a passage calls for, though its low
            volume limits how it can be used.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
