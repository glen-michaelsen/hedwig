import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How chord symbols like Cm7 and Dsus4 work. A root letter plus an ending, and the same system for every key.";

export const metadata: Metadata = {
  title: "Chord Notation Explained: Reading Symbols Like Cm7 and Dsus4 | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory/chord-notation" },
  openGraph: {
    title: "Chord Notation Explained: Reading Symbols Like Cm7 and Dsus4",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory/chord-notation",
    siteName: "Trenodo",
    type: "article",
  },
};

const C_EXAMPLES = [
  { symbol: "C", meaning: "C major" },
  { symbol: "Cm", meaning: "C minor" },
  { symbol: "Csus2", meaning: "C suspended 2nd" },
  { symbol: "Csus4", meaning: "C suspended 4th" },
  { symbol: "Cm7", meaning: "C minor 7th" },
] as const;

const D_SHARP_EXAMPLES = [
  { symbol: "D♯", meaning: "D♯ major" },
  { symbol: "D♯m", meaning: "D♯ minor" },
  { symbol: "D♯sus2", meaning: "D♯ suspended 2nd" },
  { symbol: "D♯sus4", meaning: "D♯ suspended 4th" },
  { symbol: "D♯m7", meaning: "D♯ minor 7th" },
] as const;

const FAQS = [
  {
    q: "Is chord notation the same as sheet music?",
    a: "No, it is a shortcut. Chord notation tells you which chords to play, and roughly when. It usually sits above the lyrics or over the bars. It doesn't show the exact melody or rhythm, like sheet music does.",
  },
  {
    q: "Do I need to learn every ending for every root note?",
    a: "No, and that is the beauty of it. When you know what \"sus4\" or \"m7\" means, it means the same thing on every root letter.",
  },
  {
    q: "Why is chord notation so popular with guitar and piano players?",
    a: "Both instruments can play a full chord from one symbol. So a chord chart gives a guitarist or pianist all they need, without reading full sheet music.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Chord Notation Explained: Reading Symbols Like Cm7 and Dsus4",
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

function ExampleTable({
  root,
  examples,
}: {
  root: string;
  examples: readonly { symbol: string; meaning: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-muted/60">
          <tr>
            <th className="px-4 py-2.5 font-semibold text-foreground">
              Symbol
            </th>
            <th className="px-4 py-2.5 font-semibold text-foreground">
              Means
            </th>
          </tr>
        </thead>
        <tbody>
          {examples.map((row) => (
            <tr key={row.symbol} className="border-t border-line">
              <td className="px-4 py-2.5 font-mono font-medium text-foreground">
                {row.symbol}
              </td>
              <td className="px-4 py-2.5 text-muted">{row.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sr-only">Chord notation examples with the root {root}</p>
    </div>
  );
}

export default function ChordNotationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Music Theory"
        categoryHref="/knowledge/theory"
        title="Chord Notation Explained: Reading Symbols Like Cm7 and Dsus4"
        intro="Chord notation shows the harmony of a song with letters and symbols. No full sheet music needed. You often see it above the lyrics or over the bars, in a chord chart or lead sheet."
      >
        <GuideSection title="First the root, then the ending">
          <p>
            Every chord symbol starts with a root letter. After it comes an
            ending that tells you the type of chord. The endings are the same
            for every root. Learn what an ending means once, and it means the
            same no matter which letter it sits on.
          </p>
          <ExampleTable root="C" examples={C_EXAMPLES} />
        </GuideSection>

        <GuideSection title="Same endings, new root">
          <p>
            Put the same five endings on D♯, and the pattern is exactly the
            same:
          </p>
          <ExampleTable root="D♯" examples={D_SHARP_EXAMPLES} />
        </GuideSection>

        <GuideSection title="Why it is worth learning">
          <p>
            When you know the endings, you read a chord chart fast. You
            recognize names and shapes. You don&rsquo;t spell your way through
            them. That is why guitar and piano players use chord charts to
            share songs. Quick to read, quick to play. 🎸🎹
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
