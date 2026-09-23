import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "The classic rhyme patterns behind most lyrics, why rhyme matters at all, and when a near rhyme beats a perfect one.";

export const metadata: Metadata = {
  title: "Rhyme Patterns in Songwriting: AABB, ABAB, ABCB Explained | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/rhyme-patterns" },
  openGraph: {
    title: "Rhyme Patterns in Songwriting: AABB, ABAB, ABCB Explained",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/rhyme-patterns",
    siteName: "Trenodo",
    type: "article",
  },
};

const PATTERNS = [
  {
    name: "AABB",
    body: "Lines rhyme in pairs. Line 1 with line 2, line 3 with line 4. The tightest and most satisfying pattern. But use it too much, and it starts to sound like a nursery rhyme.",
  },
  {
    name: "ABAB",
    body: "Every other line rhymes. Line 1 with line 3, line 2 with line 4. A classic for verses. It gives structure, but the rhymes land a bit less predictably than AABB.",
  },
  {
    name: "ABCB",
    body: "Only line 2 and line 4 rhyme. Lines 1 and 3 are free. The easiest pattern to write, and one of the most common in verses. It leaves room for the story, without a forced rhyme in every line.",
  },
  {
    name: "AAAA",
    body: "Every line rhymes with every other line. Rare over a whole song, but strong in short bursts. Great for building up tension towards a chorus.",
  },
] as const;

const FAQS = [
  {
    q: "Does every line in a song need to rhyme?",
    a: "No. Many great lyrics use very few rhymes, or none at all. They lean on rhythm and pictures instead. Rhyme is a tool with a purpose, not a rule.",
  },
  {
    q: "What is a near rhyme, and why use one?",
    a: "A near rhyme (or slant rhyme) pairs words that sound close, but not the same. Like \"time\" and \"mind,\" or \"home\" and \"alone.\" It often sounds more natural than a perfect rhyme. Especially when the perfect rhyme would force you to twist the meaning or the grammar of a line.",
  },
  {
    q: "Why does rhyme matter at all?",
    a: "Rhyme gives a feeling of closure that the listener can feel coming. That makes lines easier to remember, and easier to sing along to on the first listen. It does a real job in the structure. It is not just decoration.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Rhyme Patterns in Songwriting: AABB, ABAB, ABCB Explained",
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

export default function RhymePatternsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Rhyme Patterns in Songwriting: AABB, ABAB, ABCB Explained"
        intro="Rhyme is not decoration. It is one of the main tools that makes a lyric feel structured and easy to remember. And a few patterns cover almost everything you need. No need to rhyme all the time. 🙂"
      >
        <GuideSection title="The classic patterns">
          <p>
            Each letter is one line. Lines with the same letter rhyme with
            each other.
          </p>
          <div className="space-y-4">
            {PATTERNS.map((pattern) => (
              <div
                key={pattern.name}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <h3 className="font-mono text-base font-semibold text-foreground">
                  {pattern.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {pattern.body}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Why rhyme matters">
          <p>
            A rhyme tells the ear that a line is finished. It is a signal in
            the structure, not just a nice sound. That is why a rhymed line is
            easier to remember and to sing along to than an unrhymed line that
            says the same thing. The listener can feel the end of the line
            coming, before it is there.
          </p>
        </GuideSection>

        <GuideSection title="Don't force it">
          <p>
            A rhyme that twists the meaning, the grammar or the sound of a
            word just to fit is easy to spot. And it is more annoying than no
            rhyme at all. A near rhyme like &ldquo;time&rdquo; and &ldquo;mind&rdquo; or
            &ldquo;home&rdquo; and &ldquo;alone&rdquo; keeps the line natural. It is almost always the
            better choice. Flow beats perfection here. Read more about that in{" "}
            <Link
              href="/knowledge/songwriting/refining-your-lyrics"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Refining Your Lyrics
            </Link>
            .
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
