import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { TabExample } from "../../_components/tab-example";

const PAGE_DESCRIPTION =
  "How to read guitar tablature — the six lines, the numbers, and what h, p, b, / and ~ mean when you see them in a tab.";

export const metadata: Metadata = {
  title: "How to Read Guitar Tabs (Tablature) for Beginners — Trenodo",
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
    a: "Hammer-on. Fret and strike the first number, then bring another finger down on the higher number without picking again — the string keeps ringing, just at a higher pitch.",
  },
  {
    q: "Is tab or sheet music better for learning guitar?",
    a: "Tab is faster to read and shows you exactly where to put your fingers, which is why it's the standard for learning riffs and solos by ear. Sheet music is more precise about rhythm and timing, which tab doesn't show at all — most guitarists end up using both, tab for the notes and the recording itself for the feel.",
  },
  {
    q: "Why doesn't guitar tab show rhythm?",
    a: "Tab was designed to answer one question — where do my fingers go — and left timing to the ear. That's why the standard advice is to always listen to the original recording alongside a tab rather than reading it cold.",
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
        intro="Tab (tablature) is how most guitarists learn a solo, riff or melody line by ear — it's not sheet music, and it doesn't need to be read like it."
      >
        <GuideSection title="The six lines">
          <p>
            Tab is six horizontal lines, one per string. The bottom line is
            your thickest string (low E) and the top line is your thinnest
            (high E) — the layout mirrors looking down at your guitar while
            you play it.
          </p>
          <TabExample highlight="letters" />
        </GuideSection>

        <GuideSection title="The numbers">
          <p>
            A number on a line tells you which fret to press on that string.
            A &ldquo;9&rdquo; on the B string line means: fret the B string at the 9th
            fret and pluck it. Numbers stacked on top of each other are
            played together, as a chord.
          </p>
          <TabExample highlight="numbers" />
        </GuideSection>

        <GuideSection title="The technique symbols">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Hammer-on (h)</strong> —{" "}
              <code>9h10</code>: fret and strike the 9th fret, then hammer a
              finger onto the 10th fret without picking again.
            </li>
            <li>
              <strong className="text-foreground">Pull-off (p)</strong> —{" "}
              <code>9p7</code>: hold both frets down, strike the higher one,
              then lift that finger to sound the lower fret.
            </li>
            <li>
              <strong className="text-foreground">Bend (b) and release (r)</strong>{" "}
              — <code>11b13</code>: strike the 11th fret, then bend the
              string up until it sounds like the 13th fret. A trailing{" "}
              <code>r</code> (<code>11b13r</code>) means bend back down to
              release, back to the 11th fret.
            </li>
            <li>
              <strong className="text-foreground">Slide (/ or \)</strong> —{" "}
              <code>11/13</code> slides up to the 13th fret, <code>13\11</code>{" "}
              slides down to the 11th — same finger, same string, sliding
              while the note keeps ringing.
            </li>
            <li>
              <strong className="text-foreground">Vibrato (~)</strong> —{" "}
              <code>9~</code>: strike the note, then wobble the string
              slightly to add vibrato without changing the pitch.
            </li>
          </ul>
          <p>
            All five, in one riff:
          </p>
          <TabExample highlight="techniques" />
        </GuideSection>

        <GuideSection title="Reading it in practice">
          <p>
            Read left to right, exactly like text. What tab won&rsquo;t tell you is
            rhythm or note length — it shows where, not when. Keep the
            original recording open alongside any tab you&rsquo;re learning; your
            ear fills in the timing that the page can&rsquo;t show.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
