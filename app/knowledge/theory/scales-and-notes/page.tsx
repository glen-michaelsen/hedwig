import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "The full chromatic scale, what sharps and flats really mean, and why two notes on it don't get a sharp.";

export const metadata: Metadata = {
  title: "Music Notes and Scales Explained: Sharps, Flats and the Chromatic Scale | Trenodo",
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
    a: "Yes. On a normal instrument they are the exact same note, the same key or fret. The name you use depends on the key of the music, not on the sound.",
  },
  {
    q: "Why don't E♯ and B♯ exist?",
    a: "Between E and F, and between B and C, there is already only a half step. A sharp always means the very next half step up. So E sharp is simply F.",
  },
  {
    q: "Why do some people call the note B \"H\"?",
    a: "In some countries in Northern and Central Europe, B is called H. It comes from an old writing mistake, when music notation spread across Europe many centuries ago. B and H are the same note.",
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
        intro="The chromatic scale is simply every note an instrument can play, in order from low to high. It is the alphabet that all music theory is built on. 🎵"
      >
        <GuideSection title="The chromatic scale">
          <p>
            Start on C, and go up in the smallest possible steps (half steps).
            These are the twelve notes:
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
          <p>After B, the pattern starts again on C, one octave higher.</p>
        </GuideSection>

        <GuideSection title="Sharps and flats">
          <p>
            A sharp (♯) raises a note by one half step. A flat (♭) lowers a
            note by one half step. That is why C♯ and D♭ are the same note. C♯
            is &ldquo;C, one half step up.&rdquo; D♭ is &ldquo;D, one half step
            down.&rdquo; Both land on the exact same note. Which name you use
            depends on the key of the music, not on the sound.
          </p>
        </GuideSection>

        <GuideSection title="Why two notes don't get a sharp">
          <p>
            Look at the scale above. There is no note between E and F. And no
            note between B and C. That is not a mistake. These two pairs are
            already only a half step apart. So there is no room for a sharp.
            That is also why you almost never see E♯ or B♯. &ldquo;E, one half step
            up&rdquo; is simply F. You only meet E♯ in more advanced theory, for
            special reasons.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
