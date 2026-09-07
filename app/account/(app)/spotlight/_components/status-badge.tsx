import type { SpotlightStatus } from "@/lib/spotlight/slug";

const STYLES: Record<SpotlightStatus, string> = {
  draft: "bg-surface-muted text-muted",
  planned: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const LABELS: Record<SpotlightStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  published: "Published",
};

export function SpotlightStatusBadge({ status }: { status: SpotlightStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
