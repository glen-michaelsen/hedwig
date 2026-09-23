import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "How to change guitar strings, step by step. Plus the small differences between acoustic, classical and electric guitars.";

export const metadata: Metadata = {
  title: "How to Change Guitar Strings: A Step by Step Guide | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/changing-strings" },
  openGraph: {
    title: "How to Change Guitar Strings: A Step by Step Guide",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/changing-strings",
    siteName: "Trenodo",
    type: "article",
  },
};

const STEPS = [
  {
    name: "Loosen and remove the old string",
    text: "Turn the tuning peg until the string is slack. Unwind it, and pull it out at the bridge.",
  },
  {
    name: "Clean the fretboard while you can",
    text: "With the strings off, it is the perfect time to wipe the fretboard. If it looks dry, give it a little fretboard oil. You won't get this chance again until next time.",
  },
  {
    name: "Attach the new string at the bridge",
    text: "This depends on your guitar. An acoustic (western) guitar has a bridge pin that holds the ball end of the string. A classical guitar has no ball end, so you tie the string around the bridge with a knot. On an electric guitar, the string usually goes straight through the body or a tailpiece.",
  },
  {
    name: "Thread it through the tuning peg and wind",
    text: "Pull the string through the hole in the peg. Leave a little slack for a few turns around the peg. Then start winding. Neat and even winding helps the string stay in tune.",
  },
  {
    name: "Cut the extra string",
    text: "Cut the leftover string close to the peg with wire cutters. Then nothing sticks out to scratch your hand or your gig bag.",
  },
  {
    name: "Repeat, stretch and tune again",
    text: "Do the same with the other strings. New strings go out of tune fast in the beginning. So tune up, gently stretch each string with your hand, and tune again. Repeat a few times until they stay in tune.",
  },
] as const;

const FAQS = [
  {
    q: "What do I need to change guitar strings?",
    a: "A new set of strings for your type of guitar, wire cutters for the extra string, and a clean table with a cloth on it, so the body doesn't get scratched. Guitar polish and fretboard oil are nice extras.",
  },
  {
    q: "How often should I change guitar strings?",
    a: "About every 3 months if you play often. Or sooner, if they sound dull, feel rough or change color. A string that is about to break usually looks more worn than the rest.",
  },
  {
    q: "Do acoustic, classical and electric guitars use different strings?",
    a: "Yes, and you can't swap them. Acoustic (western) guitars use steel strings. Classical guitars use nylon strings. Electric guitars use their own steel strings, made to work with the pickups.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Change Guitar Strings: A Step by Step Guide",
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
        title="How to Change Guitar Strings: A Step by Step Guide"
        intro="New strings bring your guitar's sound back to life almost at once. The steps are more or less the same on every guitar. Only the bridge is different. Let's string you along. 🎸"
      >
        <GuideSection title="What you need">
          <ul className="list-disc space-y-2 pl-5">
            <li>A clean, flat surface with a cloth on it</li>
            <li>The right set of strings for your guitar</li>
            <li>Wire cutters</li>
            <li>Guitar polish and a soft cloth (optional)</li>
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

        <GuideSection title="Where guitars are different">
          <p>
            The tuning pegs work more or less the same on acoustic and
            electric guitars. Classical guitars often have another type of
            peg. The big difference is at the bridge. Western (acoustic)
            guitars hold the strings with bridge pins. On a classical guitar,
            you tie the string around the bridge with a knot. And on an
            electric guitar, the string usually goes straight through the
            body or a separate tailpiece.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
