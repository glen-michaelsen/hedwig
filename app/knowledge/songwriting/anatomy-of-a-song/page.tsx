import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What the verse, chorus, bridge, intro and outro each do. And the classic structure most pop songs are built on.";

export const metadata: Metadata = {
  title: "Anatomy of a Song: Verse, Chorus, Bridge and Song Structure | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/songwriting/anatomy-of-a-song" },
  openGraph: {
    title: "Anatomy of a Song: Verse, Chorus, Bridge and Song Structure",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/songwriting/anatomy-of-a-song",
    siteName: "Trenodo",
    type: "article",
  },
};

const PARTS = [
  {
    name: "Intro",
    body: "Sets the mood and the tempo, before any words come in. Often a simpler version of the chorus or the verse. It gives the listener a moment to land.",
  },
  {
    name: "Verse",
    body: "Moves the story forward. Every verse should bring something new: a detail, a change, a new angle. Don't repeat what the last verse already said.",
  },
  {
    name: "Chorus",
    body: "The emotional core of the song. It repeats with little or no change. The title usually lives here. It is made to be the part everyone remembers and sings along to.",
  },
  {
    name: "Bridge",
    body: "A planned break from the pattern. New chords, a new melody, sometimes a new angle in the story. It resets the ear, so the last chorus hits even harder.",
  },
  {
    name: "Outro",
    body: "Brings the song back down. Like the intro, but in reverse. It can fade out the last chorus, repeat a key line, or simply end the music.",
  },
] as const;

const FAQS = [
  {
    q: "Do I have to follow the classic structure exactly?",
    a: "No. It is a template, not a rule. Many great songs skip the bridge, repeat a verse or have no intro at all. Learn the classic shape first. It is much easier to break a rule on purpose when you know it.",
  },
  {
    q: "What is the difference between a verse and a chorus?",
    a: "A verse gets new words each time it comes back. The melody usually stays the same. A chorus repeats both the words and the melody almost exactly, every time. That repetition is why the chorus is the part people remember.",
  },
  {
    q: "Does every song need a bridge?",
    a: "No. A bridge earns its place by giving something new, right when the song starts to feel repetitive. If the song is short, or the chorus is strong enough, it is fine to skip it.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Anatomy of a Song: Verse, Chorus, Bridge and Song Structure",
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

export default function AnatomyOfASongPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Songwriting"
        categoryHref="/knowledge/songwriting"
        title="Anatomy of a Song: Verse, Chorus, Bridge and Song Structure"
        intro="Most pop songs are built from the same few parts, in more or less the same order. When you know what each part is for, it is much easier to see what your song is missing."
      >
        <GuideSection title="The parts, and what they do">
          <div className="space-y-4">
            {PARTS.map((part) => (
              <div
                key={part.name}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {part.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {part.body}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="A classic structure">
          <p>
            A common and reliable shape for a pop song puts the parts in this
            order:
          </p>
          <p className="rounded-2xl border border-line bg-surface-muted/60 px-5 py-4 font-mono text-sm text-foreground">
            Verse, Verse, Chorus, Verse, Verse, Chorus, Bridge, Chorus, Chorus
          </p>
          <p>
            It is worth learning first, exactly because it is so common. The
            listener&rsquo;s ear already expects it. That is also why it works when
            you break it. Skip a verse, repeat the bridge or jump straight to
            the chorus, and it feels like a choice. Not like a mistake. 🎶
          </p>
        </GuideSection>

        <GuideSection title="A note on instruments">
          <p>
            Which instruments play in each part is more about style and taste
            than structure. A simple pop song might use one guitar or one
            piano all the way through. A rock song usually builds a bigger
            sound in the chorus than in the verse. Either way, the
            instruments are easier to decide when the structure and the lyric
            are in place. Not before.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
