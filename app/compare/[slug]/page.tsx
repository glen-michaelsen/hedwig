import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { COMPARISONS, comparisonTitle, getComparison } from "@/lib/compare";
import { RoundupView } from "../_components/roundup-view";
import { VersusView } from "../_components/versus-view";

/** Every compare page is known at build time, from lib/compare. */
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARISONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getComparison(slug);
  if (!item) return {};

  const title =
    item.kind === "versus"
      ? `Trenodo vs ${item.competitor}: An Honest Comparison for Musicians`
      : item.title;

  return {
    title: `${title} | Trenodo`,
    description: item.description,
    alternates: { canonical: `/compare/${item.slug}` },
    openGraph: {
      title,
      description: item.description,
      url: `/compare/${item.slug}`,
      siteName: "Trenodo",
      type: "article",
    },
  };
}

export default async function ComparisonPage({
  params,
}: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  const item = getComparison(slug);
  if (!item) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comparisonTitle(item),
        description: item.description,
        author: { "@type": "Organization", name: "Trenodo" },
      },
      ...(item.kind === "roundup"
        ? [
            {
              "@type": "ItemList",
              itemListElement: item.entries.map((entry, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: entry.name,
              })),
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        mainEntity: item.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Hand-written content from lib/compare only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />
      <main className="flex-1">
        {item.kind === "versus" ? <VersusView item={item} /> : <RoundupView item={item} />}
      </main>
      <SiteFooter />
    </>
  );
}
