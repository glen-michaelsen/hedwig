import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "The mistakes that show up again and again in early drafts. Forced rhymes, vague lyrics, the wrong mood and a hidden hook.";

export const metadata: Metadata = {
  title: "Common Songwriting Mistakes to Avoid | Trenodo",
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
    q: "Are these mistakes, or just choices some songs make on purpose?",
    a: "Both. It depends on the intention. A mood that doesn't match, used on purpose, is irony. The same mismatch by accident just sounds like a song that doesn't know what it wants to say. The difference is choice or oversight.",
  },
  {
    q: "Which of these is most common in early drafts?",
    a: "Vague lines, by far. In a first draft it is natural to describe a feeling in general words, instead of a specific picture. And it is usually the most valuable thing to fix when you edit.",
  },
  {
    q: "How do I catch these in my own songs?",
    a: "Time and distance help the most. Put the draft away for a day or two, and then come back. Problems you couldn't see while you were inside the song are often clear a day later.",
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
        intro="The same few problems show up in early drafts again and again. When you know what to look for, they are much easier to catch in your own songs. Don't worry, we have all made them. 😅"
      >
        <GuideSection title="Forcing a rhyme">
          <p>
            Twisting the meaning, the grammar or the sound of a word just to
            make it rhyme is easy to hear. Often more than no rhyme at all.
            Read{" "}
            <Link
              href="/knowledge/songwriting/rhyme-patterns"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Rhyme Patterns
            </Link>{" "}
            to see why a near rhyme is almost always the better deal.
          </p>
        </GuideSection>

        <GuideSection title="Being vague instead of specific">
          <p>
            &ldquo;I miss you&rdquo; describes a feeling. &ldquo;Your coffee cup is still in the
            sink&rdquo; puts the listener right inside it. Vague lines are the most
            common habit in a first draft. And being specific is usually the
            most valuable fix when you edit. More in{" "}
            <Link
              href="/knowledge/songwriting/finding-your-subject"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Finding the Right Subject
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="The wrong mood for the music">
          <p>
            A sad lyric on a happy, bright melody (or the other way around)
            can work very well, if it is on purpose. But much more often it
            just weakens the song. The listener doesn&rsquo;t know what to feel. If
            the mismatch was not planned, check if the music works with the
            lyric or against it.
          </p>
        </GuideSection>

        <GuideSection title="Too many ideas in one song">
          <p>
            A song usually only has room for one main idea, and one main
            metaphor. Put in several ideas that compete, and often none of
            them land. See{" "}
            <Link
              href="/knowledge/songwriting/metaphors"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Using Metaphors
            </Link>{" "}
            on sticking to one picture, instead of stacking many.
          </p>
        </GuideSection>

        <GuideSection title="Hiding the hook">
          <p>
            If your strongest line isn&rsquo;t placed where the song repeats it,
            usually the chorus, the listener might never notice it. See{" "}
            <Link
              href="/knowledge/songwriting/titles-and-hooks"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Titles and Hooks
            </Link>{" "}
            for where a hook should sit.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
