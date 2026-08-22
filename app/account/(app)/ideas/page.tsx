import { requireAdmin } from "@/lib/auth";
import { listAllIdeas, type AdminIdea, type IdeaStatus } from "@/lib/dal/ideas";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  actionPill,
  actionPillBrand,
} from "@/app/_components/ui";
import {
  setIdeaStatusAction,
  toggleIdeaPublishedAction,
} from "./actions";
import { DeleteIdeaButton } from "./_components/delete-idea-button";

const AREA_LABELS = {
  platform: "Trenodo",
  "link-in-bio": "Link in Bio",
  tutor: "Tutor",
} as const;

const STATUSES: { value: IdeaStatus; label: string }[] = [
  { value: "new", label: "Considering" },
  { value: "planned", label: "Planned" },
  { value: "shipped", label: "Shipped" },
  { value: "declined", label: "Not for now" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function IdeaRow({ idea }: { idea: AdminIdea }) {
  return (
    <li className="px-6 py-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-faint">
        <span>{AREA_LABELS[idea.area]}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(idea.createdAt)}</span>
        {idea.name && (
          <>
            <span aria-hidden>·</span>
            <span>{idea.name}</span>
          </>
        )}
        {idea.email && (
          <>
            <span aria-hidden>·</span>
            <a
              href={`mailto:${idea.email}`}
              className="transition-colors hover:text-foreground"
            >
              {idea.email}
            </a>
          </>
        )}
        {idea.votes > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>
              {idea.votes} {idea.votes === 1 ? "vote" : "votes"}
            </span>
          </>
        )}
        {idea.published && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">
            public
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium">{idea.title}</p>
      {idea.detail && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
          {idea.detail}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((status) => (
          <form key={status.value} action={setIdeaStatusAction}>
            <input type="hidden" name="ideaId" value={idea.id} />
            <input type="hidden" name="status" value={status.value} />
            <button
              className={
                idea.status === status.value ? actionPillBrand : actionPill
              }
              aria-pressed={idea.status === status.value}
            >
              {status.label}
            </button>
          </form>
        ))}

        <span className="mx-1 h-5 w-px bg-line" aria-hidden />

        <form action={toggleIdeaPublishedAction}>
          <input type="hidden" name="ideaId" value={idea.id} />
          <input
            type="hidden"
            name="published"
            value={idea.published ? "0" : "1"}
          />
          <button className={idea.published ? actionPill : actionPillBrand}>
            {idea.published ? "Unpublish" : "Publish"}
          </button>
        </form>

        <DeleteIdeaButton
          ideaId={idea.id}
          title={idea.title}
          className={`${actionPill} hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-700`}
        />
      </div>
    </li>
  );
}

export const metadata = { title: "Ideas" };

export default async function AdminIdeasPage() {
  await requireAdmin("/account/ideas");
  const ideas = await listAllIdeas();
  const publishedCount = ideas.filter((idea) => idea.published).length;

  return (
    <>
      <PageHeader
        title="Ideas"
        subtitle={
          ideas.length === 0
            ? "Everything submitted through the public form lands here."
            : `${ideas.length} submitted, ${publishedCount} showing on the public page.`
        }
      />

      {ideas.length === 0 ? (
        <Empty>Nothing submitted yet.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {ideas.map((idea) => (
              <IdeaRow key={idea.id} idea={idea} />
            ))}
          </PanelList>
        </Panel>
      )}
    </>
  );
}
