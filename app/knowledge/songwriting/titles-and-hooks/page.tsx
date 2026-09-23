import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How to find a strong song title, why it is usually already in your chorus, and where it should sit in the song.";

export const metadata: Metadata = {
  title: "How to Write a Song Title and Hook | Trenodo",
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
    q: "What is the difference between a title and a hook?",
    a: "A hook is any short, catchy phrase or melody made to stick in the listener's head. The title is the name of the song. Very often, but not always, the hook and the title are the same line.",
  },
  {
    q: "Should I pick the title before or after I write the song?",
    a: "Usually after. When the whole lyric exists, it is much easier to spot your strongest line. Much easier than writing towards a title you picked in advance.",
  },
  {
    q: "Can the title be a phrase that is not in the lyric?",
    a: "Yes, but it is less common. Most listeners expect to hear the title somewhere in the song, usually in the chorus. A title that is not in the lyric works best when that feels like a choice.",
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
        intro="Every song needs one thing the listener remembers. Most of the time, that is the title. And it is usually hiding somewhere in your draft already. Let's get you hooked. 🎣"
      >
        <GuideSection title="Your title is probably already written">
          <p>
            Don&rsquo;t invent a title from nothing. Look through your draft for
            the line people would quote. The line you would say out loud if
            you described the song to someone who hasn&rsquo;t heard it. That
            line is very often your title. Even if you didn&rsquo;t write it as
            one.
          </p>
        </GuideSection>

        <GuideSection title="Where it usually sits">
          <p>
            The title is most often in the chorus. Either as the first line,
            so it is the first thing the listener hears repeated. Or as the
            last line, so it is what they are left with when the chorus ends.
            Both work. What matters is that the title sits where the
            repetition of the chorus makes it stronger.
          </p>
        </GuideSection>

        <GuideSection title="What makes a hook stick">
          <p>
            A strong hook is usually short, with a simple rhythm and a direct
            feeling. It doesn&rsquo;t need to be clever. It needs to hit right away.
            If a phrase needs to be explained before it lands, it is probably
            too complicated to be a hook. No matter how good it looks on
            paper.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
