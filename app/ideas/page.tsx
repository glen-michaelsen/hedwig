import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/_components/site-header";
import { Panel, PanelList, containerNarrow } from "@/app/_components/ui";
import { listPublishedIdeas, type PublishedIdea } from "@/lib/dal/ideas";
import { IdeaForm } from "./_components/idea-form";

export const metadata: Metadata = {
  title: "Ideas — Trenodo",
  description:
    "Tell us what Trenodo should build next, and see what's already on the way.",
};

// The board reflects the database, and there is no incremental cache in
// front of this Worker yet — a prerendered copy would freeze on whatever
// was published the day it was built.
export const dynamic = "force-dynamic";

const AREA_LABELS = {
  platform: "Trenodo",
  "link-in-bio": "Link in Bio",
  tutor: "Tutor",
} as const;

const STATUS_STYLES = {
  new: "bg-surface-muted text-muted",
  planned: "bg-brand-500/12 text-brand-700 dark:text-brand-300",
  shipped: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  declined: "bg-surface-muted text-faint",
} as const;

const STATUS_LABELS = {
  new: "Considering",
  planned: "Planned",
  shipped: "Shipped",
  declined: "Not for now",
} as const;

function IdeaRow({ idea }: { idea: PublishedIdea }) {
  return (
    <li className="px-6 py-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
            STATUS_STYLES[idea.status]
          }`}
        >
          {STATUS_LABELS[idea.status]}
        </span>
        <span className="text-xs text-faint">{AREA_LABELS[idea.area]}</span>
      </div>

      <p className="mt-2.5 text-sm font-medium">{idea.title}</p>
      {idea.detail && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
          {idea.detail}
        </p>
      )}
      {idea.name && <p className="mt-2 text-xs text-faint">— {idea.name}</p>}
    </li>
  );
}

export default async function IdeasPage() {
  const ideas = await listPublishedIdeas();

  return (
    <>
      <SiteHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className={containerNarrow}>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Ideas
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty">
            Trenodo is built for working musicians, which means the people using
            it know best what it&apos;s missing. Tell us what you need — the ideas we
            take on end up on this page.
          </p>

          <div className="mt-10">
            <IdeaForm />
          </div>

          <section className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
              What others have asked for
            </h2>

            {ideas.length === 0 ? (
              <p className="mt-4 rounded-4xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
                Nothing published yet — yours could be the first.
              </p>
            ) : (
              <Panel className="mt-4">
                <PanelList>
                  {ideas.map((idea) => (
                    <IdeaRow key={idea.id} idea={idea} />
                  ))}
                </PanelList>
              </Panel>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
