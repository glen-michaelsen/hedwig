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
  "Every major and minor piano chord, with a diagram for each — plus what actually makes a chord major or minor, and how to practise changing between them.";

export const metadata: Metadata = {
  title: "Piano Chords for Beginners: All 12 Major and Minor Chords — Trenodo",
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
    a: "The gap between the first two notes. Stack a root, then the note four semitones above it, then the note seven semitones above the root, and you get a major chord. Use three semitones instead of four for that middle note and the same root and top note give you the minor chord instead — one key's difference, and the entire mood of the chord changes.",
  },
  {
    q: "Do I have to play a chord's notes in that exact order?",
    a: "No — that's just the simplest way to first learn each shape. Once a chord is familiar, you can reorder its notes (an inversion) or spread them across two hands; it's still the same chord as long as all three notes are present.",
  },
  {
    q: "Which piano chords should I learn first?",
    a: "C, G, A minor and F. All four use only white keys, they cover a huge share of popular songs between them, and moving between just C and G is enough to start playing simple two-chord songs immediately.",
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
        intro="A chord is at least three notes played together. Not new to the keyboard layout itself? Start with Piano Keyboard Layout — everything below assumes you can already find a given note."
      >
        <GuideSection title="What makes a chord major or minor">
          <p>
            Every chord on this page is a triad — three notes: a root, a
            third, and a fifth (named for how far each sits above the root).
            The only thing that changes between a major and a minor version
            of the same root is the third:
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Major</strong> = root +
              major third (4 semitones up) + perfect fifth (7 semitones up).
              A bright, &ldquo;happy&rdquo; sound.
            </li>
            <li>
              <strong className="text-foreground">Minor</strong> = root +
              minor third (3 semitones up) + perfect fifth (7 semitones up).
              A darker, more melancholic sound.
            </li>
          </ul>
          <p>
            Move that middle note by a single semitone and the entire
            character of the chord flips — everything else about the shape
            stays exactly the same.
          </p>
        </GuideSection>

        <GuideSection title="Major chords">
          <p>
            A major chord is generally described as sounding &ldquo;happy&rdquo; —
            it&rsquo;s the default sound of most pop, folk and children&rsquo;s music.
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
            A minor chord swaps that one middle note for a darker, more
            melancholic sound — the same shape, the same root, just a
            semitone difference in the third.
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

        <GuideSection title="Reading a piano chord diagram">
          <p>
            Each dot marks a key to press, labelled with its note name — a
            piano keyboard has no frets to describe &ldquo;where&rdquo; the way a
            guitar diagram can, so the note name does that job instead. Not
            sure how the white and black keys are laid out yet?{" "}
            <Link
              href="/knowledge/piano/anatomy"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              Piano Keyboard Layout
            </Link>{" "}
            covers that first.
          </p>
        </GuideSection>

        <GuideSection title="How to actually get faster">
          <p>
            Chords are easy to play one at a time — the real skill is
            changing between them smoothly, and that only comes from
            repetition.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Pick two chords and change back and forth between them for five
              minutes a day. Speed comes from doing this often, not from
              doing it once for a long time.
            </li>
            <li>
              Add one new chord at a time to a song, rather than trying to
              learn all of a song&rsquo;s chords at once. &ldquo;Tom Dooley&rdquo; needs only
              two (A and D); &ldquo;Leaving on a Jet Plane&rdquo; adds a third (G) on top
              of those same two.
            </li>
            <li>
              Start well below the song&rsquo;s actual tempo. Playing a change
              cleanly and slowly builds the habit that speed later gets built
              on top of — playing it fast and sloppy just practises the
              mistake.
            </li>
          </ul>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
