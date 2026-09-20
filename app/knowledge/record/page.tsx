import type { Metadata } from "next";
import { ComingSoon } from "../_components/coming-soon";

export const metadata: Metadata = {
  title: "Recording Guides — Trenodo Knowledge",
  description:
    "Setting up a home studio, choosing software, and getting a take you're happy to send. Coming soon.",
};

export default function RecordKnowledgePage() {
  return (
    <ComingSoon
      eyebrow="Capture the sound"
      title="Recording"
      description="Setting up a home studio, choosing software, and getting a take you're happy to send."
    />
  );
}
