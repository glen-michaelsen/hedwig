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
  "Trenodo is a tool box for musicians. Student management, a free link in bio, a free setlist maker and an electronic press kit. All made for musicians, not borrowed from somewhere else.";

export const metadata: Metadata = {
  title: "Trenodo | The Musician Tool Box for Teaching, Promotion & Gigging",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trenodo | The Musician Tool Box",
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
    a: "A tool box for musicians. Tutor for teaching. Link in Bio and Press Kit for promotion. Setlist for gigs. All in one account, instead of four apps that don't talk to each other.",
  },
  {
    q: "Is Trenodo a promotion tool for musicians?",
    a: "Partly. Link in Bio and Press Kit are made to help you promote a release. One page to send people to, and a press kit ready for a promoter or a blog. Tutor and Setlist take care of teaching and gigs.",
  },
  {
    q: "Which of Trenodo's tools are free?",
    a: "Link in Bio and Setlist are free. Forever. Nothing to pay to get started.",
  },
  {
    q: "Do my students need their own account?",
    a: "No. A student logs in to their own portal with just a phone number and a PIN you give them once. No app, and no password to forget.",
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
              Music is a passion. For many of us, it is also a dream to make
              a living from it. Being a musician means handling a lot of
              things. We are a small helper, but we want to make your life a
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
              Free for musicians and students. Students never need an account.
            </p>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Who's behind it, right before the why. Sits tight above Mission so the two read as one story. */
function AboutMe() {
  return (
    <section className={`${containerNarrow} pb-6 sm:pb-8`}>
      <div className="flex flex-col items-center gap-8 rounded-5xl border border-line bg-surface p-8 text-center shadow-soft sm:flex-row sm:items-center sm:gap-10 sm:p-12 sm:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/glen.jpg"
          alt="Glen Michaelsen, the musician and teacher behind Trenodo"
          width={640}
          height={640}
          className="h-40 w-40 shrink-0 rounded-4xl object-cover shadow-lift sm:h-44 sm:w-44"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">
            👋 About me
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Hi, I&rsquo;m Glen
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
            A hobby musician and music teacher from Denmark. I play guitar,
            write songs and sing. I started Trenodo to help musicians, and to
            bring a little more harmony to the music industry. 🎶
          </p>
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
          I&rsquo;m not a professional musician. I have taught, played gigs and
          released a little music on the side. And I felt how much of that
          work has nothing to do with music. Keeping track of every
          student. Remembering to tell people when a new track is out.
          Putting together a Linktree that doesn&rsquo;t really lead anywhere.
          And then there is all the rest: marketing, social media,
          partnerships and booking. The parts of being a musician you never
          see in the practice room.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          I&rsquo;m not trying to build the biggest platform out there. Just
          the tools I wish I had, made with real respect for how much a
          musician already carries. Tutor came first, because teaching is
          where I felt it the most. More tools have followed, one step at a
          time. 🙂
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
      body: "Your students, your library and a note for every lesson. With a private part only you can read.",
      href: "/tutoring",
    },
    {
      emoji: "🔗",
      name: "Link in Bio",
      body: "One page for everything you want people to find: your music, your dates, your links. Made for musicians, not for everyone.",
      href: "/link-in-bio",
    },
    {
      emoji: "📸",
      name: "Press Kit",
      body: "Photos, tracks, lyrics and your story, on one page. Send it to a promoter without attaching nine files.",
      href: "/press-kit",
    },
    {
      emoji: "🎤",
      name: "Setlist",
      body: "Drag songs into sets, see each set grow towards its target length, and print a sheet for the stage.",
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
            I write a short piece about a release I think deserves more
            ears. No algorithm. Just one musician telling another
            musician&rsquo;s story. I can only cover a small part of what&rsquo;s
            out there. But I try to bring some of it to your playlist. 🎧
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
          Teach, release and play gigs from one place. Students and lesson
          notes, a press kit to send out, and a link in bio that actually
          leads somewhere. It takes about five minutes to get started.
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
        <AboutMe />
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
