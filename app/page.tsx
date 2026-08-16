import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./_components/site-header";
import {
  button,
  buttonGhost,
  buttonLarge,
  container,
  containerNarrow,
} from "./_components/ui";

export const metadata: Metadata = {
  title: "Trenodo — making life simpler and more efficient for musicians",
  description:
    "Making life simpler and more efficient for musicians. Trenodo is a toolbox for teaching, releasing and gigging — Tutor keeps lessons in one place today, and Link in Bio gives you one page for everything you point people at.",
};

/* -------------------------------- sections ------------------------------- */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="brand-wash" />
      <div className={container}>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-soft">
            <span aria-hidden>🎵</span>
            Built by a working musician
          </span>

          <h1 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Making life{" "}
            <span className="text-brand-600">simpler and more efficient</span>{" "}
            for musicians.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            Most of us teach, release and play — and end up with a different
            tool bolted on for each, none of which talk to one another.
            Trenodo is one account for all of it, built by someone who has
            spent years doing the juggling himself.
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
          I&rsquo;ve taught, gigged and released music for years, and I know
          firsthand how much of that work has nothing to do with music at
          all — chasing a spreadsheet for a student&rsquo;s PIN, hunting for
          the right chord chart before a lesson, cobbling together a Linktree
          that doesn&rsquo;t actually point anywhere useful.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          I&rsquo;m not trying to build the biggest platform out there —
          just the tools I wished I&rsquo;d had, built with real respect for
          how much a working musician already carries. Tutor came first,
          because teaching is where I felt it most. Link in Bio is next.
          More will follow, at the same unhurried pace.
        </p>
      </div>
    </section>
  );
}

/**
 * Status is stated plainly per tool. Press Kit doesn't exist yet, and
 * pretending otherwise is how a landing page stops being trustworthy. The
 * two shipped tools link out to a subpage of their own — this stays brief
 * on purpose, per the brief.
 */
function Tools() {
  const tools = [
    {
      emoji: "🎓",
      name: "Tutor",
      status: "Available now",
      live: true,
      body: "Your students, your library, and a lesson note for every session — with a private half only you can read.",
      href: "/tutoring",
    },
    {
      emoji: "🔗",
      name: "Link in Bio",
      status: "Available now",
      live: true,
      body: "One page for everything you point people at: your music, your dates, your links. Designed for musicians rather than everyone.",
      href: "/link-in-bio",
    },
    {
      emoji: "📸",
      name: "Press Kit",
      status: "Planned",
      live: false,
      body: "Photos, tracks, lyrics and the story, in a page you can send to a promoter without attaching nine files.",
      href: null,
    },
  ];

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => {
          const card = (
            <>
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-xl">
                  {tool.emoji}
                </span>
                <h2 className="text-lg font-semibold tracking-tight">
                  {tool.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                    tool.live
                      ? "bg-brand-500/12 text-brand-700"
                      : "bg-surface-muted text-faint"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                {tool.body}
              </p>
              {tool.href && (
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                  Learn more <span aria-hidden>→</span>
                </span>
              )}
            </>
          );

          const className = `rounded-4xl border p-8 transition-all ${
            tool.live
              ? "border-line bg-surface shadow-soft hover:-translate-y-1 hover:shadow-lift"
              : "border-dashed border-line"
          }`;

          return tool.href ? (
            <Link key={tool.name} href={tool.href} className={className}>
              {card}
            </Link>
          ) : (
            <div key={tool.name} className={className}>
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Doors() {
  const doors = [
    {
      title: "For the musician",
      body: "A private workspace: your library, your students, and a lesson note for every session — including a section only you can read.",
      href: "/account/login",
      cta: "Musician sign in",
      primary: true,
    },
    {
      title: "For the student",
      body: "No account, no password to forget. Their phone number and a four-digit PIN open a feed of their lessons and the material that goes with them.",
      href: "/login",
      cta: "Student sign in",
      primary: false,
    },
  ];

  return (
    <section className={`${container} pb-24 sm:pb-32`}>
      <div className="grid gap-6 md:grid-cols-2">
        {doors.map((door) => (
          <div
            key={door.title}
            className="group rounded-4xl border border-line bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-10"
          >
            <h2 className="text-xl font-semibold tracking-tight">
              {door.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
              {door.body}
            </p>
            <Link
              href={door.href}
              className={`mt-8 ${door.primary ? button : buttonGhost}`}
            >
              {door.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className={`${containerNarrow} py-24 sm:py-32`}>
      <div className="relative isolate overflow-hidden rounded-5xl border border-line bg-surface px-8 py-16 text-center shadow-float sm:px-16">
        <div className="brand-wash" />
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          Set up your studio tonight
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted text-pretty">
          Add one student, write one lesson note, and see what they see. It takes
          about five minutes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/account/signup" className={`${button} ${buttonLarge}`}>
            Create your studio
          </Link>
          <Link href="/account/login" className={`${buttonGhost} ${buttonLarge}`}>
            I already have one
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Mission />
        <Tools />
        <Doors />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
