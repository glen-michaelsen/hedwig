import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Three ways to generate the raw material for a song before you worry about structure — writing the story first, improvising over an instrument, and building lines straight from a metaphor.";

export const metadata: Metadata = {
  title: "Songwriting Methods: History to Song, Improvisation, Metaphor-Driven — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/methods" },
  openGraph: {
    title: "Songwriting Methods: History to Song, Improvisation, Metaphor-Driven",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/methods",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Which method should I start with?",
    a: "History to Song, if you're not sure — it needs no instrument, no melody yet, just something that actually happened or that you can picture clearly, which makes it the most approachable starting point.",
  },
  {
    q: "Can I combine methods on the same song?",
    a: "Yes, and it's common to. A typical path is starting a song with History to Song for the story, then switching to improvisation once there's a chord progression to sing the lines over.",
  },
  {
    q: "What if none of my lines from a session feel usable?",
    a: "Keep them anyway. A line that doesn't fit this song often turns out to fit a different one later — all three methods work better as an ongoing habit of collecting raw material than as a one-time session that has to produce a finished song.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Songwriting Methods: History to Song, Improvisation, Metaphor-Driven",
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
        title="Songwriting Methods: History to Song, Improvisation, Metaphor-Driven"
        intro="Before a song has a structure, it needs raw material — actual lines to work with. These three methods are different ways of generating that material, and each suits a different mood or starting point."
      >
        <GuideSection title="History to Song">
          <p>
            Write the story first, in plain prose — a real memory, something
            you observed, or something entirely invented. Don&rsquo;t worry
            about rhyme, rhythm or line length at this stage; just get the
            story down the way you&rsquo;d tell it to a friend.
          </p>
          <p>
            Once it&rsquo;s written, go back through it and break it into lines —
            the sentences and phrases that already sound the most like
            lyrics usually reveal themselves once the whole story is on the
            page in front of you. This method is especially good when you
            already have a subject (see{" "}
            <Link
              href="/knowledge/songwriting/finding-your-subject"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Finding the Right Subject
            </Link>
            ) but no lines yet.
          </p>
        </GuideSection>

        <GuideSection title="Improvisation">
          <p>
            Play a simple chord progression — guitar or piano both work well
            for this — and sing freely over it, with no plan for what comes
            out. Words, melodies and phrases will surface that you wouldn&rsquo;t
            have written sitting down with a pen.
          </p>
          <p>
            Record every session. Lines that feel obvious in the moment
            disappear fast, and the whole value of improvising is capturing
            the phrases that arrive before you&rsquo;ve had a chance to
            second-guess them.
          </p>
        </GuideSection>

        <GuideSection title="Metaphor-Driven">
          <p>
            Start from a metaphor rather than a literal description (see{" "}
            <Link
              href="/knowledge/songwriting/metaphors"
              className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
            >
              Using Metaphors
            </Link>
            ), and build short lines around it — the metaphor should carry
            most of the emotional weight, with as few extra supporting
            words as possible. This method tends to produce the most
            distinctive, least generic-sounding lines of the three, because
            it forces specificity from the very first line.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
