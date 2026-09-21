import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What a bassist actually does in a band, and the two habits — steady time and clean technique — worth building before anything else.";

export const metadata: Metadata = {
  title: "How to Start Learning Bass Guitar — Trenodo",
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
    q: "What's the bass actually tuned to?",
    a: "Standard 4-string bass is tuned E-A-D-G, low to high — the same note names as a guitar's four lowest strings, just an octave lower.",
  },
  {
    q: "Is bass easier to learn than guitar?",
    a: "Fewer strings and (usually) simpler individual parts, yes — but the job is harder to do well than it looks. A bassist who doesn't lock in with the drummer makes the whole band feel unsteady, no matter how clean their fingering is.",
  },
  {
    q: "Do I need to learn scales right away?",
    a: "Not on day one, but soon. Once basic technique and timing feel comfortable, scale shapes are what let you build your own bass lines and fills instead of only playing root notes.",
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
        title="What a Bassist Actually Does — And How to Start"
        intro="A standard bass has four strings, tuned E-A-D-G, low to high. That simplicity is deceptive — the bass carries one of the heaviest responsibilities in a band."
      >
        <GuideSection title="The bass's real job">
          <p>
            Every other instrument in a band leans on the bass. It lays the
            rhythmic foundation underneath everything else, usually by
            playing the root note of whatever chord is currently sounding —
            acting as a bridge between the harmony (what the guitar or piano
            is playing) and the rhythm (what the drummer is playing).
          </p>
          <p>
            That second half of the job — locking in with the drummer — is
            what actually makes or breaks a band&rsquo;s groove. A bass line can
            be musically simple and still sound great, but if the bassist and
            drummer aren&rsquo;t rhythmically tight, the whole band feels
            unsteady, however good everyone else&rsquo;s parts are.
          </p>
        </GuideSection>

        <GuideSection title="Two habits worth building early">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Practice with a metronome.</strong>{" "}
              Steady time is the single most valuable skill a bassist has —
              more valuable, early on, than speed or flashy fills.
            </li>
            <li>
              <strong className="text-foreground">Get your technique right from the start.</strong>{" "}
              Bad fretting-hand or picking-hand habits are easy to pick up
              without realizing it, and they&rsquo;re far harder to unlearn later
              than to avoid in the first place — including habits that
              strain the hand over time.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What comes next">
          <p>
            Once basic technique and timing feel comfortable, scale shapes
            are the next real skill — they&rsquo;re what let a bassist move
            beyond just playing root notes into fills and improvised lines
            that still fit the song&rsquo;s key. A good bass part is usually a
            tasteful, restrained one, not the busiest one the instrument is
            capable of.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
