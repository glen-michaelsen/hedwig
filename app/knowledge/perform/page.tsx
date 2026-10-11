import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { container } from "@/app/_components/ui";
import { PhotoCard } from "../_components/photo-card";

const PAGE_DESCRIPTION =
  "From busking to your first paid gig. Guides on playing live, getting booked and getting paid.";

export const metadata: Metadata = {
  title: "Performing Guides for Musicians | Trenodo Knowledge",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/perform" },
  openGraph: {
    title: "Performing Guides for Musicians",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/perform",
    siteName: "Trenodo",
    type: "website",
  },
};

const GUIDES = [
  {
    href: "/knowledge/perform/gig-fees",
    title: "How Much to Charge for a Gig",
    body: "Count every hour, price by the kind of gig, and get it in writing. With a calculator in your own currency.",
    image: "/images/knowledge/journey/performing.jpg",
  },
] as const;

export default function PerformKnowledgePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={container}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Take the stage</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Performing
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            {PAGE_DESCRIPTION} Break a leg. 🎤
          </p>

          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Guides</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {GUIDES.map((item) => (
                <PhotoCard key={item.href} {...item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
