import Link from "next/link";
import { Card, focusable } from "@/app/_components/ui";

type ChecklistItem = {
  label: string;
  done: boolean;
  href: string;
};

/**
 * What's still missing before this release is a good candidate for a
 * Spotlight write-up. Replaces the old "Public"/"Not shared" card — that
 * information moved into the publish pill itself, so this slot is free for
 * something more actionable.
 */
export function SpotlightChecklist({
  releaseId,
  hasCover,
  photoCount,
  url,
  genre,
  mood,
  country,
  language,
  labelStatus,
}: {
  releaseId: string;
  hasCover: boolean;
  photoCount: number;
  url: string | null;
  genre: string[];
  mood: string[];
  country: string | null;
  language: string | null;
  labelStatus: string | null;
}) {
  const editPath = `/press/${releaseId}/edit`;

  const items: ChecklistItem[] = [
    { label: "Album cover", done: hasCover, href: `/press/${releaseId}#cover` },
    {
      label: "Press photo",
      done: photoCount >= 1,
      href: `/press/${releaseId}#photos`,
    },
    { label: "Link", done: Boolean(url), href: `${editPath}#url` },
    { label: "Genre", done: genre.length > 0, href: `${editPath}#genre` },
    { label: "Mood/vibe", done: mood.length > 0, href: `${editPath}#mood` },
    { label: "Country", done: Boolean(country), href: `${editPath}#country` },
    { label: "Language", done: Boolean(language), href: `${editPath}#language` },
    { label: "Label", done: Boolean(labelStatus), href: `${editPath}#labelStatus` },
  ];

  const doneCount = items.filter((item) => item.done).length;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Ready for Spotlight
        </p>
        <p className="text-xs font-medium tabular-nums text-faint">
          {doneCount}/{items.length}
        </p>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) =>
          item.done ? (
            <li
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3.5 py-2 text-xs font-medium leading-none text-brand-700 dark:text-brand-300"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3 w-3">
                <path
                  d="M4.5 10.5l3.5 3.5 7.5-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.label}
            </li>
          ) : (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-medium leading-none text-muted transition-all hover:border-line-strong hover:text-foreground ${focusable}`}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </Card>
  );
}
