import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What a verse, chorus, bridge, intro and outro each actually do — and the standard structure most pop songs are built from.";

export const metadata: Metadata = {
  title: "Anatomy of a Song: Verse, Chorus, Bridge and Song Structure — Trenodo",
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
    body: "Sets the mood and tempo before any words arrive — often a stripped-down version of the chorus or verse instrumentation, giving the listener a moment to settle in.",
  },
  {
    name: "Verse",
    body: "Moves the story forward. Each verse should introduce something new — a detail, a development, a shift in perspective — rather than repeating what the last one already said.",
  },
  {
    name: "Chorus",
    body: "The emotional core of the song, repeated with little or no change. This is usually where the title lives, and it's built to be the most memorable, most quotable part of the whole song.",
  },
  {
    name: "Bridge",
    body: "A deliberate break from the pattern — a new chord progression, a new melody, sometimes a shift in perspective or a turn in the story — that resets the listener's ear right before the final chorus lands harder for it.",
  },
  {
    name: "Outro",
    body: "Winds the song back down, mirroring the intro's job in reverse. Can fade the last chorus out, repeat a key line, or simply resolve the music to a stop.",
  },
] as const;

const FAQS = [
  {
    q: "Do I have to follow the standard structure exactly?",
    a: "No — it's a starting template, not a rule. Plenty of great songs skip the bridge entirely, repeat a verse instead of writing a third one, or drop the intro altogether. Learn the standard shape first; it's much easier to break deliberately once you know what you're breaking.",
  },
  {
    q: "What's the difference between a verse and a chorus, structurally?",
    a: "A verse changes its words each time it repeats (the melody usually stays similar); a chorus repeats both its words and its melody almost exactly every time. That repetition is exactly what makes the chorus the part listeners remember and sing along to.",
  },
  {
    q: "Does every song need a bridge?",
    a: "No. A bridge earns its place by giving the listener something genuinely new right when the song risks feeling repetitive — if the song is short or the chorus is strong enough to carry repetition on its own, skipping the bridge is a completely valid choice.",
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
        intro="Most pop songs are built from the same handful of parts, arranged in roughly the same order. Knowing what each part is actually for makes it much easier to know what a song you're stuck on is missing."
      >
        <GuideSection title="The parts, and what each one does">
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

        <GuideSection title="A standard structure">
          <p>
            A common, reliable shape for a pop song puts those parts in this
            order:
          </p>
          <p className="rounded-2xl border border-line bg-surface-muted/60 px-5 py-4 font-mono text-sm text-foreground">
            Verse — Verse — Chorus — Verse — Verse — Chorus — Bridge —
            Chorus — Chorus
          </p>
          <p>
            That&rsquo;s a template worth learning first precisely because it&rsquo;s
            so common — a listener&rsquo;s ear already expects it, which is what
            makes deviating from it (skipping a verse, repeating the bridge,
            cutting straight to the chorus) land as a deliberate choice
            rather than something that just feels off.
          </p>
        </GuideSection>

        <GuideSection title="A closing note on instrumentation">
          <p>
            Which instruments carry each section is a genre and taste
            decision more than a structural one. A minimalist pop song
            might stay on a single guitar or piano the whole way through; a
            rock song typically builds a fuller arrangement under the
            chorus than the verse. Either way, instrumentation is usually
            easier to decide once the song&rsquo;s structure and lyric are
            already solid, not before.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
