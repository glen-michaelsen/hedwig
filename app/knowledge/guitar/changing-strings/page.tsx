import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "A step-by-step guide to changing guitar strings, with the differences between acoustic, classical and electric guitars along the way.";

export const metadata: Metadata = {
  title: "How to Change Guitar Strings: A Step-by-Step Guide — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/changing-strings" },
  openGraph: {
    title: "How to Change Guitar Strings: A Step-by-Step Guide",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/changing-strings",
    siteName: "Trenodo",
    type: "article",
  },
};

const STEPS = [
  {
    name: "Loosen and remove the old string",
    text: "Turn the tuning peg until the string goes slack, then unwind it and pull it free from the bridge end.",
  },
  {
    name: "Clean the fretboard while it's exposed",
    text: "A restrung guitar is the easiest time to wipe down the fretboard and apply fretboard oil if it's looking dry — you won't get this access again until the next string change.",
  },
  {
    name: "Attach the new string at the bridge",
    text: "How this works depends on the guitar: an acoustic (western) guitar uses a bridge pin that clamps the string's ball end in place; a classical guitar has no ball end to speak of and instead needs the string tied off with a proper knot around the bridge; an electric guitar's string usually just threads straight through the body or a tailpiece.",
  },
  {
    name: "Thread it through the tuning peg and wind",
    text: "Pull the string through the peg's hole, leave a little slack for a couple of turns of wrap, then start winding. Consistent, neat winding helps the string hold its tuning.",
  },
  {
    name: "Cut the excess",
    text: "Trim the leftover string close to the peg with wire cutters, so nothing's left sticking out to snag a hand or a gig bag.",
  },
  {
    name: "Repeat, then stretch and retune",
    text: "Do the same for each remaining string. New strings go out of tune quickly at first, so tune up, gently stretch each string by hand, and retune — repeat a few times until they hold steady.",
  },
] as const;

const FAQS = [
  {
    q: "What do I need to change guitar strings?",
    a: "A new set of strings for your guitar type, wire cutters to trim the excess, and a clear surface with a cloth underneath to avoid scratching the body. A guitar polish and fretboard oil are optional extras worth having while the fretboard is exposed.",
  },
  {
    q: "How often should I change guitar strings?",
    a: "Roughly every 3 months for a guitar played regularly, or sooner if they sound dull, feel rough under your fingers, or visibly discolour. A string that's about to break is usually obviously more worn than the others.",
  },
  {
    q: "Do acoustic, classical and electric guitars use different strings?",
    a: "Yes — they're not interchangeable. Acoustic (western) guitars use steel strings, classical guitars use nylon strings, and electric guitars use their own steel strings designed to work with magnetic pickups.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Change Guitar Strings: A Step-by-Step Guide",
      description: PAGE_DESCRIPTION,
      step: STEPS.map((step) => ({
        "@type": "HowToStep",
        name: step.name,
        text: step.text,
      })),
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

export default function GuitarChangingStringsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="How to Change Guitar Strings: A Step-by-Step Guide"
        intro="Fresh strings bring back a guitar's tone almost instantly. The process is the same in spirit across guitar types — only the bridge attachment really differs."
      >
        <GuideSection title="What you'll need">
          <ul className="list-disc space-y-2 pl-5">
            <li>A clear, flat surface with a cloth underneath</li>
            <li>The right string set for your guitar</li>
            <li>Wire cutters</li>
            <li>Guitar polish and a microfibre cloth (optional)</li>
            <li>Fretboard oil (optional, good for a dry fretboard)</li>
          </ul>
        </GuideSection>

        <GuideSection title="The steps">
          <ol className="list-decimal space-y-4 pl-5">
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong className="text-foreground">{step.name}.</strong>{" "}
                {step.text}
              </li>
            ))}
          </ol>
        </GuideSection>

        <GuideSection title="Where guitar types differ">
          <p>
            The headstock mechanism is broadly similar across acoustic and
            electric guitars, but classical guitars often use a different
            style of tuning peg. The bigger difference is at the bridge:
            western (acoustic) guitars hold strings in with bridge pins,
            classical guitars need the string tied around the bridge with a
            knot, and electric guitars typically pass the string straight
            through the body or a separate tailpiece.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
