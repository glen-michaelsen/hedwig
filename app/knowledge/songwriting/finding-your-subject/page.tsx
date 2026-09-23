import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Songs work best when they are about something the writer really means. Where to look for a good subject, and how to make it specific.";

export const metadata: Metadata = {
  title: "How to Find a Subject for Your Song | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/finding-your-subject" },
  openGraph: {
    title: "How to Find a Subject for Your Song",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/finding-your-subject",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What if nothing in my life feels interesting enough to write about?",
    a: "It is almost never the size of the subject that makes a song work. It is the details. A breakup everyone has had becomes a song the moment it is about one specific Tuesday. Not about breakups in general.",
  },
  {
    q: "Can I write about something I haven't lived through myself?",
    a: "Yes. Things you see and things you imagine are just as good as memories. The test is not if it happened to you. The test is if you can make it specific enough to feel true.",
  },
  {
    q: "Is it bad to write another love song?",
    a: "Not at all. Love, loss, friendship and joy are the most common subjects in music, because we all know them. An honest and specific angle on a well known feeling is exactly what makes a song feel new.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Find a Subject for Your Song",
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

export default function FindingYourSubjectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="How to Find a Subject for Your Song"
        intro="Every other choice in a song gets easier with a real subject under it. The words, the structure, the melody. This is where you start. And it is often where a song that got stuck went wrong."
      >
        <GuideSection title="Write about something that means something to you">
          <p>
            A song is much stronger when it is about something the writer
            really cares about. Not a subject picked because a song
            &ldquo;should&rdquo; be about it. Listeners can hear that honesty. They
            can feel the difference between a real feeling and a performance
            of one. Even if they can&rsquo;t explain it. ❤️
          </p>
          <p>
            A few subjects come back again and again in popular music. For a
            good reason: almost everyone has felt them.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Love.</strong> New,
              ongoing, ending, or seen in the rear view mirror.
            </li>
            <li>
              <strong className="text-foreground">Friendship.</strong> What it
              gives you, or what it costs to lose it.
            </li>
            <li>
              <strong className="text-foreground">Loss and grief.</strong> Of
              a person, a relationship, or a version of your own life.
            </li>
            <li>
              <strong className="text-foreground">Joy.</strong> The hardest
              of the four to write well. There is no built in tension to write
              towards.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Make it specific">
          <p>
            A general subject like &ldquo;heartbreak&rdquo; or &ldquo;missing
            someone&rdquo; gives the listener nothing to see. A specific one does
            the opposite. One special night. One exact sentence someone said.
            One small detail. The details are what turn a well known feeling
            into a song that feels honest.
          </p>
          <p>
            A good test when you choose: could this line only be about your
            situation? Or could it open a thousand other songs? The specific
            answer is almost always the stronger one. 💡
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
