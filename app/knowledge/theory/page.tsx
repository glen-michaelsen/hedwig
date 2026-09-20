import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Music Theory Guides — Trenodo Knowledge",
  description:
    "Scales, chord notation, the circle of fifths and the rest of the vocabulary every instrument draws on. Coming soon.",
  robots: { index: false, follow: true },
};

export default function TheoryKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="The shared language"
      title="Music Theory"
      description="Scales, chord notation, the circle of fifths and the rest of the vocabulary every instrument draws on."
    />
  );
}
