import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Performing Guides | Trenodo Knowledge",
  description:
    "From busking to your first paid gig. Everything about playing live. Coming soon.",
  robots: { index: false, follow: true },
};

export default function PerformKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Take the stage"
      title="Performing"
      description="From busking to your first paid gig. Everything about playing live. 🎤"
    />
  );
}
