import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Promotion Guides | Trenodo Knowledge",
  description:
    "Release your music, build a press kit and get heard by the right people. Coming soon.",
  robots: { index: false, follow: true },
};

export default function PromoteKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Reach an audience"
      title="Promoting Your Music"
      description="Release your music, build a press kit and get heard by the right people. 📣"
    />
  );
}
