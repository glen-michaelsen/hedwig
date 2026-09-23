import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { TabExample } from "../../_components/tab-example";

const PAGE_DESCRIPTION =
  "How to read guitar tabs. The six lines, the numbers, and what h, p, b, / and ~ mean when you see them in a tab.";

export const metadata: Metadata = {
  title: "How to Read Guitar Tabs (Tablature) for Beginners | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/reading-tabs" },
  openGraph: {
    title: "How to Read Guitar Tabs (Tablature) for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/reading-tabs",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What does 'h' mean in guitar tab?",
    a: "Hammer-on. Press and play the first number. Then hit the higher number with another finger, without picking again. The string keeps ringing, just at a higher note.",
  },
  {
    q: "Is tab or sheet music better for learning guitar?",
    a: "Tab is faster to read, and it shows exactly where your fingers go. That is why most guitarists use it to learn riffs and solos. Sheet music is more precise about rhythm, which tab does not show at all. Most guitarists use both: the tab for the notes, and the recording for the feel.",
  },
  {
    q: "Why doesn't guitar tab show rhythm?",
    a: "Tab was made to answer one question: where do my fingers go? The timing is left to your ear. That is why you should always listen to the original song while you read the tab.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Read Guitar Tabs (Tablature) for Beginners",
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

export default function GuitarReadingTabsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="How to Read Guitar Tabs (Tablature) for Beginners"
        intro="Tab (short for tablature) is how most guitarists learn a solo, a riff or a melody. It is not sheet music. And you don't need to read it like sheet music either. 🙂"
      >
        <GuideSection title="The six lines">
          <p>
            A tab has six lines, one for each string. The bottom line is your
            thickest string (low E). The top line is your thinnest string
            (high E). It is like looking down at your guitar while you play.
          </p>
          <TabExample highlight="letters" />
        </GuideSection>

        <GuideSection title="The numbers">
          <p>
            A number on a line tells you which fret to press on that string. A
            &ldquo;9&rdquo; on the B string means: press the B string on the 9th fret,
            and play it. Numbers stacked on top of each other are played at
            the same time, like a chord.
          </p>
          <TabExample highlight="numbers" />
        </GuideSection>

        <GuideSection title="The technique symbols">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Hammer-on (h).</strong>{" "}
              <code>9h10</code>: play the 9th fret. Then hammer a finger down
              on the 10th fret, without picking again.
            </li>
            <li>
              <strong className="text-foreground">Pull-off (p).</strong>{" "}
              <code>9p7</code>: hold both frets down and play the higher one.
              Then lift that finger, so the lower fret sounds.
            </li>
            <li>
              <strong className="text-foreground">Bend (b) and release (r).</strong>{" "}
              <code>11b13</code>: play the 11th fret. Then bend the string up
              until it sounds like the 13th fret. An <code>r</code> at the end
              (<code>11b13r</code>) means you release the bend, back to the
              11th fret.
            </li>
            <li>
              <strong className="text-foreground">Slide (/ or \).</strong>{" "}
              <code>11/13</code> slides up to the 13th fret. <code>13\11</code>{" "}
              slides down to the 11th. Same finger, same string. The note keeps
              ringing while you slide.
            </li>
            <li>
              <strong className="text-foreground">Vibrato (~).</strong>{" "}
              <code>9~</code>: play the note, and then shake the string a
              little. It adds life to the note without changing it.
            </li>
          </ul>
          <p>All five, in one riff:</p>
          <TabExample highlight="techniques" />
        </GuideSection>

        <GuideSection title="Reading it in practice">
          <p>
            Read from left to right, just like text. But tab does not tell you
            the rhythm or how long a note is. It shows where, not when. So keep
            the original song playing while you learn from a tab. Your ear
            fills in the timing. 🎧
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
