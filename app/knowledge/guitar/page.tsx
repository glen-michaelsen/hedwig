import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Guitar Guides — Trenodo Knowledge",
  description:
    "From your first chord to your first song, plus a reference library for chords, scales, tuning and technique. Coming soon.",
};

export default function GuitarKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Learn an instrument"
      title="Guitar"
      description="From your first chord to your first song — plus a reference library for chords, scales, tuning and technique."
    />
  );
}
