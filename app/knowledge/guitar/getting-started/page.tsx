import Link from "next/link";
import type { Metadata } from "next";
import { GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "A five-step path from buying your first guitar to playing your first full song — first chords, first rhythm, first song, in an order that actually works.";

export const metadata: Metadata = {
  title: "How to Learn Guitar: A Beginner's Path to Your First Song — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/getting-started" },
  openGraph: {
    title: "How to Learn Guitar: A Beginner's Path to Your First Song",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/getting-started",
    siteName: "Trenodo",
    type: "article",
  },
};

const STEPS = [
  {
    name: "Get a guitar",
    text: "Borrowing one is fine for a single lesson, but learning needs a guitar you can pick up every day. A cheap, playable acoustic or electric beats an expensive one you only see once a week.",
  },
  {
    name: "Get to know it",
    text: "Learn the parts of the guitar and where your hands go — the fretboard especially, since every chord and note from here on is described in terms of it.",
  },
  {
    name: "Learn your first three chords",
    text: "A, D and G. Between them they unlock hundreds of well-known songs, and they're the standard starting point for a reason: they're forgiving of imperfect finger placement while you build calluses and muscle memory.",
  },
  {
    name: "Learn your first strumming rhythm",
    text: "A steady down-strum on each of the four beats in a bar. It's one of the simplest rhythms on guitar, which is exactly the point — it lets you focus on changing chords cleanly instead of juggling a complicated strumming pattern at the same time.",
  },
  {
    name: "Play your first full song",
    text: "Pick a song built entirely from A, D and G — a quick search for \"easy guitar songs with A D G\" turns up plenty — ideally one you already know the words to, so your attention stays on your hands instead of the lyrics.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Learn Guitar: A Beginner's Path to Your First Song",
      description: PAGE_DESCRIPTION,
      step: STEPS.map((step) => ({
        "@type": "HowToStep",
        name: step.name,
        text: step.text,
      })),
    },
  ],
};

export default function GuitarGettingStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="How to Learn Guitar: A Beginner's Path to Your First Song"
        intro="Five steps, in order. Skipping ahead to barre chords or scales before this is exactly how beginners burn out — this path is deliberately narrow."
      >
        <GuideSection title="1. Get a guitar">
          <p>{STEPS[0].text}</p>
          <p>
            Acoustic or electric is a matter of taste more than difficulty —
            acoustic strings take slightly more finger strength at first, but
            neither is a real barrier. Pick whichever style of music actually
            makes you want to practice.
          </p>
        </GuideSection>

        <GuideSection title="2. Get to know your guitar">
          <p>{STEPS[1].text}</p>
          <p>
            See{" "}
            <Link
              href="/knowledge/guitar/anatomy"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Guitar Anatomy
            </Link>{" "}
            for a full walkthrough of the parts — head, tuning pegs, nut,
            fretboard, body and bridge.
          </p>
        </GuideSection>

        <GuideSection title="3. Learn your first three chords: A, D and G">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">A major</strong> — index,
              middle and ring finger all on the 2nd fret, across the D, G and
              B strings. Leave the low E string out and strum from the A
              string down.
            </li>
            <li>
              <strong className="text-foreground">D major</strong> — index
              finger on the 2nd fret of the G string, middle finger on the
              2nd fret of the high E string, ring finger on the 3rd fret of
              the B string. Strum from the D string down only.
            </li>
            <li>
              <strong className="text-foreground">G major</strong> — middle
              finger on the 3rd fret of the low E string, index finger on the
              2nd fret of the A string, ring finger on the 3rd fret of the
              high E string. Every other string rings open.
            </li>
          </ul>
          <p>
            Practise switching between them slowly, one change at a time,
            before worrying about speed. See{" "}
            <Link
              href="/knowledge/guitar/chords"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Guitar Chords for Beginners
            </Link>{" "}
            for more open chords once these three feel automatic.
          </p>
        </GuideSection>

        <GuideSection title="4. Learn your first rhythm">
          <p>{STEPS[3].text}</p>
          <p>
            Count &ldquo;1, 2, 3, 4&rdquo; out loud and strum down once on every number.
            Once that&rsquo;s steady, practise changing chords exactly on beat 1 —
            that&rsquo;s the habit that turns &ldquo;I know three chords&rdquo; into &ldquo;I can
            play a song.&rdquo;
          </p>
        </GuideSection>

        <GuideSection title="5. Play your first full song">
          <p>{STEPS[4].text}</p>
          <p>
            Expect it to sound rough for the first few days — that&rsquo;s every
            beginner&rsquo;s first song, not a sign you&rsquo;re doing it wrong. The
            first time it plays through cleanly end to end is the real
            milestone, not the first attempt.
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
