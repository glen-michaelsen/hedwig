import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Every part of a bass guitar in plain English. Head, neck, pickups and body, and what each part actually does.";

export const metadata: Metadata = {
  title: "Bass Guitar Anatomy: The Parts of a Bass Explained | Trenodo",
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
    q: "Why does a bass have one or two pickups?",
    a: "Each pickup hears the string at a different spot, and each spot gives a different tone. With two pickups you can blend them. That gives you more sounds than one fixed pickup.",
  },
  {
    q: "What does the bridge adjust?",
    a: "Mainly how high the strings sit over the fretboard (the action). On most basses it also sets the exact length of each string (the intonation). Both affect how easy the bass is to play, and how well it stays in tune up the neck.",
  },
  {
    q: "Do all basses have four strings?",
    a: "Four strings (E, A, D, G) is the normal setup. But there are also basses with five and six strings. They add a lower B string and sometimes a higher C string.",
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
        intro="A bass looks like a stretched guitar. But a few of the parts do a slightly different job. Here is what each part is for."
      >
        <GuideSection title="The main parts">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Head and tuners.</strong> The
              end of the neck, with the tuning machines. Turn a tuner, and the
              string goes higher or lower.
            </li>
            <li>
              <strong className="text-foreground">Nut.</strong> Where the head
              meets the neck. It keeps the strings evenly spaced, and at the
              right height over the first fret.
            </li>
            <li>
              <strong className="text-foreground">Neck and fretboard.</strong>{" "}
              It has frets, just like a guitar. The dots on the fretboard help
              you find your place, without looking at the head.
            </li>
            <li>
              <strong className="text-foreground">Pickguard.</strong> A plate
              that protects the body from scratches, from a pick or from slap
              playing.
            </li>
            <li>
              <strong className="text-foreground">Pickups.</strong> Magnets
              (one or two) that turn the vibration of the strings into a
              signal. The type and placement of the pickups shape a big part of
              the tone.
            </li>
            <li>
              <strong className="text-foreground">Controls.</strong> Knobs for
              volume and tone. With two pickups, you can often blend between
              them too.
            </li>
            <li>
              <strong className="text-foreground">Body.</strong> Vibrates with
              the strings. Together with the pickups, it shapes the sound of
              the bass.
            </li>
            <li>
              <strong className="text-foreground">Bridge.</strong> Holds the
              strings at the body end. It sets the height of the strings, and
              on most basses also the exact length of each string.
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
