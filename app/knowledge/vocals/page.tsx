import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Vocal Guides — Trenodo Knowledge",
  description:
    "Breath support, vocal registers and the effects singers reach for once the basics are solid. Coming soon.",
  robots: { index: false, follow: true },
};

export default function VocalsKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Learn an instrument"
      title="Vocals"
      description="Breath support, vocal registers and the effects singers reach for once the basics are solid."
    />
  );
}
