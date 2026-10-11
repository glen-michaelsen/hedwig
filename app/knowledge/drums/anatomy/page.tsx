import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { DrumKit } from "./_components/drum-kit";
import { KIT_PARTS } from "./kit-parts";

const TITLE = "The Drum Kit, Piece by Piece";
const PAGE_DESCRIPTION =
  "The parts of a drum kit explained: hi-hat, crash, ride, snare, bass drum, toms, pedals and throne. What each one does, its usual size, and a tip for playing it.";

export const metadata: Metadata = {
  title: `${TITLE}: Parts of a Drum Kit Explained | Trenodo`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/drums/anatomy" },
  openGraph: {
    title: `${TITLE}: Parts of a Drum Kit Explained`,
    description: PAGE_DESCRIPTION,
    url: "/knowledge/drums/anatomy",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What is a five-piece drum kit?",
    a: "Five drums: bass drum, snare, two rack toms and a floor tom. Cymbals don't count in the number, so a five-piece kit usually comes with a hi-hat, a crash and a ride on top.",
  },
  {
    q: "What's the difference between a four-piece and a five-piece kit?",
    a: "One rack tom instead of two. A four-piece is simpler and easier to carry, and very common in rock and jazz. A five-piece gives you one more step for fills.",
  },
  {
    q: "How do I set up a kit if I'm left-handed?",
    a: "Mirror it: hi-hat on the right, bass drum pedal under your left foot, floor tom on the left. Some left-handers keep a right-handed kit and play it open-handed instead.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
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

export default function DrumKitAnatomyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Drums"
        categoryHref="/knowledge/drums"
        title={TITLE}
        intro="Every kit is built from the same few pieces. Tap one to see what it does, how big it usually is, and how to get a good sound out of it. 🥁"
      >
        <DrumKit />

        <GuideSection title="Every piece at a glance">
          <dl className="grid gap-3 sm:grid-cols-2">
            {KIT_PARTS.map((part) => (
              <div key={part.key} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-foreground">{part.name}</span>
                  <span className="shrink-0 text-xs text-faint">{part.size}</span>
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed">{part.does}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>

        <GuideSection title="How a kit is set up">
          <p>
            Sit on the throne with the snare between your knees and the bass drum pedal under your
            right foot. The hi-hat sits to your left, with its pedal under your left foot. The rack
            toms sit over the bass drum, the floor tom on your right. The crash goes up on the left,
            the ride up on the right.
          </p>
          <p>
            Set it up so nothing makes you stretch or twist. Every piece should be in easy reach
            from where you sit, with relaxed shoulders.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
