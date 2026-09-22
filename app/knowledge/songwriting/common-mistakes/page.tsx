import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "The mistakes that show up over and over in early drafts — forced rhymes, vague lyrics, mismatched mood, and burying a good hook.";

export const metadata: Metadata = {
  title: "Common Songwriting Mistakes to Avoid — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/common-mistakes" },
  openGraph: {
    title: "Common Songwriting Mistakes to Avoid",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/common-mistakes",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Are these mistakes, or just style choices some songs make on purpose?",
    a: "Both, depending on intent. A mismatched mood used deliberately is irony; the same mismatch used by accident just reads as a song that doesn't know what it's trying to say. The difference is whether it's a choice or an oversight.",
  },
  {
    q: "Which of these is the most common in early drafts?",
    a: "Vague generalities, by far. It's the natural first-draft instinct to describe a feeling in general terms rather than a specific image, and it's usually the single highest-value thing to fix in revision.",
  },
  {
    q: "How do I catch these in my own writing?",
    a: "Time and distance help more than anything — put a draft away for a day or two and come back to it. Problems that were invisible while you were inside the song are often obvious a day later.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Common Songwriting Mistakes to Avoid",
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

export default function CommonMistakesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Common Songwriting Mistakes to Avoid"
        intro="The same handful of problems show up in early drafts again and again. Knowing what to look for makes them much easier to catch in your own writing."
      >
        <GuideSection title="Forcing a rhyme">
          <p>
            Bending a word&rsquo;s natural meaning, grammar or pronunciation
            just to land a rhyme is usually more noticeable than skipping
            the rhyme entirely. See{" "}
            <Link
              href="/knowledge/songwriting/rhyme-patterns"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Rhyme Patterns
            </Link>{" "}
            for why a near-rhyme is almost always the better trade.
          </p>
        </GuideSection>

        <GuideSection title="Staying vague instead of getting specific">
          <p>
            &ldquo;I miss you&rdquo; describes a feeling. &ldquo;Your coffee cup&rsquo;s still in
            the sink&rdquo; puts a listener inside one. Vague lines are the most
            common first-draft habit, and specificity is usually the
            single most valuable thing to fix on a revision pass — see{" "}
            <Link
              href="/knowledge/songwriting/finding-your-subject"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Finding the Right Subject
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="Mismatching mood and music">
          <p>
            A devastating lyric set to a bright, upbeat major-key melody
            (or the reverse) can work brilliantly when it&rsquo;s a deliberate
            choice — but far more often it just undercuts the song, leaving
            a listener unsure which emotion to actually feel. If the
            mismatch wasn&rsquo;t intentional, it&rsquo;s worth checking whether the
            music is working with the lyric or against it.
          </p>
        </GuideSection>

        <GuideSection title="Trying to fit in too many ideas">
          <p>
            A song usually only has room to develop one central idea, one
            central metaphor, properly. Cramming in several competing ones
            tends to leave a listener with none of them landing — see{" "}
            <Link
              href="/knowledge/songwriting/metaphors"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Using Metaphors
            </Link>{" "}
            on committing to a single image instead of stacking several.
          </p>
        </GuideSection>

        <GuideSection title="Burying the hook">
          <p>
            If your strongest, most memorable line isn&rsquo;t placed somewhere
            the song&rsquo;s repetition will reinforce it — typically the chorus
            — a listener may never catch it at all. See{" "}
            <Link
              href="/knowledge/songwriting/titles-and-hooks"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Titles and Hooks
            </Link>{" "}
            for where a hook actually needs to sit.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
