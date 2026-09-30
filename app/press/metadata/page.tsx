import Link from "next/link";
import { Empty, PageHeader, Panel, buttonQuiet, focusable } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { listAllReleaseMetadata } from "@/lib/dal/press";
import {
  GENDERS,
  GENRES,
  LABEL_STATUSES,
  LANGUAGES,
  MOODS,
  parseTagList,
  type TaxonomyOption,
} from "@/lib/press/taxonomy";

export const metadata = { title: "Press kit metadata" };

type Row = Awaited<ReturnType<typeof listAllReleaseMetadata>>[number];

const labels = (options: readonly TaxonomyOption[]) =>
  new Map(options.map((option) => [option.value, option.label]));
const GENRE = labels(GENRES);
const MOOD = labels(MOODS);
const LANGUAGE = labels(LANGUAGES);
const LABEL = labels(LABEL_STATUSES);
const GENDER = labels(GENDERS);

function month(value: string) {
  const [year, m] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(
    new Date(year, m - 1, 1),
  );
}

function list(value: string | null, names: Map<string, string>) {
  const items = parseTagList(value);
  return items.length > 0 ? items.map((item) => names.get(item) ?? item).join(", ") : null;
}

/** The fields that feed Spotlight and Discover. City is left out: nothing reads it yet. */
const COLUMNS: { key: string; heading: string; value: (row: Row) => string | null }[] = [
  { key: "date", heading: "Date", value: (row) => (row.releaseDate ? month(row.releaseDate) : null) },
  { key: "url", heading: "Link", value: (row) => (row.url ? "✓" : null) },
  { key: "genre", heading: "Genre", value: (row) => list(row.genre, GENRE) },
  { key: "mood", heading: "Mood", value: (row) => list(row.mood, MOOD) },
  { key: "country", heading: "Country", value: (row) => row.country },
  { key: "language", heading: "Language", value: (row) => (row.language ? (LANGUAGE.get(row.language) ?? row.language) : null) },
  { key: "label", heading: "Label", value: (row) => (row.labelStatus ? (LABEL.get(row.labelStatus) ?? row.labelStatus) : null) },
  { key: "gender", heading: "Gender", value: (row) => (row.gender ? (GENDER.get(row.gender) ?? row.gender) : null) },
];

const GRID = "grid grid-cols-[minmax(12rem,1.6fr)_repeat(8,minmax(4.5rem,1fr))] items-center gap-x-3";

/**
 * Every press kit on Trenodo that's missing at least one tag, most gaps
 * first. A row opens that kit's edit page, and saving it comes back here.
 */
export default async function PressMetadataPage({
  searchParams,
}: PageProps<"/press/metadata">) {
  await requireAdmin("/press/metadata");
  const onlySpotlight = (await searchParams).spotlight === "1";
  const all = await listAllReleaseMetadata();

  const rows = all
    .map((row) => ({
      row,
      values: COLUMNS.map((column) => column.value(row)),
    }))
    .map((item) => ({ ...item, missing: item.values.filter((value) => value === null).length }))
    .filter((item) => item.missing > 0 && (!onlySpotlight || item.row.hasSpotlight))
    .sort((a, b) => b.missing - a.missing);

  const incomplete = all.filter((row) => COLUMNS.some((column) => column.value(row) === null)).length;

  const filter = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${focusable} ${
      active ? "bg-brand-500/12 text-brand-700" : "text-muted hover:text-foreground"
    }`;

  return (
    <>
      <PageHeader
        title="Press kit metadata"
        subtitle={`${incomplete} of ${all.length} kits are missing something. Click a row to fix it.`}
        action={
          <Link className={buttonQuiet} href="/press">
            ← Press Kit
          </Link>
        }
      />

      <div className="mb-4 flex gap-1">
        <Link href="/press/metadata" className={filter(!onlySpotlight)}>
          All kits
        </Link>
        <Link href="/press/metadata?spotlight=1" className={filter(onlySpotlight)}>
          With a Spotlight
        </Link>
      </div>

      {rows.length === 0 ? (
        <Empty>Nothing missing. Every kit here is fully tagged ✨</Empty>
      ) : (
        <Panel>
          {/* Wider than a phone on purpose: it scrolls sideways inside the
              panel rather than squeezing nine columns into nothing. */}
          <div className="overflow-x-auto">
            <div className="min-w-[56rem] text-xs">
              <div
                className={`${GRID} border-b border-line px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint`}
              >
                <span>Release</span>
                {COLUMNS.map((column) => (
                  <span key={column.key}>{column.heading}</span>
                ))}
              </div>

              {rows.map(({ row, values }) => (
                <Link
                  key={row.id}
                  href={`/press/${row.id}/edit?back=metadata`}
                  className={`${GRID} border-b border-line px-5 py-2 transition-colors last:border-0 hover:bg-surface-muted ${focusable}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {row.title}
                      {row.hasSpotlight && (
                        <span className="ml-1.5 text-brand-600" title="Has a Spotlight">
                          ★
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[11px] text-faint">
                      {row.artistName} · {row.ownerEmail}
                    </span>
                  </span>
                  {values.map((value, index) =>
                    value === null ? (
                      <span key={COLUMNS[index].key} className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
                        <span className="sr-only">{COLUMNS[index].heading} missing</span>
                      </span>
                    ) : (
                      <span key={COLUMNS[index].key} className="truncate text-muted" title={value}>
                        {value}
                      </span>
                    ),
                  )}
                </Link>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}
