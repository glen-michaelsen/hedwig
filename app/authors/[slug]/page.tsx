import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { SOCIAL_ICONS } from "@/app/_components/social-links";
import { TermLink } from "@/app/_components/term-link";
import { container, focusable } from "@/app/_components/ui";
import { SpotlightCard } from "@/app/spotlight/_components/spotlight-card";
import { SPOTLIGHT_AUTHOR, authorPath, authorSchema, getAuthor } from "@/lib/authors";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";

// Lists the author's live articles, read per request: there's no cache in
// front of this Worker to keep a prerendered copy fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/authors/[slug]">): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  if (!author) return {};
  const title = `${author.name}, ${author.role}`;
  return {
    title: `${title} | Trenodo`,
    description: author.bio,
    alternates: { canonical: authorPath(author) },
    openGraph: {
      title,
      description: author.bio,
      url: authorPath(author),
      siteName: "Trenodo",
      type: "profile",
      images: [author.image],
    },
  };
}

export default async function AuthorPage({ params }: PageProps<"/authors/[slug]">) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();

  // Every Spotlight is written by SPOTLIGHT_AUTHOR (see lib/authors.ts).
  const articles = author.slug === SPOTLIGHT_AUTHOR.slug ? await listPublishedSpotlights() : [];
  const firstName = author.name.split(" ")[0];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: { ...authorSchema(author), description: author.bio },
    hasPart: articles.map((article) => ({
      "@type": "Review",
      headline: article.headline,
      url: `https://trenodo.com/spotlight/${article.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the author record in code and published article titles.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <main className="flex-1 pb-20">
        <div className={`${container} pt-14 sm:pt-20`}>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={author.image}
              alt={author.name}
              width={160}
              height={160}
              className="h-32 w-32 shrink-0 rounded-full object-cover shadow-lift ring-4 ring-surface sm:h-40 sm:w-40"
            />
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                {author.role}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{author.name}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{author.bio}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {author.profiles.map((profile) => (
                  <li key={profile.name}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="me noopener"
                      aria-label={`${author.name} on ${profile.name}`}
                      title={profile.name}
                      className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-line-strong hover:text-brand-700 ${focusable}`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
                        {SOCIAL_ICONS[profile.name]}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {articles.length > 0 && (
            <section className="mt-16 border-t border-line pt-10">
              <h2 className="text-2xl font-semibold tracking-tight">
                {firstName}&rsquo;s Spotlight articles
              </h2>
              <p className="mt-2 text-sm text-muted">
                {articles.length} {articles.length === 1 ? "release" : "releases"} reviewed in the{" "}
                <TermLink href="/spotlight">Spotlight</TermLink>, newest first.
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <SpotlightCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
