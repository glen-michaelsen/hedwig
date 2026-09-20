import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";

const PAGE_DESCRIPTION =
  "Open chords, barre chords, and how to read a chord diagram — the reference every beginner guitarist keeps coming back to.";

export const metadata: Metadata = {
  title: "Guitar Chords for Beginners: Open Chords, Barre Chords and Diagrams — Trenodo",
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
    a: "Somewhere between 2,000 and 4,000, depending on how you count — twelve root notes, each with major, minor and a long list of extensions (sus2, sus4, 7, maj7, add9 and more). In practice, a working set of a few dozen open and barre chords covers the vast majority of songs.",
  },
  {
    q: "Which chords sound good together?",
    a: "Chords built from notes in the same key naturally complement each other. C major, for example, pairs well with F, G, Dm, Am and Em — all drawn from the key of C. The circle of fifths is the standard tool for working this out for any key.",
  },
  {
    q: "Should I learn open chords or barre chords first?",
    a: "Open chords. They're easier on your fretting hand while you're still building strength and calluses, and mastering a handful of them — A, C, D, E, G and their minors — already opens up thousands of songs.",
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
        intro="A chord is at least three notes played together. This is the reference for the ones you'll use constantly — start with open chords, and only reach for barre chords once those feel automatic."
      >
        <GuideSection title="Open chords — start here">
          <p>
            Open chords (sometimes called Spanish or standard chords) use at
            least one string ringing open, unfretted. They&rsquo;re the easiest
            chords to physically play, and between them cover an enormous
            share of popular music. The essential set:
          </p>
          <ul className="list-disc columns-2 space-y-2 pl-5 sm:columns-3">
            <li>A major, A minor</li>
            <li>C major</li>
            <li>D major, D minor</li>
            <li>E major, E minor</li>
            <li>F major</li>
            <li>G major</li>
          </ul>
          <p>
            New to these three specifically?{" "}
            <Link
              href="/knowledge/guitar/getting-started"
              className={`font-medium text-brand-600 hover:underline dark:text-brand-400 ${focusable} rounded`}
            >
              A, D and G
            </Link>{" "}
            are the standard first three to learn.
          </p>
        </GuideSection>

        <GuideSection title="Barre chords — once open chords feel automatic">
          <p>
            A barre chord takes an open chord shape and moves it up the
            fretboard, using one finger laid flat across multiple strings to
            replace the nut. Moving the same shape up one fret raises the
            chord by a half-tone (a semitone); moving it down lowers it the
            same amount. That&rsquo;s what makes barre chords so useful — one
            shape, moved around, gives you every chord of that type in every
            key. Common starting points: B minor, B major, F# major, F#
            minor, and a barre version of D major.
          </p>
        </GuideSection>

        <GuideSection title="Reading a chord diagram">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Numbers</strong> mark which
              finger goes where: 1 is index, 2 is middle, 3 is ring, 4 is
              pinky, and T is a thumb wrapped over the top for the low E
              string.
            </li>
            <li>
              <strong className="text-foreground">An &ldquo;x&rdquo; above a string</strong>{" "}
              means don&rsquo;t play that string at all for this chord.
            </li>
            <li>
              <strong className="text-foreground">An open circle</strong>{" "}
              means play that string without fretting it.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="How to actually get faster">
          <p>
            Repetition is what makes a chord &ldquo;automatic&rdquo; — the point where
            your fretting hand finds the shape without you consciously
            thinking through finger placement, freeing your attention for
            rhythm and tempo instead. Pick songs with fewer chord changes
            while you&rsquo;re building that automaticity, and start slower than
            feels necessary; speed comes on its own once the shapes stop
            requiring thought.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
