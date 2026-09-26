import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { GuideCard } from "../_components/guide-layout";

const PAGE_DESCRIPTION =
  "Get your music heard by the right people. How to build a press kit, and more guides on releasing and promoting your music.";

export const metadata: Metadata = {
  title: "Promotion Guides for Musicians: Press Kits and More | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/promote" },
  openGraph: {
    title: "Promotion Guides for Musicians: Press Kits and More",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/promote",
    siteName: "Trenodo",
    type: "website",
  },
};

const GUIDES = [
  {
    href: "/knowledge/promote/press-kit",
    title: "How to Build a Press Kit (EPK)",
    body: "Music, cover art, press photos, bio and video. What goes in, what to skip, and real examples from featured artists.",
  },
] as const;

export default function PromoteKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Reach an audience
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Promoting Your Music
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} Good music deserves to be found. 📣
          </p>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              Guides
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {GUIDES.map((item) => (
                <GuideCard key={item.href} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
