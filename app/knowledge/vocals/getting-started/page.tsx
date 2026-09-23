import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Your voice is the one instrument you can't buy or swap. How to get comfortable with it, before you worry about technique.";

export const metadata: Metadata = {
  title: "Getting Started with Singing | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals/getting-started" },
  openGraph: {
    title: "Getting Started with Singing",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals/getting-started",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "I don't like the sound of my own voice. Is that normal?",
    a: "Very normal. Most people are not used to hearing their voice the way a microphone hears it. Inside your head it sounds different. The feeling goes away when you hear it more often. You don't need a new voice.",
  },
  {
    q: "Do I need lessons to start singing?",
    a: "No. Singing along to songs you like, at home and without an audience, is a great way to start. Lessons matter more later, when you want more range, power or control.",
  },
  {
    q: "What should I practice first?",
    a: "Feeling comfortable comes before technique. Get used to your own tone, and how your voice sits in a song. Then add the more technical work, like breath support.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Getting Started with Singing",
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

export default function VocalsGettingStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Vocals"
        categoryHref="/knowledge/vocals"
        title="Getting Started with Singing"
        intro="Singing is different from all the other instruments on this site. You use your own body as the instrument. And that means every voice is a little bit different. 🎤"
      >
        <GuideSection title="Your voice is already an instrument">
          <p>
            Your unique voice is not a problem to fix. It is the raw material
            for your own style. Two singers can learn the exact same
            technique, and still sound totally different. Because the
            instrument itself is different. That is not true for two
            guitarists on the same guitar.
          </p>
        </GuideSection>

        <GuideSection title="Where to start">
          <p>
            The easiest start is also the best one. Sing along to songs you
            already like. At home, with no pressure. The goal is not to be
            perfect. The goal is to feel at home in your own voice. Notice
            which songs sit well in your range, and which ones feel like a
            stretch.
          </p>
          <p>
            After that, there are two natural next steps. Find a singing
            teacher, who can help you unlock more range and control. Or start
            singing with a guitarist or a pianist. That teaches you to hold
            your own part next to real music. Both are great. 🙂
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
