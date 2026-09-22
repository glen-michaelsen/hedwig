import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Songs work best when they're about something the writer actually means — where to look for a subject worth writing about, and how to make it specific.";

export const metadata: Metadata = {
  title: "How to Find a Subject for Your Song — Trenodo",
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
    a: "It almost never is the size of the subject that makes a song land — it's the specificity. A breakup everyone's had becomes a song the moment it's about one particular Tuesday, not breakups in general.",
  },
  {
    q: "Can I write about something I haven't personally experienced?",
    a: "Yes — observation and imagination are both valid starting points, not just memory. The test isn't whether it happened to you; it's whether you can make it specific enough to feel true.",
  },
  {
    q: "Is it bad to write another love song? Hasn't everything already been said?",
    a: "No — love, loss, friendship and joy are the most-written subjects in music precisely because they're universal, and a specific, honest angle on a familiar feeling is exactly what makes a song feel new.",
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
        intro="Every other decision in songwriting — the words, the structure, the melody — is easier once there's a real subject underneath it. This is usually where to start, and where most stalled songs actually went wrong."
      >
        <GuideSection title="Write about something that actually means something to you">
          <p>
            A song is far more convincing when it&rsquo;s built on a subject the
            writer genuinely cares about, rather than a subject chosen
            because it seems like what a song &ldquo;should&rdquo; be about. That
            honesty is audible — listeners can tell the difference between a
            feeling and a performance of a feeling, even when they can&rsquo;t
            say exactly how.
          </p>
          <p>
            A handful of subjects show up constantly across popular music
            for a reason: they&rsquo;re the feelings almost everyone has actually
            lived through.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Romantic love</strong> —
              new, ongoing, ending, or looked back on.
            </li>
            <li>
              <strong className="text-foreground">Friendship</strong> — what
              it gives you, or what it costs to lose it.
            </li>
            <li>
              <strong className="text-foreground">Loss and grief</strong> —
              of a person, a relationship, or a version of your own life.
            </li>
            <li>
              <strong className="text-foreground">Joy</strong> — the
              hardest of the four to write well, precisely because it has no
              built-in tension to write toward.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Make it specific">
          <p>
            A general subject (&ldquo;heartbreak,&rdquo; &ldquo;missing someone&rdquo;) gives a
            listener nothing to actually picture. A specific one does the
            opposite — one particular night, one exact phrase someone said,
            one small physical detail — and specificity is usually what
            turns a familiar feeling into a song that feels honest rather
            than generic.
          </p>
          <p>
            A useful test while you&rsquo;re choosing a subject: could this line
            only be about your situation, or could it be the opening line of
            a thousand other songs? The more specific answer is almost
            always the stronger one to build from.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
