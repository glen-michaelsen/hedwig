import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Three ways to find the raw material for a song, before you think about structure. Write the story first, improvise over an instrument, or build lines from a metaphor.";

export const metadata: Metadata = {
  title: "Songwriting Methods: History to Song, Improvisation, Metaphor Driven | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/methods" },
  openGraph: {
    title: "Songwriting Methods: History to Song, Improvisation, Metaphor Driven",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/methods",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Which method should I start with?",
    a: "History to Song, if you are not sure. You need no instrument and no melody. Only something that happened, or something you can see clearly in your head. That makes it the easiest way in.",
  },
  {
    q: "Can I mix methods in the same song?",
    a: "Yes, and many writers do. A common path is to start with History to Song for the story. Then switch to improvisation when you have some chords to sing the lines over.",
  },
  {
    q: "What if none of my lines from a session are usable?",
    a: "Keep them anyway. A line that doesn't fit this song often fits another song later. All three methods work best as a habit of collecting material. Not as one session that has to deliver a finished song.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Songwriting Methods: History to Song, Improvisation, Metaphor Driven",
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

export default function SongwritingMethodsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Songwriting Methods: History to Song, Improvisation, Metaphor Driven"
        intro="Before a song has a structure, it needs raw material. Real lines to work with. These three methods are different ways to get them. Each one fits a different mood and a different starting point."
      >
        <GuideSection title="History to Song">
          <p>
            Write the story first, as normal text. A real memory, something
            you saw, or something you make up. Don&rsquo;t think about rhyme,
            rhythm or line length yet. Just write it the way you would tell it
            to a friend.
          </p>
          <p>
            When it is written, go through it and break it into lines. The
            sentences that already sound like lyrics will jump out at you, once
            the whole story is in front of you. This method is great when you
            have a subject (see{" "}
            <Link
              href="/knowledge/songwriting/finding-your-subject"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Finding the Right Subject
            </Link>
            ) but no lines yet. ✍️
          </p>
        </GuideSection>

        <GuideSection title="Improvisation">
          <p>
            Play a simple chord progression on guitar or piano, and sing
            freely on top. No plan for what comes out. Words, melodies and
            phrases will show up that you would never write with a pen in
            your hand.
          </p>
          <p>
            Record every session. Lines that feel obvious in the moment are
            gone fast. The whole point of improvising is to catch the lines
            that come before you start to doubt them. 🎙️
          </p>
        </GuideSection>

        <GuideSection title="Metaphor Driven">
          <p>
            Start from a metaphor instead of a plain description (see{" "}
            <Link
              href="/knowledge/songwriting/metaphors"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Using Metaphors
            </Link>
            ). Build short lines around it. Let the metaphor carry the
            feeling, with as few extra words as possible. This method often
            gives the most personal and least generic lines of the three.
            Because it forces you to be specific from the very first line.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
