import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How a strong song title gets chosen, why it's usually already sitting inside your chorus, and where it typically lands.";

export const metadata: Metadata = {
  title: "How to Write a Song Title and Hook — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/titles-and-hooks" },
  openGraph: {
    title: "How to Write a Song Title and Hook",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/titles-and-hooks",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What's the difference between a title and a hook?",
    a: "A hook is any short, catchy phrase or melodic moment designed to stick in a listener's memory. A title is just the name of the song — very often, but not always, the hook and the title are the exact same line.",
  },
  {
    q: "Should I choose the title before or after writing the song?",
    a: "After, usually. It's much easier to spot your song's strongest, most quotable line once the whole lyric already exists than to write toward a title picked in advance.",
  },
  {
    q: "Can a title be a phrase that never actually appears in the lyric?",
    a: "Yes, though it's the less common choice. Most listeners expect the title to show up somewhere in the song, usually in the chorus, so a title that's absent from the lyric works best when that absence itself feels deliberate.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Write a Song Title and Hook",
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

export default function TitlesAndHooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="How to Write a Song Title and Hook"
        intro="Every song needs one thing a listener walks away remembering. Most of the time, that's the title — and it's usually already hiding somewhere in your draft."
      >
        <GuideSection title="Your title is probably already written">
          <p>
            Rather than inventing a title from scratch, look back through
            your draft for the line that&rsquo;s the most quotable — the one
            you&rsquo;d be most likely to say out loud if you were describing the
            song to someone who hadn&rsquo;t heard it. That line is very often
            your title, whether or not you set out to write it as one.
          </p>
        </GuideSection>

        <GuideSection title="Where it usually lands">
          <p>
            The title most commonly appears in the chorus — often as the
            first line (so it&rsquo;s the first thing a listener hears repeated)
            or the last line (so it&rsquo;s the last thing they&rsquo;re left with
            before the chorus ends). Both placements work; what matters is
            that the title lands somewhere the chorus&rsquo;s repetition will
            reinforce it.
          </p>
        </GuideSection>

        <GuideSection title="What makes a hook actually stick">
          <p>
            A strong hook is usually short, rhythmically simple, and
            emotionally direct — it doesn&rsquo;t need to be clever so much as
            immediate. If a phrase needs explaining before it lands, it&rsquo;s
            probably too complicated to work as a hook, however good it
            reads on the page.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
