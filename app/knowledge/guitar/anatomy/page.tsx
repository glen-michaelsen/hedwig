import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "A plain-English tour of every part of a guitar — head, tuning pegs, nut, fretboard, body and bridge — and what each one actually does.";

export const metadata: Metadata = {
  title: "Guitar Anatomy: The Parts of a Guitar Explained — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/anatomy" },
  openGraph: {
    title: "Guitar Anatomy: The Parts of a Guitar Explained",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/anatomy",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What is the nut on a guitar for?",
    a: "The nut is the small grooved strip where the fretboard meets the headstock. It keeps the strings spaced correctly and sets their height above the first fret — too high and chords are hard to press down, too low and the strings buzz against the frets.",
  },
  {
    q: "Why do some guitars have a sound hole and others don't?",
    a: "An acoustic guitar is hollow and uses its body and sound hole to project sound on its own. An electric guitar's solid body doesn't need to project sound acoustically — it relies on pickups to turn string vibration into a signal an amplifier can output.",
  },
  {
    q: "What's the difference between the bridge and the nut?",
    a: "They do the same job at opposite ends of the strings. The nut sets the string spacing and height at the top of the neck; the bridge does the same at the body end, and on most guitars also anchors the strings in place.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Guitar Anatomy: The Parts of a Guitar Explained",
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

export default function GuitarAnatomyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="Guitar Anatomy: The Parts of a Guitar Explained"
        intro="Every guide on this site refers back to these parts, so it's worth five minutes to learn the names before you learn your first chord."
      >
        <GuideSection title="The seven main parts">
          <p>
            A guitar is a stringed instrument, almost always with six
            strings, and it shows up in nearly every genre — rock, pop, folk,
            jazz, blues. Whether it&rsquo;s acoustic or electric, the same seven
            parts do the same jobs.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Head (headstock)</strong> —
              the flat section at the top of the neck. It holds the tuning
              pegs and anchors one end of each string.
            </li>
            <li>
              <strong className="text-foreground">Tuning pegs</strong> —
              turn one and its string gets higher or lower in pitch. Tuning a
              guitar is just turning the right peg by the right amount.
            </li>
            <li>
              <strong className="text-foreground">Nut</strong> — the small
              grooved strip between the headstock and the neck. It spaces the
              strings evenly and sets their height above the first fret.
            </li>
            <li>
              <strong className="text-foreground">Fretboard (fingerboard)</strong>{" "}
              — the front of the neck, marked with metal frets. Pressing a
              string down behind a fret shortens the vibrating length of the
              string, which is how you change notes and play chords.
            </li>
            <li>
              <strong className="text-foreground">Body</strong> — the large
              part you rest against yourself. Its size, shape and material
              are the biggest factors in how the guitar actually sounds.
            </li>
            <li>
              <strong className="text-foreground">Sound hole</strong> — the
              opening on an acoustic guitar&rsquo;s body. Sound projects from here,
              which is also why an acoustic sounds loudest to a listener
              standing in front of it, not behind your strumming hand.
            </li>
            <li>
              <strong className="text-foreground">Bridge</strong> — anchors
              the other end of the strings to the body and holds them at the
              correct height and spacing above the fretboard.
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
