import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Teaching Guides | Trenodo Knowledge",
  description:
    "Share what you know. Turn your playing into lessons other musicians can book. Coming soon.",
  robots: { index: false, follow: true },
};

export default function TeachKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Pass it on"
      title="Teaching Music"
      description="Share what you know. Turn your playing into lessons other musicians can book. 🎓"
    />
  );
}
