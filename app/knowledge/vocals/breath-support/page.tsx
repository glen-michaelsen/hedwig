import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What singers mean by support. The work in your belly that powers a strong voice, so your throat doesn't have to.";

export const metadata: Metadata = {
  title: "Breath Support for Singers: What It Is and How to Feel It | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/vocals/breath-support" },
  openGraph: {
    title: "Breath Support for Singers: What It Is and How to Feel It",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/vocals/breath-support",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why is support so important?",
    a: "Without support, your throat does work it is not made for. It squeezes to make volume and pitch, which should come from the air instead. Over time that strain makes your voice tired, and in bad cases it can do real damage.",
  },
  {
    q: "Should my belly muscles be tight and still?",
    a: "No, that is the most common mistake. A tight, locked belly feels stable at first. But it becomes a habit that holds you back. Real support is a steady push that keeps working. Not one squeeze that you lock.",
  },
  {
    q: "How do I check that I do it right?",
    a: "Put a hand on your belly while you sing a line. You should feel steady work through the whole line. It only lets go when you breathe in, before the next line.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Breath Support for Singers: What It Is and How to Feel It",
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

export default function VocalsBreathSupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Vocals"
        categoryHref="/knowledge/vocals"
        title="Breath Support for Singers: What It Is and How to Feel It"
        intro={`Every singing teacher talks about “support.” It means something very specific: you use your belly muscles to push the sound from your diaphragm. Not from a tight throat.`}
      >
        <GuideSection title="Why support matters">
          <p>
            Sound needs air pressure behind it. Without support, you make that
            pressure by squeezing your throat. It works for a while. But it
            strains your vocal cords, and it limits your volume, range and
            control. Support moves the work down to your diaphragm and your
            belly. They are made for it. Your throat can then focus on shaping
            the sound.
          </p>
        </GuideSection>

        <GuideSection title="An easy way to feel it">
          <p>
            Make a long &ldquo;sss&rdquo; sound for a few seconds. Notice your belly
            muscles. You can feel them work to push the air out at a steady
            pace. That exact feeling is what you want when you sing. 💡
          </p>
        </GuideSection>

        <GuideSection title="Steady, not one big squeeze">
          <p>
            The most common mistake is to treat support like one squeeze. You
            tighten your belly once, and hold it stiff. It feels stable in the
            moment. But it becomes a habit that limits your control. A locked
            muscle can&rsquo;t make the small, constant changes that singing
            needs. Real support is steady work through the whole line. You let
            go when you breathe in, and start again when you sing.
          </p>
          <p>
            A simple check: put a hand on your belly while you sing. You want
            to feel steady work for the whole line. Not one squeeze and then
            nothing.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
