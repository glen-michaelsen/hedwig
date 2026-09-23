import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The three scales every beginner bass player learns first. Major, minor and minor pentatonic, and how to use them to build a bass line in any key.";

export const metadata: Metadata = {
  title: "Bass Scales for Beginners: Major, Minor and Minor Pentatonic | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/bass/scales" },
  openGraph: {
    title: "Bass Scales for Beginners: Major, Minor and Minor Pentatonic",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/bass/scales",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why practice scales instead of just songs?",
    a: "A song teaches you one bass line. A scale teaches you the shape behind a whole key. When the shape sits in your fingers, you can make a fill or a bass line for any song in that key. Not only the one you learned by heart.",
  },
  {
    q: "How do I know which scale fits a song?",
    a: "Look at the key of the song. A song in G major fits the G major scale. A song in G minor fits the G minor or the G minor pentatonic scale.",
  },
  {
    q: "Is this all I need to know about bass scales?",
    a: "No. This is a small start on purpose. A good bass teacher will take you much further: more scale types, positions higher up the neck, and how they all connect.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Bass Scales for Beginners: Major, Minor and Minor Pentatonic",
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

export default function BassScalesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Bass"
        categoryHref="/knowledge/bass"
        title="Bass Scales for Beginners: Major, Minor and Minor Pentatonic"
        intro="A scale is a fixed pattern of steps between notes. Learn the pattern once, and the same shape works from any root note, anywhere on the neck."
      >
        <GuideSection title="The three shapes to learn first">
          <p>
            These three cover most of what a beginner bass player needs. Here
            they start on G. Move the whole shape to another root note, and
            you have the same scale in that key.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">G major.</strong> The
              brightest of the three. Eight notes (seven plus the octave),
              with the step pattern of the major scale.
            </li>
            <li>
              <strong className="text-foreground">G minor.</strong> Also eight
              notes. But three of the steps are moved, and that gives it a
              darker feeling.
            </li>
            <li>
              <strong className="text-foreground">G minor pentatonic.</strong>{" "}
              The minor scale with two notes taken out. Five notes are left.
              Fewer notes means fewer ways to hit a note that clashes. So it
              is a safe shape for your first fills.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Using a scale to build a bass line">
          <p>
            You don&rsquo;t learn a scale to play it from start to end in a song.
            You learn it to know all the notes that fit, so you can pick
            freely. Match the scale to the key of the song. A song in G major
            uses the G major shape. A song in G minor uses the G minor or the
            minor pentatonic shape. Root notes on the beat are your safe
            base. The rest of the scale is what you borrow from for fills and
            walking lines.
          </p>
        </GuideSection>

        <GuideSection title="Practice until it runs by itself">
          <p>
            The goal is to play these shapes without thinking about your
            fingers. Then you are free to listen to the band while you play.
            That is when it gets really fun. 🎶
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
