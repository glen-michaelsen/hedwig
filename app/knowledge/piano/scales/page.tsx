import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection, GuideStep } from "../../_components/guide-layout";
import { CalendarIcon, PlayIcon, SparkleIcon } from "../../_components/guide-icons";
import { ZoomableImage } from "../../_components/zoomable-image";
import { MAJOR_SCALES, MINOR_SCALES, SCALE_STEPS, type PianoScale } from "@/lib/piano-diagrams/piano-scales";

const TITLE = "Piano Scales: Every Major Scale and the Minor Scales to Start With";
const PAGE_DESCRIPTION =
  "Piano scales with diagrams and right-hand fingering: all 12 major scales and the first five natural minor scales, plus how scales are built and how to practise them.";

export const metadata: Metadata = {
  title: `${TITLE} | Trenodo`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/piano/scales" },
  openGraph: {
    title: TITLE,
    description: PAGE_DESCRIPTION,
    url: "/knowledge/piano/scales",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Which piano scale should I learn first?",
    a: "C major. It's all white keys, so you can focus on the fingering: 1 2 3, thumb under, 1 2 3 4 5. Then G major and F major, one sharp and one flat.",
  },
  {
    q: "Why does my thumb go under in the middle of a scale?",
    a: "A scale has eight notes and your hand has five fingers. Tucking the thumb under after the third note lets your hand move along the keyboard without a jump, so the scale stays smooth and even.",
  },
  {
    q: "How many piano scales are there?",
    a: "Twelve major and twelve minor, one of each on every key. The natural minor shares its notes with a major scale: A minor uses the same keys as C major, just starting from A.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      image: [...MAJOR_SCALES, ...MINOR_SCALES].map(
        (scale) => `https://trenodo.com/images/knowledge/piano/scales/${scale.slug}.svg`,
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

/** The steps of a scale as a row of whole (W) and half (H) steps. */
function StepPattern({ steps }: { steps: readonly number[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label={steps.map((s) => (s === 2 ? "whole" : "half")).join(", ")}>
      {steps.map((step, i) => (
        <li
          key={i}
          className={`grid h-10 place-items-center rounded-xl text-sm font-semibold ${
            step === 2 ? "w-16 bg-brand-600 text-white" : "w-9 bg-brand-500/15 text-brand-700"
          }`}
        >
          {step === 2 ? "W" : "H"}
        </li>
      ))}
    </ol>
  );
}

function ScaleFigure({ scale }: { scale: PianoScale }) {
  return (
    <figure className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
      <ZoomableImage
        src={`/images/knowledge/piano/scales/${scale.slug}.svg`}
        alt={`${scale.name} scale on piano with right-hand fingering: ${scale.spelled.join(" ")}`}
        width={521}
        height={198}
        title={`${scale.name} scale`}
        className="w-full"
      />
      <figcaption className="mt-2 px-1">
        <span className="block text-base font-semibold text-foreground">{scale.name}</span>
        <span className="mt-0.5 block text-sm text-muted">{scale.spelled.join(" ")}</span>
      </figcaption>
    </figure>
  );
}

export default function PianoScalesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Built from the scale data in code, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Piano"
        categoryHref="/knowledge/piano"
        title="Piano Scales"
        intro="Scales are the warm-up every pianist comes back to. They train your fingers, your ears and your sense of key. Every diagram shows the right-hand fingering: the number on each key is the finger that plays it. 🎹"
      >
        <GuideSection title="How a major scale is built">
          <p>
            Every major scale follows the same pattern of whole steps (W, two keys along) and half
            steps (H, the very next key). Start on any key, follow the pattern, and you land on the
            major scale of that key.
          </p>
          <StepPattern steps={SCALE_STEPS.major} />
          <p>
            Fingers count from the thumb: 1 is the thumb, 5 is the little finger. Most scales that
            start on a white key use 1 2 3, thumb under, 1 2 3 4 5.
          </p>
        </GuideSection>

        <section aria-labelledby="major-heading">
          <h2 id="major-heading" className="text-2xl font-semibold tracking-tight">
            All 12 major scales
          </h2>
          <p className="mt-3 text-base text-muted">
            In the order of the circle of fifths: each scale adds one sharp, then the flat keys
            come back round.
          </p>
          <div className="mt-6 grid gap-4">
            {MAJOR_SCALES.map((scale) => (
              <ScaleFigure key={scale.slug} scale={scale} />
            ))}
          </div>
        </section>

        <GuideSection title="How a natural minor scale is built">
          <p>
            The natural minor uses a different pattern of steps, and that alone makes it sound
            darker. Every minor scale shares its keys with a major scale: A minor is C major,
            started from A.
          </p>
          <StepPattern steps={SCALE_STEPS.minor} />
        </GuideSection>

        <section aria-labelledby="minor-heading">
          <h2 id="minor-heading" className="text-2xl font-semibold tracking-tight">
            Natural minor scales to start with
          </h2>
          <div className="mt-6 grid gap-4">
            {MINOR_SCALES.map((scale) => (
              <ScaleFigure key={scale.slug} scale={scale} />
            ))}
          </div>
        </section>

        <GuideStep step={1} icon={<CalendarIcon />} title="Hands separately, and slowly">
          <p>
            One hand at a time, at a speed where every note is even and every finger lands right.
            Slow and correct beats fast and messy, every time.
          </p>
        </GuideStep>
        <GuideStep step={2} icon={<PlayIcon />} title="Then with a metronome">
          <p>
            One note per click, then two. Raise the tempo a little each week. Smooth thumb-unders
            are the sign you&rsquo;re ready to go faster.
          </p>
        </GuideStep>
        <GuideStep step={3} icon={<SparkleIcon />} title="Then hands together" rail={false}>
          <p>
            The left hand uses its own fingering, so learn it on its own first. Together, start
            slower than you think. Five minutes a day does more than an hour once a week.
          </p>
        </GuideStep>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
