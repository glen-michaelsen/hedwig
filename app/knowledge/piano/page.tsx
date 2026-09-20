import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Piano Guides — Trenodo Knowledge",
  description:
    "Chords, scales and the fundamentals — a companion to piano lessons, not a replacement for them. Coming soon.",
  robots: { index: false, follow: true },
};

export default function PianoKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Learn an instrument"
      title="Piano"
      description="Chords, scales and the fundamentals — a companion to piano lessons, not a replacement for them."
    />
  );
}
