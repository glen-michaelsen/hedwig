import Link from "next/link";
import type { Metadata } from "next";
import { GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Five steps from buying your first guitar to playing your first full song. First chords, first rhythm, first song. In an order that works.";

export const metadata: Metadata = {
  title: "How to Learn Guitar: From Zero to Your First Song | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/getting-started" },
  openGraph: {
    title: "How to Learn Guitar: From Zero to Your First Song",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/getting-started",
    siteName: "Trenodo",
    type: "article",
  },
};

const STEPS = [
  {
    name: "Get a guitar",
    text: "You can borrow a guitar for one lesson. But to learn, you need one you can pick up every day. A cheap guitar that plays well is better than an expensive one you only see once a week.",
  },
  {
    name: "Get to know it",
    text: "Learn the parts of the guitar, and where your hands go. The fretboard is the most important part, because every chord and note from now on is explained with it.",
  },
  {
    name: "Learn your first three chords",
    text: "A, D and G. With these three you can play hundreds of well known songs. They are the classic starting point for a reason: they are forgiving while your fingers get stronger.",
  },
  {
    name: "Learn your first strumming rhythm",
    text: "One strum down on each of the four beats in a bar. It is one of the simplest rhythms on guitar, and that is the point. You can focus on changing chords, and not on a tricky pattern at the same time.",
  },
  {
    name: "Play your first full song",
    text: "Pick a song that only uses A, D and G. Search for \"easy guitar songs with A D G\" and you will find many. Choose one you already know the words to. Then your focus stays on your hands.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to Learn Guitar: From Zero to Your First Song",
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
        title="How to Learn Guitar: From Zero to Your First Song"
        intro="Five steps, in the right order. Many beginners jump to barre chords or scales too early, and then they give up. This path is narrow on purpose."
      >
        <GuideSection title="1. Get a guitar">
          <p>{STEPS[0].text}</p>
          <p>
            Acoustic or electric? It is more about taste than difficulty.
            Acoustic strings need a bit more finger strength in the beginning,
            but neither one is hard to start on. Choose the one that fits the
            music you love. That is the one you will want to practice on. 🎸
          </p>
        </GuideSection>

        <GuideSection title="2. Get to know your guitar">
          <p>{STEPS[1].text}</p>
          <p>
            Our guide to{" "}
            <Link
              href="/knowledge/guitar/anatomy"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Guitar Anatomy
            </Link>{" "}
            walks you through all the parts: head, tuning pegs, nut,
            fretboard, body and bridge.
          </p>
        </GuideSection>

        <GuideSection title="3. Learn your first three chords: A, D and G">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">A major.</strong> Index,
              middle and ring finger on the 2nd fret, on the D, G and B
              strings. Skip the low E string, and strum from the A string
              down.
            </li>
            <li>
              <strong className="text-foreground">D major.</strong> Index
              finger on the 2nd fret of the G string. Middle finger on the
              2nd fret of the high E string. Ring finger on the 3rd fret of
              the B string. Strum from the D string down.
            </li>
            <li>
              <strong className="text-foreground">G major.</strong> Middle
              finger on the 3rd fret of the low E string. Index finger on the
              2nd fret of the A string. Ring finger on the 3rd fret of the
              high E string. All other strings ring open.
            </li>
          </ul>
          <p>
            Practice changing between them slowly. One change at a time.
            Speed comes later. When these three feel easy, find more open
            chords in{" "}
            <Link
              href="/knowledge/guitar/chords"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Guitar Chords for Beginners
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection title="4. Learn your first rhythm">
          <p>{STEPS[3].text}</p>
          <p>
            Count &ldquo;1, 2, 3, 4&rdquo; out loud, and strum down once on every
            number. When that feels steady, practice changing chord exactly on
            beat 1. This habit is what turns &ldquo;I know three chords&rdquo; into
            &ldquo;I can play a song.&rdquo;
          </p>
        </GuideSection>

        <GuideSection title="5. Play your first full song">
          <p>{STEPS[4].text}</p>
          <p>
            It will sound a bit rough the first few days. That is normal. It
            happens to every beginner, and it does not mean you do it wrong.
            The real milestone is the first time you play the whole song
            without stopping. Enjoy that moment. 🙂
          </p>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
