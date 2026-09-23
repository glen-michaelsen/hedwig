import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "An overview of the big recording programs (DAWs) like Logic, Cubase, Studio One and Pro Tools. And how to choose between them.";

export const metadata: Metadata = {
  title: "Choosing Recording Software: A Guide to DAWs | Trenodo",
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
    body: "Only for Mac. Loved for how naturally it fits the way a Mac works.",
  },
  {
    name: "Cubase",
    body: "From Steinberg. Around 30 years on the market, with several price levels. Mac and Windows.",
  },
  {
    name: "Studio One",
    body: "From PreSonus. Newer, about ten years old, and known for being very easy to use. Mac and Windows.",
  },
  {
    name: "FL Studio",
    body: "From Belgium. Known for its grid layout instead of a normal timeline. Mac and Windows.",
  },
  {
    name: "Pro Tools",
    body: "From Avid. Around 30 years old and an industry standard. A direct rival to Cubase. Mac and Windows.",
  },
  {
    name: "GarageBand and Audacity",
    body: "Free options. GarageBand (Mac) and Audacity (all systems) are good for beginners, but limited for pro work.",
  },
] as const;

const FAQS = [
  {
    q: "Which DAW is the best?",
    a: "There is no single answer. Feeling at home in the program matters more in daily work than which one has the most features on paper.",
  },
  {
    q: "How much should I expect to pay?",
    a: "You can start for free. After that, a hobby license usually costs around 800 to 1,500 DKK. A full pro version with plugins is more like 2,000 to 4,000 DKK.",
  },
  {
    q: "What does a DAW look like when I open it?",
    a: "Three main parts. A timeline, with time going from left to right and your tracks stacked on top of each other. A mixer window to balance the levels. And a browser to keep your recordings and sounds in order.",
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
        intro="A DAW (digital audio workstation) is the heart of home recording. Some call it a mixing program or a sequencer. Here is the thing: feeling at home in it matters more than which one is the best. 🎧"
      >
        <GuideSection title="The big options">
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
            A few more names worth knowing: Ableton Live (made for playing
            live), Bitwig (newer, and works on Linux too) and REAPER (Mac,
            Windows and Linux).
          </p>
        </GuideSection>

        <GuideSection title="What every DAW has in common">
          <p>
            No matter which one you choose, the basics are the same. A
            timeline, with time going from left to right and your tracks
            stacked on top of each other. A mixer window, where you balance
            the levels between tracks. And a library, where you keep your
            recordings and sounds in order. Learn one, and you are halfway
            into all the others. 👍
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
