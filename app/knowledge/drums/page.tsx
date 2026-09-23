import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideFaq, GuideSection } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What a drummer actually does, and every part of the drum kit in plain English. Hi-hat, snare, kick, toms and the rest.";

export const metadata: Metadata = {
  title: "Learn Drums: Introduction and Kit Anatomy | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/drums" },
  openGraph: {
    title: "Learn Drums: Introduction and Kit Anatomy",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/drums",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What size is a normal bass drum?",
    a: "22 inches is the most common size. But it depends on the style and on taste. Some styles like a bigger or smaller kick for a different low end.",
  },
  {
    q: "What is the difference between a ride and a crash cymbal?",
    a: "The ride is played again and again to carry the rhythm, often in choruses or in jazz. The crash is for accents, like the start of a new part of the song. Some rides can also work as a crash, depending on the metal and the thickness.",
  },
  {
    q: "Should I teach myself drums, or find a teacher?",
    a: "The basic stick exercises and rhythms work in almost every style. So they are worth learning right from the start. A teacher catches bad habits early. Habits that are easy to pick up without noticing, and that can make drumming harder or even cause injuries over time.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Learn Drums: Introduction and Kit Anatomy",
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

export default function DrumsKnowledgePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            Learn an instrument
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Drums
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} Let&rsquo;s get to the beat of it. 🥁
          </p>

          <div className="mt-14 max-w-3xl space-y-12">
            <GuideSection title="What a drummer actually does">
              <p>
                The drummer sets the basic rhythm that the rest of the band
                plays on. In a way, every other part in the song fits around
                the time the drummer keeps. That is why it pays off to learn
                the instrument properly from day one. Not just to pick up
                habits by chance.
              </p>
              <p>
                Drums look simple. You hit something, and it makes a sound. But
                to play real patterns well, in time, with hands and feet doing
                different things at once? That takes real practice. Three
                skills are at the core:
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-foreground">A sense of time.</strong>{" "}
                  To play steady. Not just fast.
                </li>
                <li>
                  <strong className="text-foreground">Stick technique.</strong>{" "}
                  How your hands hit the drum. Clean and without wasted energy.
                </li>
                <li>
                  <strong className="text-foreground">Coordination.</strong>{" "}
                  Getting all four limbs to do different things at the same
                  time, without one of them tripping up the others.
                </li>
              </ul>
              <p>
                The usual path is to learn basic stick exercises and a few
                basic rhythms first. They work in almost every style. Then you
                move on to the style you really want to play. Bad habits sneak
                in easily when you teach yourself, and they can be hard to get
                rid of. Some can even lead to injuries over time. So drums is
                one of the instruments where a teacher is really worth it.
              </p>
            </GuideSection>

            <GuideSection title="The parts of a drum kit">
              <p>
                A drum kit can be set up in many ways. The exact mix of drums
                and cymbals depends on the style and on the drummer. But every
                kit is built from the same few parts.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-foreground">Hi-hat.</strong> Often
                  called the most important cymbal in the kit. Two cymbals you
                  open and close with a foot pedal. Closed, it gives a short
                  &ldquo;tick.&rdquo; Open, it rings longer and higher. The normal size is
                  14 inches.
                </li>
                <li>
                  <strong className="text-foreground">Ride cymbal.</strong> An
                  alternative to the hi-hat for carrying the rhythm, often in
                  choruses and in jazz. The normal size is 20 inches. Some rides
                  can also work as a crash, depending on the metal and the
                  thickness.
                </li>
                <li>
                  <strong className="text-foreground">Crash cymbal.</strong> For
                  accents and changes, like the first hit of a chorus. It is
                  higher than the ride. The size depends on style and taste.
                </li>
                <li>
                  <strong className="text-foreground">China cymbal.</strong> A
                  similar job as the crash, but with a trashier sound. Very
                  popular in rock.
                </li>
                <li>
                  <strong className="text-foreground">Snare drum.</strong>{" "}
                  Together with the kick and the hi-hat, it forms the core of
                  the rhythm. Wires under the drum give the snare its famous
                  &ldquo;crack.&rdquo;
                </li>
                <li>
                  <strong className="text-foreground">Bass drum (kick).</strong>{" "}
                  Often called the heart of the kit. The biggest drum, played
                  with a foot pedal. 22 inches is the most common size, but it
                  depends on the style. ❤️
                </li>
                <li>
                  <strong className="text-foreground">Toms.</strong> Used for
                  fills between the main groove. Rock drummers often like big,
                  deep toms. Jazz drummers often like smaller, higher ones.
                </li>
                <li>
                  <strong className="text-foreground">Hardware.</strong> The
                  stands and pedals that hold it all together: cymbal stands,
                  the hi-hat stand and pedal, a snare stand and the bass drum
                  pedal.
                </li>
              </ul>
            </GuideSection>

            <GuideFaq items={FAQS} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
