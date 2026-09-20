import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Bass Guitar Guides — Trenodo Knowledge",
  description:
    "Get to know the instrument, then build up your scales and technique. Coming soon.",
  robots: { index: false, follow: true },
};

export default function BassKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Learn an instrument"
      title="Bass"
      description="Get to know the instrument, then build up your scales and technique."
    />
  );
}
