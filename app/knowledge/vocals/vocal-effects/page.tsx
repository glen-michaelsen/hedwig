import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Vibrato, distortion, air and growl. Four vocal effects singers add on top of a register to shape a line.";

export const metadata: Metadata = {
  title: "Vocal Effects Explained: Vibrato, Distortion, Air, Growl | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals/vocal-effects" },
  openGraph: {
    title: "Vocal Effects Explained: Vibrato, Distortion, Air, Growl",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals/vocal-effects",
    siteName: "Trenodo",
    type: "article",
  },
};

const EFFECTS = [
  {
    name: "Vibrato",
    body: "A regular wave in the pitch. The singer controls two things: how wide the wave is, and how fast it moves.",
  },
  {
    name: "Distortion",
    body: "A rough, crunchy texture in the tone. Mostly used in rock and metal, to give a line more edge and aggression.",
  },
  {
    name: "Air in the voice",
    body: "A soft, breathy quality, usually on top of the neutral register. You hear it a lot in quiet and close pop parts.",
  },
  {
    name: "Growl",
    body: "A dark, rough sound deep in the throat. It belongs to metal. It comes more easily in lower voices, so it is more common among male singers.",
  },
] as const;

const FAQS = [
  {
    q: "Is an effect the same as a register?",
    a: "No. A register, like overdrive or belting, is the way the sound is made. An effect, like vibrato or growl, goes on top of it and shapes the texture.",
  },
  {
    q: "Which effect should I learn first?",
    a: "Vibrato is usually the most useful place to start. You find it in almost every style. Distortion and growl are more for specific styles.",
  },
  {
    q: "Can I use too much of an effect?",
    a: "Yes. Vibrato on every single note, for example, can make a performance flat instead of alive. Effects work best when you use them on purpose, on the right lines.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Vocal Effects Explained: Vibrato, Distortion, Air, Growl",
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

export default function VocalEffectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Vocals"
        categoryHref="/knowledge/vocals"
        title="Vocal Effects Explained: Vibrato, Distortion, Air, Growl"
        intro="A register is how you make the sound. An effect is something you add on top. The same register can sound very different, with or without one of these."
      >
        <GuideSection title="Four effects to know">
          <div className="space-y-4">
            {EFFECTS.map((effect) => (
              <div
                key={effect.name}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {effect.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {effect.body}
                </p>
              </div>
            ))}
          </div>
          <p>
            Like salt in cooking: a little goes a long way. 🧂
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
