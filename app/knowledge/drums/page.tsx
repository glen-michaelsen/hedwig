import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Drum Guides — Trenodo Knowledge",
  description:
    "Kit anatomy, stick technique and the rhythms every drummer starts with. Coming soon.",
  robots: { index: false, follow: true },
};

export default function DrumsKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Learn an instrument"
      title="Drums"
      description="Kit anatomy, stick technique and the rhythms every drummer starts with."
    />
  );
}
