import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Neutral, curbing, overdrive and belting — the four vocal functions singers move between, and when each one actually fits.";

export const metadata: Metadata = {
  title: "Vocal Registers Explained: Neutral, Curbing, Overdrive, Belting — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals/vocal-registers" },
  openGraph: {
    title: "Vocal Registers Explained: Neutral, Curbing, Overdrive, Belting",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals/vocal-registers",
    siteName: "Trenodo",
    type: "article",
  },
};

const REGISTERS = [
  {
    name: "Neutral",
    volume: "1–3",
    body: "The quietest and softest of the four, with no metallic edge — in the high range it's essentially falsetto. Well suited to quiet, intimate pop passages.",
  },
  {
    name: "Curbing",
    volume: "4–7",
    body: "A slightly pinched, “complaining” character — think Michael Jackson or Tim Christensen. Works across genres, but is especially common in pop and rock.",
  },
  {
    name: "Overdrive",
    volume: "7–10",
    body: "Louder and more open than curbing, with a penetrating edge in the upper range. A staple of rock vocals.",
  },
  {
    name: "Belting",
    volume: "7–10",
    body: "Edgy and unrestrained, at full volume in the high register — the signature sound of soul singing.",
  },
] as const;

const FAQS = [
  {
    q: "Is one of these registers \"correct\" and the others just style?",
    a: "No — they're better thought of as different tools for different technical situations, not a hierarchy. A quiet verse calling for neutral and a big chorus calling for belting are both correct uses, just for different moments in a song.",
  },
  {
    q: "Do I need to be able to do all four?",
    a: "Not right away. Most singers naturally lean toward one or two of these first, based on their voice and the music they listen to, and build the others over time.",
  },
  {
    q: "Can I switch between registers within one song?",
    a: "Yes — that's normal and often exactly what a song calls for, moving from a softer neutral verse into a more powerful overdrive or belting chorus.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Vocal Registers Explained: Neutral, Curbing, Overdrive, Belting",
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

export default function VocalRegistersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Vocals"
        categoryHref="/knowledge/vocals"
        title="Vocal Registers Explained: Neutral, Curbing, Overdrive, Belting"
        intro="These four “functions” describe distinct ways of producing sound with your voice — each with its own character, natural volume range and genre association. Think of them as tools for solving different vocal problems, not just style choices."
      >
        <GuideSection title="The four registers">
          <div className="space-y-4">
            {REGISTERS.map((register) => (
              <div
                key={register.name}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    {register.name}
                  </h3>
                  <span className="text-xs font-medium text-faint">
                    Volume {register.volume}/10
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {register.body}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Matching register to moment">
          <p>
            A song rarely sits in one register the whole way through. A
            quiet verse might call for neutral, while the chorus pushes into
            overdrive or belting for impact — the skill isn&rsquo;t picking a
            favorite register, it&rsquo;s recognizing which one a given moment in
            a song actually needs.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
