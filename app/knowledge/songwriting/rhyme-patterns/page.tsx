import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "The standard rhyme schemes behind most lyrics, why rhyme matters at all, and when a near-rhyme beats a perfect one.";

export const metadata: Metadata = {
  title: "Rhyme Patterns in Songwriting: AABB, ABAB, ABCB Explained — Trenodo",
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
    body: "Consecutive lines rhyme in pairs: line 1 rhymes with line 2, line 3 with line 4. The tightest, most immediately satisfying pattern — and the easiest to overuse until it feels sing-song.",
  },
  {
    name: "ABAB",
    body: "Alternating rhyme: line 1 rhymes with line 3, line 2 with line 4. A common verse pattern — it gives structure without the pairs of AABB landing quite so predictably.",
  },
  {
    name: "ABCB",
    body: "Only the 2nd and 4th lines rhyme; the 1st and 3rd are free. The least demanding pattern to write, and one of the most common in verses, since it leaves more room for the story to move without forcing a rhyme at every turn.",
  },
  {
    name: "AAAA",
    body: "Every line rhymes with every other — monorhyme. Rare over a whole song, but effective in short bursts for emphasis or building tension into a chorus.",
  },
] as const;

const FAQS = [
  {
    q: "Does every line in a song have to rhyme?",
    a: "No. Plenty of well-regarded lyrics use rhyme sparingly or not at all, leaning on rhythm and imagery instead. Rhyme is a tool for a reason, not an obligation.",
  },
  {
    q: "What's a near-rhyme, and why use one?",
    a: "A near-rhyme (or slant rhyme) pairs words that sound close but not identical — like \"time\" and \"mind,\" or \"home\" and \"alone.\" It often sounds more natural than forcing a perfect rhyme, especially when the perfect rhyme would mean twisting the meaning or grammar of a line to make it fit.",
  },
  {
    q: "Why does rhyme matter at all?",
    a: "It creates a sense of closure a listener can feel coming, which makes lines easier to remember and phrases easier to sing along to on a first listen — rhyme is doing a structural job, not just a decorative one.",
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
        intro="Rhyme isn't decoration — it's one of the main tools a lyric uses to feel structured and memorable on a first listen. A handful of patterns cover almost everything you'll need."
      >
        <GuideSection title="The standard patterns">
          <p>
            Each letter stands for one line; lines sharing a letter rhyme
            with each other.
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
            A rhyme signals to the listener&rsquo;s ear that a phrase is
            complete — it&rsquo;s a structural cue, not just a pleasant sound.
            That&rsquo;s what makes a rhymed line easier to remember and easier
            to sing along to than an unrhymed one saying the same thing:
            the listener can feel the line coming to a close before it
            actually finishes.
          </p>
        </GuideSection>

        <GuideSection title="Don't force it">
          <p>
            A rhyme that bends a word&rsquo;s natural meaning, grammar or
            pronunciation just to land is usually more noticeable — and
            more distracting — than no rhyme at all. A near-rhyme (&ldquo;time&rdquo;
            and &ldquo;mind,&rdquo; &ldquo;home&rdquo; and &ldquo;alone&rdquo;) that keeps the line natural is
            almost always the better choice over a perfect rhyme that
            doesn&rsquo;t. Flow beats precision here — see{" "}
            <Link
              href="/knowledge/songwriting/refining-your-lyrics"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Refining Your Lyrics
            </Link>{" "}
            for more on that trade-off.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
