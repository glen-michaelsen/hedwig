import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The full chromatic scale, what sharps and flats actually mean, and why two notes on it don't have a second name.";

export const metadata: Metadata = {
  title: "Music Notes and Scales Explained: Sharps, Flats and the Chromatic Scale — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory/scales-and-notes" },
  openGraph: {
    title: "Music Notes and Scales Explained: Sharps, Flats and the Chromatic Scale",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory/scales-and-notes",
    siteName: "Trenodo",
    type: "article",
  },
};

const CHROMATIC_SCALE = [
  "C",
  "C♯ / D♭",
  "D",
  "D♯ / E♭",
  "E",
  "F",
  "F♯ / G♭",
  "G",
  "G♯ / A♭",
  "A",
  "A♯ / B♭",
  "B",
];

const FAQS = [
  {
    q: "Is C♯ the same note as D♭?",
    a: "Yes, on any standard instrument they're the exact same pitch — the same physical key or fret. Which name gets used depends on the musical context (the key you're in), not on the sound itself.",
  },
  {
    q: "Why don't E♯ and B♯ exist?",
    a: "The chromatic scale's half-step gaps already sit naturally between E and F, and between B and C — there's no room for a sharp in between, since a sharp always means “the very next half-step up.”",
  },
  {
    q: "Why do some people call the note B “H”?",
    a: "In some Northern and Central European musical traditions, B is named H instead — the result of a historical transcription error as music notation moved across Europe centuries ago. Both refer to the same note.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Music Notes and Scales Explained: Sharps, Flats and the Chromatic Scale",
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

export default function ScalesAndNotesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Music Theory"
        categoryHref="/knowledge/theory"
        title="Music Notes and Scales Explained: Sharps, Flats and the Chromatic Scale"
        intro="A chromatic scale is simply every note available on an instrument, laid out in pitch order — the full alphabet everything else in music theory is built from."
      >
        <GuideSection title="The chromatic scale">
          <p>
            Starting from C and moving up in the smallest possible steps
            (half-steps), the twelve notes are:
          </p>
          <div className="flex flex-wrap gap-2">
            {CHROMATIC_SCALE.map((note) => (
              <span
                key={note}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {note}
              </span>
            ))}
          </div>
          <p>
            After B, the pattern repeats back at C, one octave higher.
          </p>
        </GuideSection>

        <GuideSection title="Sharps and flats">
          <p>
            A sharp (♯) raises a note by one half-step; a flat (♭)
            lowers it by one half-step. That&rsquo;s why C♯ and D♭ are the same
            physical note — C♯ is &ldquo;C, raised a half-step,&rdquo; and D♭ is &ldquo;D,
            lowered a half-step,&rdquo; and both land on the exact same pitch.
            Which name gets used depends on the key of the music you&rsquo;re
            reading or writing, not on the sound itself.
          </p>
        </GuideSection>

        <GuideSection title="Why two notes don't get a sharp">
          <p>
            Notice E and F have no note between them on the chromatic scale
            above, and neither do B and C. That&rsquo;s not an inconsistency —
            those two pairs are naturally only a half-step apart already, so
            there&rsquo;s no room for a sharp in between. This is also why E♯ and
            B♯ are never written: &ldquo;E, raised a half-step&rdquo; is simply F, and
            writing it as E♯ only ever happens for specific notation reasons
            in more advanced theory, not in everyday use.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
