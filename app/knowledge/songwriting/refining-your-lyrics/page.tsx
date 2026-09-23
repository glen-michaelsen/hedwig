import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why flow beats clever words, how to make a line easier to sing, and how to really edit a draft instead of just reading it again.";

export const metadata: Metadata = {
  title: "Refining Your Lyrics: Flow, Simplicity and Editing | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/refining-your-lyrics" },
  openGraph: {
    title: "Refining Your Lyrics: Flow, Simplicity and Editing",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/refining-your-lyrics",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "How do I know if a line has bad flow?",
    a: "Sing it. Don't just read it. A line can look fine on paper, and still trip over itself when it has to fit a melody and a rhythm. Singing it out loud shows you at once. Reading it in silence often doesn't.",
  },
  {
    q: "Is a simple lyric a weak lyric?",
    a: "No. Simple and deep are not opposites. Some of the most moving lyrics use very plain, short words. The depth comes from what the words point at, not from how fancy they sound.",
  },
  {
    q: "How many times should I edit a lyric?",
    a: "There is no fixed number. But if you have never cut a line you were proud of, you probably haven't edited enough. The job of the first draft is just to exist. The real lyric is usually found when you edit.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Refining Your Lyrics: Flow, Simplicity and Editing",
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

export default function RefiningYourLyricsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Refining Your Lyrics: Flow, Simplicity and Editing"
        intro="The job of a first draft is to exist. Not to be good. The lines that end up in the finished song are usually found when you edit. Not in the first round. ✍️"
      >
        <GuideSection title="Flow beats clever">
          <p>
            The most important thing about a line is not how clever it looks
            on paper. It is how natural it feels when you sing it. A smart
            line that trips over its own rhythm will always lose to a simple
            line that flows.
          </p>
          <p>
            Sing every line out loud while you write. Not only when you look
            back at it later. A word that looks fine on paper can show an
            awkward rhythm the moment you sing it.
          </p>
        </GuideSection>

        <GuideSection title="Choose short and simple words">
          <p>
            Short lines with few long words are easier to sing well. And
            easier for the listener to catch the first time. As a rule of
            thumb, be careful with words of more than five or six syllables in
            a lyric. You can sing them. But it is almost always harder than it
            needs to be.
          </p>
        </GuideSection>

        <GuideSection title="Edit for real, don't just read again">
          <p>
            Reading a draft again mostly confirms what is already there. To
            edit is to be ready to cut a line you liked, if a simpler or more
            specific line serves the song better.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>Cut every word that doesn&rsquo;t add meaning, a picture or rhythm. A line often gets stronger when it gets shorter.</li>
            <li>Read the lyric on its own, without the melody. Does it still make sense as text?</li>
            <li>Play it for someone else. A line that is crystal clear in your head can still confuse a new listener. And you are the last person who can hear that.</li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
