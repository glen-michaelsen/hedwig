import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The three scales every beginner bassist learns first — major, minor and minor pentatonic — and how to use them to build a bass line in any key.";

export const metadata: Metadata = {
  title: "Bass Scales for Beginners: Major, Minor and Minor Pentatonic — Trenodo",
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
    q: "Why practice scales instead of just learning songs?",
    a: "A song teaches you that one specific bass line. A scale teaches you the underlying shape that fits an entire key — once it's under your fingers, you can build a fill or a bass line for any song in that key, not just the one you memorized.",
  },
  {
    q: "How do I know which scale fits a song?",
    a: "Match the scale to the song's key. A song in G major sits naturally under the G major scale shape; a song in G minor sits under the G minor (or G minor pentatonic) shape instead.",
  },
  {
    q: "Is that everything I need to know about bass scales?",
    a: "No — this is a deliberately small starting slice. A real bass teacher will take you well beyond these three shapes, into other scale types, positions further up the neck, and how they connect together.",
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
        intro="A scale is just a fixed pattern of steps between notes — learn the pattern once, and the same shape works starting from any root note, anywhere on the neck."
      >
        <GuideSection title="The three shapes to learn first">
          <p>
            These three cover the large majority of what a beginner bassist
            actually needs, shown here starting from G — move the whole
            shape to a different root and the same pattern gives you that
            key&rsquo;s version instead.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">G major</strong> — the
              brightest-sounding of the three; eight notes (seven plus the
              octave) following the major scale&rsquo;s step pattern.
            </li>
            <li>
              <strong className="text-foreground">G minor</strong> — the
              same eight-note structure, with three of the steps shifted to
              give it a darker character.
            </li>
            <li>
              <strong className="text-foreground">G minor pentatonic</strong>{" "}
              — the minor scale with two notes removed, leaving five. Fewer
              notes means fewer ways to land on something that clashes,
              which makes it a forgiving shape for a first attempt at
              improvising a fill.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Using a scale to build a bass line">
          <p>
            The point of learning these isn&rsquo;t to play a scale start-to-finish
            in a song — it&rsquo;s to know the full set of notes that fit, so you
            can pick from them freely. Match the scale to the song&rsquo;s key: a
            song in G major draws on notes from the G major shape; a song in
            G minor draws on the G minor or minor pentatonic shape instead.
            Root notes on the beat are the reliable foundation; the rest of
            the scale is what a fill or a walking line borrows from between
            those roots.
          </p>
        </GuideSection>

        <GuideSection title="Drill it until it's automatic">
          <p>
            The real goal is being able to play these shapes without
            thinking about where your fingers are — that&rsquo;s what frees you up
            to actually listen to the rest of the band while you play.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
