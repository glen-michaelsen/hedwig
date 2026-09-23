import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Every part of a guitar in plain English. Head, tuning pegs, nut, fretboard, body and bridge, and what each part actually does.";

export const metadata: Metadata = {
  title: "Guitar Anatomy: The Parts of a Guitar Explained | Trenodo",
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
    a: "The nut is the small strip with grooves, where the fretboard meets the head. It keeps the strings spaced correctly, and sets how high they sit over the first fret. Too high, and chords are hard to press. Too low, and the strings buzz.",
  },
  {
    q: "Why do some guitars have a sound hole and others don't?",
    a: "An acoustic guitar is hollow. It uses the body and the sound hole to make the sound loud on its own. An electric guitar has a solid body. It doesn't need to be loud by itself, because the pickups send the sound to an amplifier.",
  },
  {
    q: "What is the difference between the bridge and the nut?",
    a: "They do the same job, at each end of the strings. The nut sets the spacing and height at the top of the neck. The bridge does the same at the body. On most guitars, the bridge also holds the strings in place.",
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
        intro="All our guitar guides use these words. So spend five minutes on them before your first chord. It makes everything else easier."
      >
        <GuideSection title="The seven main parts">
          <p>
            A guitar almost always has six strings. You find it in nearly
            every style of music: rock, pop, folk, jazz and blues. Acoustic or
            electric, the same seven parts do the same jobs. 🎸
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Head (headstock).</strong>{" "}
              The flat part at the top of the neck. It holds the tuning pegs
              and one end of each string.
            </li>
            <li>
              <strong className="text-foreground">Tuning pegs.</strong> Turn
              one, and the string goes higher or lower. Tuning a guitar is
              simply turning the right peg the right amount.
            </li>
            <li>
              <strong className="text-foreground">Nut.</strong> The small strip
              with grooves between the head and the neck. It spaces the
              strings evenly and sets their height over the first fret.
            </li>
            <li>
              <strong className="text-foreground">Fretboard.</strong> The front
              of the neck, with metal frets. When you press a string behind a
              fret, the string gets shorter and the note changes. This is how
              you play notes and chords.
            </li>
            <li>
              <strong className="text-foreground">Body.</strong> The big part
              that rests against you. Its size, shape and wood have the
              biggest effect on how the guitar sounds.
            </li>
            <li>
              <strong className="text-foreground">Sound hole.</strong> The
              opening in the body of an acoustic guitar. The sound comes out
              here. That is why an acoustic sounds loudest for the person in
              front of it, not for the player.
            </li>
            <li>
              <strong className="text-foreground">Bridge.</strong> Holds the
              other end of the strings on the body. It keeps them at the right
              height and spacing over the fretboard.
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
