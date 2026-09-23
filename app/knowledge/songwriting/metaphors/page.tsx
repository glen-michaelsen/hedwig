import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "A metaphor is the spice that turns a plain feeling into a line people remember. How to build one from scratch, with an example.";

export const metadata: Metadata = {
  title: "Using Metaphors in Songwriting | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/metaphors" },
  openGraph: {
    title: "Using Metaphors in Songwriting",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/metaphors",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Do I need a metaphor in every line?",
    a: "No. A song made only of metaphors can be hard to follow. One strong metaphor that does real work is worth much more than a new one in every line.",
  },
  {
    q: "What if my metaphor feels like a cliché?",
    a: "Go one step deeper. \"Broken heart\" is a cliché. The exact feeling or picture behind your own version usually isn't. The cliché lives in the general version of an image, not in the image itself.",
  },
  {
    q: "Should I say the feeling directly, or always use a metaphor?",
    a: "Neither is always better. They are different tools. A direct line can hit very hard, exactly because the rest of the song used metaphors. Metaphors everywhere can take away that contrast.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Using Metaphors in Songwriting",
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

export default function MetaphorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Using Metaphors in Songwriting"
        intro="You don't need a metaphor to write a good song. But it is often what makes a line stick, instead of just being correct. Think of it as the spice in the dish. Optional, but you notice when it is there. 🌶️"
      >
        <GuideSection title="Why metaphors work">
          <p>
            When you say a feeling straight out, like &ldquo;I feel lonely,&rdquo; you
            tell the listener what to think. A metaphor shows them a picture,
            and lets the feeling come by itself. That is usually a stronger
            way to land the same emotion. Many of the most famous lines in pop
            music are, deep down, a well known feeling wrapped in a surprising
            picture.
          </p>
        </GuideSection>

        <GuideSection title="An example: loneliness">
          <p>
            Instead of naming the feeling, describe a picture or a situation
            that holds it. Without using the word:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Alone in darkness</li>
            <li>Trapped in involuntary egoism</li>
            <li>Overlooked</li>
            <li>Hidden away</li>
          </ul>
          <p>
            None of them say &ldquo;lonely.&rdquo; Each one puts the listener inside a
            picture or a situation that carries the feeling. That is the whole
            trick. First you pick the emotion. Then you look for pictures that
            hold it, without ever saying its name.
          </p>
        </GuideSection>

        <GuideSection title="Build your own">
          <ol className="list-decimal space-y-3 pl-5">
            <li>Name the feeling you are writing about. Just for yourself, not for the lyric.</li>
            <li>List pictures, objects or situations that carry the same feeling, without saying it.</li>
            <li>Test each one. Does it give you the feeling on its own? Or does it need the feeling named next to it? If it needs the label, it is not working yet.</li>
            <li>Keep the best one or two. A song usually only has room to build one metaphor properly.</li>
          </ol>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
