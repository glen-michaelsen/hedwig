import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What a bass player really does in a band. And the two habits to build before anything else: steady time and clean technique.";

export const metadata: Metadata = {
  title: "How to Start Learning Bass Guitar | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/bass/getting-started" },
  openGraph: {
    title: "How to Start Learning Bass Guitar",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/bass/getting-started",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "How is a bass tuned?",
    a: "A normal 4 string bass is tuned E, A, D, G, from low to high. Those are the same notes as the four lowest strings on a guitar, just one octave lower.",
  },
  {
    q: "Is bass easier to learn than guitar?",
    a: "It has fewer strings, and the parts are often simpler. So yes, in a way. But doing the job well is harder than it looks. If the bass player is not tight with the drummer, the whole band feels unsteady. Clean fingers don't help much then.",
  },
  {
    q: "Do I need to learn scales right away?",
    a: "Not on day one. But soon. When your technique and timing feel okay, scales are what let you make your own bass lines and fills. Not only root notes.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Start Learning Bass Guitar",
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

export default function BassGettingStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Bass"
        categoryHref="/knowledge/bass"
        title="What a Bass Player Actually Does, and How to Start"
        intro="A normal bass has four strings, tuned E, A, D, G from low to high. It looks simple. But the bass carries one of the most important jobs in the band."
      >
        <GuideSection title="The real job of the bass">
          <p>
            Everybody else in the band leans on the bass. It lays the
            foundation under the music. Most of the time, the bass plays the
            root note of the chord you hear. That makes it the bridge between
            the harmony (the guitar or piano) and the rhythm (the drums).
          </p>
          <p>
            The second part of the job is the most important one: lock in
            with the drummer. A bass line can be very simple and still sound
            great. But if bass and drums are not tight, the whole band feels
            shaky. No matter how good the other parts are. 🥁
          </p>
        </GuideSection>

        <GuideSection title="Two habits to build early">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Practice with a metronome.</strong>{" "}
              Steady time is the most valuable skill a bass player has. In the
              beginning it matters more than speed and fancy fills.
            </li>
            <li>
              <strong className="text-foreground">Get your technique right from the start.</strong>{" "}
              Bad habits in your hands sneak in without you noticing. And they
              are much harder to unlearn than to avoid. Some of them can even
              hurt your hands over time.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What comes next">
          <p>
            When your technique and timing feel okay, it is time for scales.
            Scales let you go beyond the root notes. You can play fills and
            your own lines that still fit the key of the song. And remember: a
            good bass part is often a simple one. Less is more. 🙂
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
