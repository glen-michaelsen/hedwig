import Link from "next/link";
import type { Metadata } from "next";
import { ChordFigure } from "../../_components/chord-figure";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ZoomableImage } from "../../_components/zoomable-image";
import { focusable } from "@/app/_components/ui";
import { BARRE_CHORDS, OPEN_CHORDS } from "@/lib/chord-diagrams/guitar-chords";

const PAGE_DESCRIPTION =
  "Open chords, barre chords and how to read a chord diagram. The chord guide every beginner comes back to.";

export const metadata: Metadata = {
  title: "Guitar Chords for Beginners: Open Chords, Barre Chords and Diagrams | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/guitar/chords" },
  openGraph: {
    title: "Guitar Chords for Beginners",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/guitar/chords",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "How many guitar chords are there?",
    a: "Somewhere between 2,000 and 4,000, depending on how you count. There are twelve root notes, and each one has major, minor and a long list of variations like sus2, sus4, 7, maj7 and add9. In practice, a few dozen open and barre chords cover most songs.",
  },
  {
    q: "Which chords sound good together?",
    a: "Chords from the same key sound good together. C major, for example, works well with F, G, Dm, Am and Em. They all come from the key of C. The circle of fifths is the classic tool to find these for any key.",
  },
  {
    q: "Should I learn open chords or barre chords first?",
    a: "Open chords. They are easier on your fingers while you build strength. Learn a handful of them, like A, C, D, E, G and their minor versions, and you can already play thousands of songs.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Guitar Chords for Beginners: Open Chords, Barre Chords and Diagrams",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: [...OPEN_CHORDS, ...BARRE_CHORDS].map(
        (chord) =>
          `https://trenodo.com/images/knowledge/guitar/chords/${chord.slug}.svg`,
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

export default function GuitarChordsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar"
        categoryHref="/knowledge/guitar"
        title="Guitar Chords for Beginners"
        intro="A chord is three or more notes played at the same time. Here are the chords you will use again and again. Start with the open chords. Save the barre chords for when the open ones feel easy."
      >
        <GuideSection title="Open chords: start here">
          <p>
            Open chords use at least one string that rings open, without a
            finger on it. They are the easiest chords to play. And together
            they cover a huge part of all popular music. Let&rsquo;s strike a
            chord. 🎸
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {OPEN_CHORDS.map((chord) => (
              <ChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
          <p>
            Brand new to chords?{" "}
            <Link
              href="/knowledge/guitar/getting-started"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              A, D and G
            </Link>{" "}
            are the classic first three to learn.
          </p>
        </GuideSection>

        <GuideSection title="Barre chords: when open chords feel easy">
          <p>
            A barre chord takes an open chord shape and moves it up the neck.
            One finger lies flat across several strings, and does the job of
            the nut. Move the shape one fret up, and the chord goes up a half
            step. Move it one fret down, and it goes down a half step. This is
            the magic of barre chords. One shape gives you the same chord
            type in every key.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {BARRE_CHORDS.map((chord) => (
              <ChordFigure
                key={chord.slug}
                slug={chord.slug}
                name={chord.name}
                shortName={chord.shortName}
              />
            ))}
          </div>
        </GuideSection>

        <GuideSection title="How to read a chord diagram">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <ul className="list-disc space-y-3 pl-5 sm:flex-1">
              <li>
                <strong className="text-foreground">Numbers</strong> tell you
                which finger goes where. 1 is the index finger, 2 the middle,
                3 the ring finger and 4 the pinky.
              </li>
              <li>
                <strong className="text-foreground">An &ldquo;x&rdquo; above a string</strong>{" "}
                means you don&rsquo;t play that string.
              </li>
              <li>
                <strong className="text-foreground">An open circle</strong>{" "}
                means you play the string open, with no finger on it.
              </li>
              <li>
                <strong className="text-foreground">A rounded bar</strong>{" "}
                across several strings is a barre. One finger lies flat and
                presses all of them at once.
              </li>
            </ul>
            <ZoomableImage
              src="/images/knowledge/guitar/finger-numbers.svg"
              alt="Fretting-hand finger numbers: 1 index, 2 middle, 3 ring, 4 pinky, T thumb"
              width={240}
              height={260}
              title="Fretting-hand finger numbers"
              className="mx-auto w-full max-w-40 sm:mx-0 sm:w-40 sm:shrink-0"
            />
          </div>
        </GuideSection>

        <GuideSection title="How to get faster">
          <p>
            Repetition is the secret. At some point your hand finds the chord
            on its own, without thinking. Then your head is free to focus on
            rhythm and tempo. While you get there, choose songs with few chord
            changes. And play slower than you think you need to. The speed
            comes by itself when the shapes sit in your fingers. 💡
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
