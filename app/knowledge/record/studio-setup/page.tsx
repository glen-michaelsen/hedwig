import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Where to put your desk, how to place your studio speakers, and a simple trick to find the right spots for acoustic panels.";

export const metadata: Metadata = {
  title: "Home Studio Setup: Desk, Speaker Placement and Acoustic Treatment | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/record/studio-setup" },
  openGraph: {
    title: "Home Studio Setup: Desk, Speaker Placement and Acoustic Treatment",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/record/studio-setup",
    siteName: "Trenodo",
    type: "article",
  },
};

const FAQS = [
  {
    q: "Why not just put the desk by the short wall?",
    a: "It often fits the room better. But a long wall gives the sound more space before it bounces back from the side walls. That usually gives you a more honest listening spot.",
  },
  {
    q: "What does the mirror trick actually find?",
    a: "The first reflection points. These are the exact spots on the walls and the ceiling where the sound bounces on its way from your speakers to your ears. Those bounces blur your mix. So that is where acoustic panels help the most.",
  },
  {
    q: "Do I need professional acoustic treatment to start?",
    a: "No. Even simple panels on the first reflection points (front wall, side walls and ceiling) make a real difference. The perfect room can come later.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Home Studio Setup: Desk, Speaker Placement and Acoustic Treatment",
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
        title="Home Studio Setup: Desk, Speaker Placement and Acoustic Treatment"
        intro="Where your desk and your speakers stand matters more than most people think. A bad spot can ruin the sound of even very good gear."
      >
        <GuideSection title="Where to put your desk">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Put the desk against the{" "}
              <strong className="text-foreground">longest wall</strong> in the
              room. You get fewer reflections from the side walls than on a
              short wall.
            </li>
            <li>
              Keep it{" "}
              <strong className="text-foreground">in the middle, left to right</strong>.
              The same distance to both side walls. Then you can treat the room
              the same way on both sides.
            </li>
            <li>
              Leave at least{" "}
              <strong className="text-foreground">half a meter to the wall behind you</strong>.
              Bass likes to build up and bounce off a wall that is too close.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Where to put your speakers">
          <ul className="list-disc space-y-3 pl-5">
            <li>
              You and your two speakers should form an{" "}
              <strong className="text-foreground">equal sided triangle</strong>,
              seen from above.
            </li>
            <li>
              <strong className="text-foreground">Turn the speakers in</strong>,
              so they point at you. Not straight into the room.
            </li>
            <li>
              Don&rsquo;t put the tweeter{" "}
              <strong className="text-foreground">exactly halfway</strong>{" "}
              between the floor and the ceiling. Move it a little up or down.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Find the spots to treat: the mirror trick">
          <p>
            Sit in your mixing spot. Ask a friend to slide a mirror along the
            walls and the ceiling around you. Every place where you can see a
            speaker in the mirror is a first reflection point. The sound
            bounces off exactly that spot on its way to your ears. That is
            where an acoustic panel helps the most. Usually on the front wall,
            both side walls and the ceiling. A small trick that reflects well
            on your mixes. 🪞
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
