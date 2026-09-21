import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "A plain-English tour of every part of a bass guitar — head, neck, pickups and body — and what each one actually does.";

export const metadata: Metadata = {
  title: "Bass Guitar Anatomy: The Parts of a Bass Explained — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/bass/anatomy" },
  openGraph: {
    title: "Bass Guitar Anatomy: The Parts of a Bass Explained",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/bass/anatomy",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why does a bass usually have one or two pickups?",
    a: "Each pickup senses string vibration at a different point along the string, which picks up a different mix of tones. A bass with two can blend them, giving more tonal range than a single fixed pickup position would.",
  },
  {
    q: "What does the bridge actually adjust?",
    a: "Mainly the strings' height above the fretboard (the action) and, on most basses, each string's exact length (intonation) — both affect how comfortable the bass is to play and how in-tune it stays up the neck.",
  },
  {
    q: "Do all basses have four strings?",
    a: "Four (E-A-D-G) is the standard, but five- and six-string basses exist too, adding a lower B string and/or a higher C string for extended range.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Bass Guitar Anatomy: The Parts of a Bass Explained",
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

export default function BassAnatomyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Bass"
        categoryHref="/knowledge/bass"
        title="Bass Guitar Anatomy: The Parts of a Bass Explained"
        intro="A bass looks like a stretched-out guitar, but a few of its parts do a noticeably different job. Here's what each one is for."
      >
        <GuideSection title="The main parts">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Head and tuners</strong> —
              the end of the neck holding the tuning machines. Turning a
              tuner raises or lowers that string&rsquo;s pitch.
            </li>
            <li>
              <strong className="text-foreground">Nut</strong> — where the
              headstock meets the neck, keeping the strings evenly spaced and
              at the right height above the first fret.
            </li>
            <li>
              <strong className="text-foreground">Neck and fretboard</strong>{" "}
              — fretted like a guitar&rsquo;s, with position markers (dots) inlaid
              along it to help you find your place without looking at the
              headstock.
            </li>
            <li>
              <strong className="text-foreground">Pickguard</strong> — a
              plate protecting the body&rsquo;s finish from pick scratches or
              slap-technique contact.
            </li>
            <li>
              <strong className="text-foreground">Pickups</strong> — magnetic
              sensors (one or two) that turn string vibration into an
              electrical signal. Pickup type and position are a major part of
              a bass&rsquo;s tone.
            </li>
            <li>
              <strong className="text-foreground">Controls</strong> — volume
              and tone knobs, and on a bass with two pickups, usually a way
              to blend between them.
            </li>
            <li>
              <strong className="text-foreground">Body</strong> — resonates
              with the strings and shapes the instrument&rsquo;s overall tone,
              alongside the pickups.
            </li>
            <li>
              <strong className="text-foreground">Bridge</strong> — anchors
              the strings at the body end and sets their height (action) and,
              on most basses, each string&rsquo;s precise length (intonation).
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
