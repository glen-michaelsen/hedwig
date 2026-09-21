import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Vibrato, distortion, air and growl — four vocal effects singers layer on top of a register to shape how a phrase actually sounds.";

export const metadata: Metadata = {
  title: "Vocal Effects Explained: Vibrato, Distortion, Air, Growl — Trenodo",
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
    body: "A regular pulsation in pitch. The singer controls two things independently: how wide the pitch swing is, and how fast it pulses.",
  },
  {
    name: "Distortion",
    body: "A crunchy, gritty texture added to the tone — used mainly in rock and metal to add aggression and edge to a phrase.",
  },
  {
    name: "Air in the voice",
    body: "A soft, breathy quality layered on top of (usually) a neutral register — common in quieter, more intimate pop passages.",
  },
  {
    name: "Growl",
    body: "A dark, rough, guttural sound associated with metal vocals. It tends to come more naturally in lower voices, which is why it's more common among male singers than female ones.",
  },
] as const;

const FAQS = [
  {
    q: "Is an effect the same thing as a register?",
    a: "No — a register (like overdrive or belting) is the underlying way the sound is produced; an effect (like vibrato or growl) is layered on top of it to shape the texture further.",
  },
  {
    q: "Which effect should I learn first?",
    a: "Vibrato is usually the most broadly useful starting point — it shows up across nearly every genre, while distortion and growl are more genre-specific tools.",
  },
  {
    q: "Can effects be overused?",
    a: "Yes. A constant vibrato on every note, for example, can flatten a performance rather than add expression to it — these work best used deliberately on specific phrases, not applied uniformly.",
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
        intro="Where a vocal register is the underlying way a sound is produced, an effect is something layered on top of it — the same register can sound quite different with or without one of these applied."
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
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
