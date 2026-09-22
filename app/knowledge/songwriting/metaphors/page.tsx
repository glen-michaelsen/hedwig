import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Metaphor is the seasoning that turns a plainly stated feeling into a line people remember — how to build one from scratch, with a worked example.";

export const metadata: Metadata = {
  title: "Using Metaphors in Songwriting — Trenodo",
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
    a: "No — a song built entirely from metaphor can become hard to follow. One strong, consistent metaphor doing real work is worth far more than a different one in every line.",
  },
  {
    q: "What if my metaphor feels like a cliché?",
    a: "Push it one layer further. \"Broken heart\" is a cliché; the specific physical sensation or image behind your version of that feeling usually isn't. Cliché lives in the generic version of an image, not the image itself.",
  },
  {
    q: "Is it better to state a feeling directly or always use a metaphor?",
    a: "Neither is automatically better — they're different tools. A direct line can hit hard precisely because the song has earned it with metaphor elsewhere; using metaphor everywhere can blunt that contrast.",
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
        intro="A metaphor isn't required to write a good song, but it's often what separates a line that's merely accurate from one that actually sticks. Think of it as seasoning — optional, but it's doing real work when it's there."
      >
        <GuideSection title="Why metaphor works">
          <p>
            Stating a feeling directly (&ldquo;I feel lonely&rdquo;) tells a listener
            what to think. A metaphor shows them an image and lets the
            feeling arrive on its own — which is usually a more powerful
            way to land the same emotion. Many of the most memorable lines
            in popular music are, underneath, a familiar feeling packaged
            inside an unexpected image.
          </p>
        </GuideSection>

        <GuideSection title="A worked example: loneliness">
          <p>
            Instead of naming the feeling, describe an image or situation
            that embodies it without saying the word:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Alone in darkness</li>
            <li>Trapped in involuntary egoism</li>
            <li>Overlooked</li>
            <li>Hidden away</li>
          </ul>
          <p>
            None of these say &ldquo;lonely&rdquo; — each one puts the listener inside
            a specific image or situation that carries the feeling instead.
            That&rsquo;s the actual mechanism: pick the emotion first, then
            brainstorm images or scenarios that embody it without ever
            naming it directly.
          </p>
        </GuideSection>

        <GuideSection title="Building your own">
          <ol className="list-decimal space-y-3 pl-5">
            <li>Name the feeling you&rsquo;re actually writing about — just for yourself, not for the lyric.</li>
            <li>List images, objects or situations that carry that same feeling without stating it.</li>
            <li>Test each one: does it evoke the feeling on its own, or does it still need the feeling named alongside it to make sense? If it needs the label, it isn&rsquo;t doing the work yet.</li>
            <li>Keep the strongest one or two — a song usually only has room to develop a single metaphor properly.</li>
          </ol>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
