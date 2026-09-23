import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Neutral, curbing, overdrive and belting. The four vocal functions singers move between, and when each one fits.";

export const metadata: Metadata = {
  title: "Vocal Registers Explained: Neutral, Curbing, Overdrive, Belting | Trenodo",
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
    volume: "1 to 3",
    body: "The softest and quietest of the four, with no metal in the sound. In the high range it is basically falsetto. Great for quiet and close pop parts.",
  },
  {
    name: "Curbing",
    volume: "4 to 7",
    body: "A slightly held back sound, almost a little whiny. Think Michael Jackson or Tim Christensen. It works in many styles, but you hear it most in pop and rock.",
  },
  {
    name: "Overdrive",
    volume: "7 to 10",
    body: "Louder and more open than curbing, with a sharp edge in the high range. A classic in rock vocals.",
  },
  {
    name: "Belting",
    volume: "7 to 10",
    body: "Edgy and without limits, at full volume in the high range. The signature sound of soul singing.",
  },
] as const;

const FAQS = [
  {
    q: "Is one of these registers correct, and the rest just style?",
    a: "No. Think of them as tools for different jobs, not as a ranking. A quiet verse in neutral and a big chorus in belting are both correct. Just for different moments in the song.",
  },
  {
    q: "Do I need to master all four?",
    a: "Not right away. Most singers lean towards one or two of them first, based on their voice and the music they love. The rest comes with time.",
  },
  {
    q: "Can I switch between registers in one song?",
    a: "Yes. That is normal, and often exactly what the song needs. For example a soft verse in neutral, and a powerful chorus in overdrive or belting.",
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
        intro="These four functions are different ways to make sound with your voice. Each one has its own character, its own natural volume and its own favorite styles. See them as tools for different jobs, not just as styles."
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
                    Volume {register.volume} out of 10
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {register.body}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Pick the register for the moment">
          <p>
            A song rarely stays in one register all the way. A quiet verse
            might need neutral. The chorus might push into overdrive or
            belting for more punch. The skill is not to pick a favorite. The
            skill is to hear what each moment in the song needs. 🎤
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
