import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Why flow matters more than cleverness, how to simplify a line that isn't singing well, and how to actually revise a draft instead of just re-reading it.";

export const metadata: Metadata = {
  title: "Refining Your Lyrics: Flow, Simplicity and Revision — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/refining-your-lyrics" },
  openGraph: {
    title: "Refining Your Lyrics: Flow, Simplicity and Revision",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/refining-your-lyrics",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "How do I know if a line has bad flow?",
    a: "Sing it, not just read it. A line that reads fine on the page can still trip over itself the moment it has to fit a melody and a rhythm — singing it out loud catches that immediately, reading it silently often doesn't.",
  },
  {
    q: "Is a simpler lyric a weaker lyric?",
    a: "No — simplicity and depth aren't opposites. Some of the most affecting lyrics use very plain, short words; the depth comes from what the words are pointing at, not from how complicated they sound.",
  },
  {
    q: "How many times should I revise a lyric before it's done?",
    a: "There's no fixed number, but if you've never cut a line you were originally proud of, you probably haven't revised hard enough yet. The first draft's job is just to exist — the real lyric is usually found in revision.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Refining Your Lyrics: Flow, Simplicity and Revision",
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
        title="Refining Your Lyrics: Flow, Simplicity and Revision"
        intro="A first draft's job is to exist, not to be good. The lines that actually end up in the finished song are usually found in the revision, not the first pass."
      >
        <GuideSection title="Flow beats cleverness">
          <p>
            A line&rsquo;s most important quality isn&rsquo;t how clever or precise
            it is on the page — it&rsquo;s whether it feels natural coming out
            of your mouth when you sing it. A technically impressive line
            that trips over itself rhythmically will always lose to a
            plainer one that sings smoothly.
          </p>
          <p>
            Sing every line out loud while you&rsquo;re writing, not just while
            reviewing later. A word that reads fine silently can reveal an
            awkward rhythm the moment it actually has to be sung.
          </p>
        </GuideSection>

        <GuideSection title="Favor short, simple words">
          <p>
            Shorter lines with fewer long, multi-syllable words are
            consistently easier to sing well and easier for a listener to
            catch on a single pass. As a rough guide, be wary of any word
            running past five or six syllables in a lyric — it&rsquo;s rarely
            impossible to sing, but it&rsquo;s almost always harder than it
            needs to be.
          </p>
        </GuideSection>

        <GuideSection title="Actually revise, don't just re-read">
          <p>
            Re-reading a draft mostly confirms what&rsquo;s already there.
            Revising means being willing to cut a line you liked, if a
            simpler or more specific one would serve the song better.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>Cut any word that isn&rsquo;t adding meaning, image or rhythm — a line often gets stronger by getting shorter.</li>
            <li>Read the lyric on its own, with no melody, and check whether it still makes sense as writing.</li>
            <li>Play it for someone else. A line that&rsquo;s completely clear in your head can still be confusing to a first-time listener, and you&rsquo;re usually the last person able to catch that.</li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
