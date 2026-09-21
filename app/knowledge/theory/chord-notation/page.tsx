import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How chord notation like Cm7 and Dsus4 works — a root letter plus a suffix, the same system for every key.";

export const metadata: Metadata = {
  title: "Chord Notation Explained: Reading Symbols Like Cm7 and Dsus4 — Trenodo",
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
    q: "Is chord notation the same as full sheet music?",
    a: "No — it's a shorthand. Chord notation tells you which chords to play and roughly when, usually written above lyrics or over measures, but it doesn't specify the exact melody or rhythm the way full notation does.",
  },
  {
    q: "Do I need to memorize a suffix for every root note separately?",
    a: "No — that's the whole advantage of the system. Once you know what “sus4” or “m7” means, it means the same thing on top of any root letter.",
  },
  {
    q: "Why is chord notation so common for guitar and piano?",
    a: "Both instruments can play full chords from a single symbol, so a chord chart gives a guitarist or pianist everything they need without the overhead of reading full notation.",
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
      <p className="sr-only">Chord notation examples rooted on {root}</p>
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
        intro="Chord notation (sometimes called a chord chart or lead sheet) represents harmony without writing out full notation — just letter symbols, usually placed above lyrics or over measures."
      >
        <GuideSection title="Root, then suffix">
          <p>
            Every chord symbol starts with a root note letter, followed by a
            suffix describing its quality or extension. The suffix
            vocabulary is consistent across every root note, which is the
            whole point — learn what a suffix means once, and it means the
            same thing no matter which letter it&rsquo;s attached to.
          </p>
          <ExampleTable root="C" examples={C_EXAMPLES} />
        </GuideSection>

        <GuideSection title="The same suffixes, a different root">
          <p>
            Reapply those same five suffixes to D♯, and the pattern holds
            exactly:
          </p>
          <ExampleTable root="D♯" examples={D_SHARP_EXAMPLES} />
        </GuideSection>

        <GuideSection title="Why this is worth learning">
          <p>
            Once the suffix vocabulary is familiar, reading a chord chart
            becomes fast — you&rsquo;re recognizing shapes and names, not sounding
            anything out. That&rsquo;s why it&rsquo;s the standard way guitarists and
            pianists share songs with each other.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
