import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Where to put your desk, how to position your studio monitors, and a simple trick for finding exactly where to put acoustic treatment.";

export const metadata: Metadata = {
  title: "Home Studio Setup: Desk, Monitor Placement and Acoustic Treatment — Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/record/studio-setup" },
  openGraph: {
    title: "Home Studio Setup: Desk, Monitor Placement and Acoustic Treatment",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/record/studio-setup",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why not just center the desk on the shortest wall?",
    a: "It's more common to fit a room that way, but a longer wall gives sound more room before it reflects back off the side walls, which generally makes for a more accurate listening position.",
  },
  {
    q: "What is the mirror trick actually finding?",
    a: "First reflection points — the exact spots on the walls and ceiling where sound bounces on its way from your monitors to your ears. Those reflections are what smear an otherwise accurate mix, which is why they're where acoustic panels do the most good.",
  },
  {
    q: "Do I need professional acoustic treatment to start?",
    a: "No — even basic panels at the first reflection points (front wall, side walls, ceiling) make a real difference over an untreated room. Treating everything perfectly can come later.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Home Studio Setup: Desk, Monitor Placement and Acoustic Treatment",
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

export default function StudioSetupPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Recording"
        categoryHref="/knowledge/record"
        title="Home Studio Setup: Desk, Monitor Placement and Acoustic Treatment"
        intro="Where your desk and monitors sit in the room matters more than most home-studio budgets suggest — a bad position undermines even good gear."
      >
        <GuideSection title="Positioning your desk">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Put the desk against the room&rsquo;s <strong className="text-foreground">longest wall</strong> —
              it reduces reflections bouncing back off the side walls
              compared to sitting on a shorter one.
            </li>
            <li>
              Keep it <strong className="text-foreground">centered left to right</strong>,
              equal distance from both side walls, so any acoustic
              treatment can be applied symmetrically.
            </li>
            <li>
              Leave at least <strong className="text-foreground">half a meter of clearance from the back wall</strong> —
              bass frequencies tend to build up and reflect off a wall
              that&rsquo;s too close behind you.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Positioning your monitors">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Your mix position and both monitors should form an{" "}
              <strong className="text-foreground">equilateral triangle</strong>{" "}
              viewed from above.
            </li>
            <li>
              <strong className="text-foreground">Angle the monitors inward</strong>,
              toward your listening position, rather than pointing them
              straight across the room.
            </li>
            <li>
              Avoid placing the tweeter at the{" "}
              <strong className="text-foreground">exact vertical midpoint</strong>{" "}
              between floor and ceiling — offset it up or down slightly
              instead.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Finding where to treat the room: the mirror trick">
          <p>
            Sit at your mix position and have someone slide a mirror along
            the walls and ceiling around you. Anywhere you can see a
            monitor&rsquo;s reflection in the mirror is a first reflection point —
            sound is bouncing off that exact spot on its way to your ears.
            Those points (usually somewhere on the front wall, both side
            walls, and the ceiling) are where an acoustic panel makes the
            most difference, since they&rsquo;re what blur an otherwise accurate
            mix with early reflected sound.
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
