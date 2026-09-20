import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Promotion Guides — Trenodo Knowledge",
  description:
    "Releasing to streaming, building a press kit, and getting your music in front of people. Coming soon.",
  robots: { index: false, follow: true },
};

export default function PromoteKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Reach an audience"
      title="Promoting Your Music"
      description="Releasing to streaming, building a press kit, and getting your music in front of people."
    />
  );
}
