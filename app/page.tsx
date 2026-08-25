import Link from "next/link";
import type { Metadata } from "next";
import { DashboardMockup } from "./_components/marketing/dashboard-mockup";
import { Hearts } from "./_components/hearts";
import { SiteFooter, SiteHeader } from "./_components/site-header";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
  focusable,
} from "./_components/ui";
import { listPublishedSpotlights } from "@/lib/dal/spotlight";

const PAGE_DESCRIPTION =
  "Trenodo is a musician tool box — student management, a free link in bio, a free setlist creator and an electronic press kit, all built specifically for musicians rather than repurposed general-purpose tools.";

export const metadata: Metadata = {
  title: "Trenodo — The Musician Tool Box for Teaching, Promotion & Gigging",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trenodo — The Musician Tool Box",
    description: PAGE_DESCRIPTION,
    url: "/",
    siteName: "Trenodo",
    type: "website",
  },
};

/**
 * The one place both the visible FAQ and its schema.org markup are written,
 * so they can't drift apart — Google's FAQ rich result (and any AI answer
 * engine reading the JSON-LD) has to match what a visitor actually sees.
 */
const FAQS = [
  {
    q: "What is Trenodo?",
    a: "A musician tool box — Tutor for teaching, Link in Bio and Press Kit for promotion, and Setlist for gigs, all in one account instead of four different apps that don't talk to each other.",
  },
  {
    q: "Is Trenodo a promotion tool for musicians?",
    a: "Partly. Link in Bio and Press Kit are built specifically to help you promote a release — one page to point people at, and an electronic press kit ready to send a promoter or blog. Tutor and Setlist handle the teaching and gigging side instead.",
  },
  {
    q: "Which of Trenodo's tools are free?",
    a: "Link in Bio and Setlist are free, forever — nothing to pay to get started with either one.",
  },
  {
    q: "Do I need an invite to join?",
    a: "Right now, yes — Trenodo's still small and growing carefully. Join the waitlist and you'll hear back with an invite, or when it opens up for everyone.",
  },
  {
    q: "Do my students need their own account?",
    a: "No — a student signs into their own portal with just their phone number and a PIN you read out once. No app, no password to forget.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Trenodo",
      url: "https://trenodo.com",
      description: PAGE_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web-based)",
      audience: { "@type": "Audience", audienceType: "Musicians" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

// Reads the database (recent Spotlight pieces) and there's no cache in front
// of this Worker, so a prerendered copy would freeze on whatever was
// published at build time.
export const dynamic = "force-dynamic";

/* -------------------------------- sections ------------------------------- */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="brand-wash" />
      <div className={container}>
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
              <span aria-hidden>🎵</span>
              The Musician Tool Box
            </span>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Making life{" "}
              <span className="text-brand-600">simpler and more efficient</span>{" "}
              for musicians.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              While music is a passion, it is also a dream to make a living
              off. Being a musician means handling many things — and while
              we might be a small contribution, we aim to make your life a
              little easier.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
                Create your account
              </Link>
              <Link href="/login" className={`${buttonGhost} ${buttonLarge}`}>
                I&rsquo;m a student
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted">
              Free while it&rsquo;s young. Students never create an account.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The frontpage's job, per the brief: talk about the mission first, features
 * second. First person and specific, not a generic "our story" block.
 */
function Mission() {
  return (
    <section className={`${containerNarrow} pb-24 sm:pb-32`}>
      <div className="relative isolate overflow-hidden rounded-5xl border border-line bg-surface p-8 shadow-soft sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
          🎹 Why I built this
        </p>
        <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
          I&rsquo;m not a professional musician — just someone who has
          taught, gigged and released a little music on the side, and felt
          firsthand how much of that work has nothing to do with music at
          all: keeping track of where every student is up to, remembering to
          actually tell people when a new track is out, and cobbling
          together a Linktree that doesn&rsquo;t point anywhere useful. Then
          there&rsquo;s the rest of it — marketing, social media,
          partnerships, booking — the parts of being a working musician that
          never show up in the practice room.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          This isn&rsquo;t an attempt to build the biggest platform out
          there — just the tools I wished I&rsquo;d had, built with real
          respect for how much a working musician already carries. Tutor
          came first, because teaching is where I felt it most. More has
          followed since, at the same unhurried pace.
        </p>
      </div>
    </section>
  );
}

/**
 * All four tools are live now, so a per-card "Available now" pill would say
 * the same thing four times over — it stops meaning anything. Just the
 * tools themselves, each linking out to a subpage of its own. Four cards
 * read as a 2x2 grid rather than three-plus-a-lonely-fourth, which also
 * keeps each card from getting too narrow on a wide screen.
 */
function Tools() {
  const tools = [
    {
      emoji: "🎓",
      name: "Tutor",
      body: "Your students, your library, and a lesson note for every session — with a private half only you can read.",
      href: "/tutoring",
    },
    {
      emoji: "🔗",
      name: "Link in Bio",
      body: "One page for everything you point people at: your music, your dates, your links. Designed for musicians rather than everyone.",
      href: "/link-in-bio",
    },
    {
      emoji: "📸",
      name: "Press Kit",
      body: "Photos, tracks, lyrics and the story, in a page you can send to a promoter without attaching nine files.",
      href: "/press-kit",
    },
    {
      emoji: "🎤",
      name: "Setlist",
      body: "Drag songs into sets, watch each one head toward its target length, and print a sheet for the stage.",
      href: "/setlist",
    },
  ];

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-xl">
                {tool.emoji}
              </span>
              <h2 className="text-lg font-semibold tracking-tight">
                {tool.name}
              </h2>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              {tool.body}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
              Learn more <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * A short editorial teaser, not a full index — that lives at /spotlight.
 * The story here is the whole point of the ticket: there's more good music
 * out there than anyone has time to hear, and this is one small attempt to
 * point a few more ears at a few more of it.
 */
function Spotlight({
  articles,
}: {
  articles: Awaited<ReturnType<typeof listPublishedSpotlights>>;
}) {
  const recent = articles.slice(0, 3);

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            🔦 Spotlight
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
            So much great music isn&rsquo;t getting enough listens.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted text-pretty">
            I write a short piece on a release I think deserves more ears —
            no algorithm, just one musician telling another musician&rsquo;s
            story. I can only cover a sliver of what&rsquo;s out there, but
            I&rsquo;m trying to bring some of it to your playlist.
          </p>
        </div>
        <Link href="/spotlight" className={buttonGhost}>
          See Spotlight <span aria-hidden>→</span>
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="mt-10 rounded-4xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
          The first piece is being written.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {recent.map((article) => (
            <Link
              key={article.id}
              href={`/spotlight/${article.slug}`}
              className={`group block rounded-4xl ${focusable}`}
            >
              <div className="aspect-4/3 w-full overflow-hidden rounded-3xl bg-surface-muted">
                {(article.headerAssetId ?? article.coverAssetId) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/spotlight/image/${article.headerAssetId ?? article.coverAssetId}?size=md`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {article.artistName}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-brand-700">
                {article.headline}
              </h3>
              <div className="mt-2.5">
                <Hearts rating={article.rating} className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Faq() {
  return (
    <section className="border-y border-line/70 bg-surface-muted/40 py-24 sm:py-32">
      <div className={containerNarrow}>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
          Questions
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
          Before you ask
        </h2>

        <dl className="mt-12 space-y-9">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <dt className="text-lg font-semibold tracking-tight text-balance">
                {faq.q}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className={`${containerNarrow} py-24 sm:py-32`}>
      <div className="brand-wash-clip relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
        <div className="brand-wash" />
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Create your free account today
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          Teach, release and gig from one place — students and lesson
          notes, a press kit to send out, a link in bio that points
          somewhere useful. It takes about five minutes to get started.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Create account
          </Link>
          <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage() {
  const spotlights = await listPublishedSpotlights();

  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only — never user input — so this is
        // safe without further escaping.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Mission />
        <Tools />
        <Spotlight articles={spotlights} />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
