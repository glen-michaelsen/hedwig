import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Trenodo — making life simpler and more efficient for musicians",
  description:
    "Making life simpler and more efficient for musicians. Trenodo is a toolbox for teaching, releasing and gigging — Tutor keeps lessons in one place today, and Link in Bio gives you one page for everything you point people at.",
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
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
            <span aria-hidden>🎵</span>
            Built for musicians
          </span>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Making life{" "}
            <span className="text-brand-600">simpler and more efficient</span>{" "}
            for musicians.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            While music is a passion, it is also a dream to make a living
            off. Being a musician means handling many things — and while we
            might be a small contribution, we aim to make your life a
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
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Mission />
        <Tools />
        <Spotlight articles={spotlights} />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
