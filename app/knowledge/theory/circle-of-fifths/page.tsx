import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { ZoomableImage } from "../../_components/zoomable-image";

const PAGE_DESCRIPTION =
  "Tonic, dominant and subdominant. The circle of fifths, and how it shows you which chords belong together in a key.";

export const metadata: Metadata = {
  title: "The Circle of Fifths Explained: Tonic, Dominant and Subdominant | Trenodo",
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
    a: "Even in a minor key, the dominant chord is major. Its major third is exactly what pulls the music back home to the tonic. Play it as minor, and that pull gets much weaker.",
  },
  {
    q: "What is the circle of fifths useful for?",
    a: "Two big things. It shows which chords belong together in a key, which helps when you write or improvise. And it tells you the sharps or flats of a key, when you read music.",
  },
  {
    q: "Where does the name \"fifth\" come from?",
    a: "Count the natural notes from a root up to the next note on the circle. For example C, D, E, F, G. That is five steps, a fifth. The fifth is also central to how chords are built. A basic chord is a root, a third and a fifth.",
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
        intro="The circle of fifths is a tool for harmony. All major chords sit on the outside of the circle. All minor chords sit on the inside. And chords next to each other are close relatives."
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
              <strong className="text-foreground">Tonic.</strong> The
              &ldquo;home&rdquo; chord of a song. When you look at a song, it is
              usually the chord it starts and ends on. When you write your own,
              you can pick any chord as the tonic, and build from there. 🏠
            </li>
            <li>
              <strong className="text-foreground">Dominant.</strong> One step
              clockwise from the tonic on the circle (a fifth above). Its job is
              to build tension that wants to go back home to the tonic. That is
              why the dominant is always major, even in a minor key.
            </li>
            <li>
              <strong className="text-foreground">Subdominant.</strong> One
              step counterclockwise from the tonic (a fourth above, or a fifth
              below).
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="What it is useful for">
          <p>
            You will use it for two things again and again. First, to find
            which chords belong together in a key. That helps both when you
            write a chord progression and when you improvise over one. Second,
            to find the sharps or flats of a key when you read music.
          </p>
        </GuideSection>

        <GuideSection title="Why is it called a fifth?">
          <p>
            &ldquo;Quint&rdquo; is Latin for five. The step spans five natural notes.
            From C up to G, you count C, D, E, F, G. The same step is at the
            center of how a basic chord is built. A chord is a root, a third
            and a fifth. And only the third changes between the major and the
            minor version.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
