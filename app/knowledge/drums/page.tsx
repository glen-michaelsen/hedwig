import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideFaq, GuideSection } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "What a drummer actually does, and every part of a drum kit — hi-hat, snare, kick, toms and the rest — explained in plain English.";

export const metadata: Metadata = {
  title: "Learn Drums: Introduction and Kit Anatomy — Trenodo Knowledge",
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
    q: "What size is a standard bass drum?",
    a: "22 inches is the most common size, though it varies by genre and personal preference — some genres favor larger or smaller kick drums for a different low-end character.",
  },
  {
    q: "What's the difference between a ride and a crash cymbal?",
    a: "A ride is usually played continuously to carry the rhythm — especially in choruses or jazz — while a crash is used for accents, like marking a section change. A ride can sometimes double as a crash depending on its alloy and thickness.",
  },
  {
    q: "Should I teach myself drums, or find a teacher?",
    a: "Basic sticking and fundamental rhythms transfer across almost every genre, which makes them worth learning properly from the start. A real teacher catches bad habits early — ones that are otherwise easy to pick up unnoticed and can make drumming harder than it needs to be, or even lead to injury over time.",
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
            {PAGE_DESCRIPTION}
          </p>

          <div className="mt-14 max-w-3xl space-y-12">
            <GuideSection title="What a drummer actually does">
              <p>
                The drummer sets the fundamental rhythm the rest of the band
                plays against — every other part in a song, in some sense,
                fits around the timekeeping the drummer establishes. That
                foundational role is exactly why it&rsquo;s worth understanding
                the instrument properly from day one, rather than picking up
                habits at random.
              </p>
              <p>
                Drums look deceptively simple — hit something, it makes a
                sound — but playing real patterns well, in time, with both
                hands and feet doing different things at once, takes genuine
                practice. Three skills sit at the core of it:
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-foreground">A sense of time</strong>{" "}
                  — playing steadily, not just fast.
                </li>
                <li>
                  <strong className="text-foreground">Stick technique</strong>{" "}
                  — how the hands actually strike the drum, cleanly and
                  efficiently.
                </li>
                <li>
                  <strong className="text-foreground">Coordination</strong> —
                  getting all four limbs to do different things
                  simultaneously without one throwing off the others.
                </li>
              </ul>
              <p>
                The usual path is to master basic sticking exercises and a
                handful of fundamental rhythms first — these transfer across
                almost every genre — before specializing into whatever style
                you actually want to play. Because self-taught habits are
                easy to pick up without noticing, and can be genuinely hard
                to undo (or even lead to strain injuries over time), this is
                one of the instruments where a real teacher earns its cost
                back quickly.
              </p>
            </GuideSection>

            <GuideSection title="Drum kit anatomy">
              <p>
                A kit is highly customizable — the exact combination of
                drums and cymbals varies a lot by genre and by the
                individual drummer&rsquo;s taste — but every kit is built from
                the same handful of components.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-foreground">Hi-hat</strong> —
                  often called the most important cymbal in the kit: two
                  cymbals worked by a foot pedal, giving a short &ldquo;click&rdquo;
                  closed or a longer, higher-pitched sound open. A standard
                  size is 14 inches.
                </li>
                <li>
                  <strong className="text-foreground">Ride cymbal</strong> —
                  an alternative to the hi-hat for carrying the rhythm,
                  especially through choruses and in jazz. Standard size is
                  20 inches; depending on its alloy and thickness, it can
                  sometimes double as a crash.
                </li>
                <li>
                  <strong className="text-foreground">Crash cymbal</strong> —
                  used for accents and transitions, like hitting the start
                  of a chorus. Higher-pitched than the ride; size varies by
                  genre and preference.
                </li>
                <li>
                  <strong className="text-foreground">China cymbal</strong> —
                  fills a similar role to a crash, but with a distinct,
                  trashier tone. Especially associated with rock.
                </li>
                <li>
                  <strong className="text-foreground">Snare drum</strong> —
                  works with the kick and hi-hat as the core rhythmic trio.
                  Wires stretched underneath the drumhead give the snare its
                  characteristic &ldquo;crack.&rdquo;
                </li>
                <li>
                  <strong className="text-foreground">Bass drum (kick)</strong>{" "}
                  — sometimes called the heart of the kit: the largest drum,
                  played with a foot pedal. 22 inches is the most common
                  size, though it varies by genre.
                </li>
                <li>
                  <strong className="text-foreground">Tom-toms</strong> —
                  used for fills between the main groove. Rock drummers
                  often favor bigger, deeper toms; jazz drummers often favor
                  smaller, higher-pitched ones.
                </li>
                <li>
                  <strong className="text-foreground">Hardware</strong> —
                  the stands and pedals holding everything together: cymbal
                  stands, the hi-hat stand and pedal, a snare stand, and the
                  bass drum pedal.
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
