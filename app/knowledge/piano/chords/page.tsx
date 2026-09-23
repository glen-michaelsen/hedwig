import Link from "next/link";
import type { Metadata } from "next";
import { PianoChordFigure } from "../../_components/piano-chord-figure";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";
import {
  PIANO_MAJOR_CHORDS,
  PIANO_MINOR_CHORDS,
} from "@/lib/piano-diagrams/piano-chords";

const PAGE_DESCRIPTION =
  "Every major and minor piano chord, each with a diagram. Plus what makes a chord major or minor, and how to practice the changes.";

export const metadata: Metadata = {
  title: "Piano Chords for Beginners: All 12 Major and Minor Chords | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/piano/chords" },
  openGraph: {
    title: "Piano Chords for Beginners: All 12 Major and Minor Chords",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/piano/chords",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "What makes a chord major or minor?",
    a: "The distance between the first two notes. Start with a root. Add the note four half steps above it. Then add the note seven half steps above the root. That is a major chord. Use three half steps for the middle note instead of four, and you have the minor chord. One key of difference, and the whole mood changes.",
  },
  {
    q: "Do I have to play the notes in that exact order?",
    a: "No. It is just the easiest way to learn each chord. When a chord feels familiar, you can change the order of the notes (this is called an inversion), or split them between two hands. It is still the same chord, as long as all three notes are there.",
  },
  {
    q: "Which piano chords should I learn first?",
    a: "C, G, A minor and F. They only use white keys, and together they cover a huge number of popular songs. With just C and G, you can already play simple songs with two chords.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Piano Chords for Beginners: All 12 Major and Minor Chords",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: [...PIANO_MAJOR_CHORDS, ...PIANO_MINOR_CHORDS].map(
        (chord) =>
          `https://trenodo.com/images/knowledge/piano/chords/${chord.slug}.svg`,
      ),
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

export default function PianoChordsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Piano"
        categoryHref="/knowledge/piano"
        title="Piano Chords for Beginners: All 12 Major and Minor Chords"
        intro="A chord is three or more notes played at the same time. This page assumes you can already find a note on the keyboard. If not, start with Piano Keyboard Layout first. 🎹"
      >
        <GuideSection title="What makes a chord major or minor">
          <p>
            Every chord on this page is a triad. That means three notes: a
            root, a third and a fifth. The names tell you how far above the
            root each note sits. Between the major and the minor version of a
            chord, only the third changes:
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Major</strong> = root +
              major third (4 half steps up) + fifth (7 half steps up). A
              bright, &ldquo;happy&rdquo; sound.
            </li>
            <li>
              <strong className="text-foreground">Minor</strong> = root +
              minor third (3 half steps up) + fifth (7 half steps up). A
              darker, more melancholic sound.
            </li>
          </ul>
          <p>
            Move the middle note just one half step, and the whole feeling of
            the chord flips. Everything else stays the same. Small change, big
            difference.
          </p>
        </GuideSection>

        <GuideSection title="Major chords">
          <p>
            Most people describe a major chord as &ldquo;happy.&rdquo; It is the
            classic sound of pop, folk and children&rsquo;s songs. ☀️
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PIANO_MAJOR_CHORDS.map((chord) => (
              <PianoChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
        </GuideSection>

        <GuideSection title="Minor chords">
          <p>
            A minor chord changes that one middle note, and the sound gets
            darker and more melancholic. Same root, same shape. Only one half
            step of difference in the third.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PIANO_MINOR_CHORDS.map((chord) => (
              <PianoChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
        </GuideSection>

        <GuideSection title="How to read a piano chord diagram">
          <p>
            Each dot shows a key to press, with the name of the note on it. A
            keyboard has no frets like a guitar, so the note name shows you
            where to go. Not sure how the white and black keys work yet? Read{" "}
            <Link
              href="/knowledge/piano/anatomy"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Piano Keyboard Layout
            </Link>{" "}
            first.
          </p>
        </GuideSection>

        <GuideSection title="How to get faster">
          <p>
            One chord at a time is easy. The real skill is to change between
            chords smoothly. And that only comes with repetition.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Pick two chords, and change back and forth between them for five
              minutes every day. Doing it often beats doing it for a long time
              once in a while.
            </li>
            <li>
              Add one new chord at a time to a song. Don&rsquo;t try to learn all
              the chords at once. &ldquo;Tom Dooley&rdquo; only needs two (A and D).
              &ldquo;Leaving on a Jet Plane&rdquo; adds a third one (G) to the same two.
            </li>
            <li>
              Start much slower than the song. A slow and clean change builds
              the habit that speed grows from later. Fast and sloppy only
              trains the mistake. 🐢
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
