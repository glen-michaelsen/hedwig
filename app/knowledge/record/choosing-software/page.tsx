import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "An overview of the major recording software (DAWs) — Logic, Cubase, Studio One, Pro Tools and more — and how to actually choose between them.";

export const metadata: Metadata = {
  title: "Choosing Recording Software: A Guide to DAWs — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/record/choosing-software" },
  openGraph: {
    title: "Choosing Recording Software: A Guide to DAWs",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/record/choosing-software",
    siteName: "Trenodo",
    type: "article",
  },
};

const DAWS = [
  {
    name: "Logic Pro",
    body: "Mac-only, and widely praised for how intuitively it fits macOS conventions.",
  },
  {
    name: "Cubase",
    body: "From Steinberg, around 30 years in the market, with several price tiers. Mac and Windows.",
  },
  {
    name: "Studio One",
    body: "From PreSonus, newer (about a decade old), praised for being especially user-friendly. Mac and Windows.",
  },
  {
    name: "FL Studio",
    body: "A Belgian DAW known for a distinctive grid-style layout rather than a standard linear timeline. Cross-platform.",
  },
  {
    name: "Pro Tools",
    body: "From Avid, around 30 years old and a long-standing industry standard, competing directly with Cubase. Mac and Windows.",
  },
  {
    name: "GarageBand and Audacity",
    body: "Free options — GarageBand (Mac) and Audacity (cross-platform) are capable for a beginner, though limited for professional work.",
  },
] as const;

const FAQS = [
  {
    q: "Which DAW is “the best”?",
    a: "There isn't one universally correct answer — comfort and familiarity with an interface matter more day-to-day than which software has the most features on paper.",
  },
  {
    q: "How much should I expect to spend?",
    a: "You can start for free. Beyond that, a hobbyist license typically runs roughly 800–1,500 DKK, while a full professional version with bundled plugins is more like 2,000–4,000 DKK.",
  },
  {
    q: "What does a DAW actually look like once I open it?",
    a: "Three main areas: a timeline (time running horizontally, your recorded tracks stacked vertically), a separate mixer window for balancing levels, and a media browser for managing your recordings and sounds.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Choosing Recording Software: A Guide to DAWs",
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

export default function ChoosingSoftwarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Recording"
        categoryHref="/knowledge/record"
        title="Choosing Recording Software: A Guide to DAWs"
        intro="A DAW (digital audio workstation) — sometimes just called a mixing program or sequencer — is the core tool of home recording. Comfort with the interface matters more than which one is technically “best.”"
      >
        <GuideSection title="The major options">
          <div className="space-y-4">
            {DAWS.map((daw) => (
              <div
                key={daw.name}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {daw.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {daw.body}
                </p>
              </div>
            ))}
          </div>
          <p>
            A few other names worth knowing: Ableton Live (built around live
            performance), Bitwig (newer, and Linux-compatible), and REAPER
            (Mac, Windows and Linux).
          </p>
        </GuideSection>

        <GuideSection title="What every DAW has in common">
          <p>
            Regardless of which one you pick, the basic anatomy is the
            same: a timeline running horizontally with your tracks stacked
            vertically, a separate mixer window for balancing levels
            between tracks, and a media library for organizing your
            recordings and sounds.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
