import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ZoomableImage } from "../../_components/zoomable-image";

const PAGE_DESCRIPTION =
  "Tonic, dominant and subdominant — the circle of fifths and how it shows you which chords naturally belong together in a key.";

export const metadata: Metadata = {
  title: "The Circle of Fifths Explained: Tonic, Dominant and Subdominant — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/theory/circle-of-fifths" },
  openGraph: {
    title: "The Circle of Fifths Explained: Tonic, Dominant and Subdominant",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/theory/circle-of-fifths",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why is the dominant chord always major?",
    a: "Even in a minor key, the dominant chord is built as major — its major third is specifically what creates the pull back toward the tonic. Play it as minor instead and that pull weakens noticeably.",
  },
  {
    q: "What's the circle of fifths actually useful for?",
    a: "Two big things: working out which chords belong together in a given key (for writing or improvising), and figuring out a key's sharps or flats when reading notation.",
  },
  {
    q: "Where does the name “fifth” come from?",
    a: "Counting the natural notes from a root up to the next one used (for example C, D, E, F, G) spans five steps — a fifth. That interval is also structurally central to how basic chords are built: a triad is a root, a third, and a fifth.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "The Circle of Fifths Explained: Tonic, Dominant and Subdominant",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: ["https://trenodo.com/images/knowledge/theory/circle-of-fifths.svg"],
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

export default function CircleOfFifthsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Music Theory"
        categoryHref="/knowledge/theory"
        title="The Circle of Fifths Explained: Tonic, Dominant and Subdominant"
        intro="The circle of fifths is a harmonization tool — a wheel of every major chord on the outer ring and every minor chord on the inner ring, arranged so that neighboring chords are closely related."
      >
        <div className="rounded-4xl border border-line bg-surface p-8 shadow-lift">
          <ZoomableImage
            src="/images/knowledge/theory/circle-of-fifths.svg"
            alt="The circle of fifths, with major chords outside the ring and their relative minors inside"
            width={400}
            height={392}
            title="The circle of fifths"
            className="mx-auto w-full"
          />
        </div>

        <GuideSection title="Tonic, dominant, subdominant">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Tonic</strong> — the
              &ldquo;home&rdquo; chord of a piece or progression. Analyzing an
              existing song, it&rsquo;s usually the chord things start and end
              on; writing your own, you can pick any chord to be the tonic
              and build outward from there.
            </li>
            <li>
              <strong className="text-foreground">Dominant</strong> — one
              position clockwise from the tonic on the circle (a fifth
              above the root). Its job is to create tension that resolves
              back to the tonic — which is why the dominant chord is always
              built as major, regardless of whether the overall key is
              major or minor.
            </li>
            <li>
              <strong className="text-foreground">Subdominant</strong> — one
              position counterclockwise from the tonic (a fourth above it,
              or equivalently a fifth below).
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What it's actually used for">
          <p>
            Two practical uses come up constantly: figuring out which chords
            naturally belong together in a given key — useful both for
            writing a progression and for improvising over one — and
            working out a key&rsquo;s sharps or flats when reading notation.
          </p>
        </GuideSection>

        <GuideSection title="Why “fifth”?">
          <p>
            &ldquo;Quint&rdquo; is Latin for five, and the interval spans five
            natural-note steps — from C up to G, for example, counting C, D,
            E, F, G. That same interval sits at the center of how a basic
            chord is built: a triad is a root, a third, and a fifth, and
            it&rsquo;s only the third that changes between a chord&rsquo;s major and
            minor version.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
