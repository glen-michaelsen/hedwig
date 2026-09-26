import Link from "next/link";
import { focusable } from "@/app/_components/ui";
import { listSpotlightPressKits } from "@/lib/dal/spotlight";
import { GENRES, parseTagList } from "@/lib/press/taxonomy";

const KIND_LABELS = { single: "Single", ep: "EP", album: "Album" } as const;

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

/**
 * Real press kits from artists featured in Spotlight, read live on every
 * visit, so the guide gets new examples as new releases are featured.
 * A private kit still shows as an example, but only a public one links
 * to its files (listSpotlightPressKits).
 */
export async function PressKitExamples() {
  const kits = await listSpotlightPressKits(3);

  if (kits.length === 0) {
    return (
      <p>
        New examples show up here as releases get featured in{" "}
        <Link
          href="/spotlight"
          className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
        >
          Spotlight
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-3">
      {kits.map((kit) => {
        const genres = parseTagList(kit.genre)
          .map((value) => GENRES.find((genre) => genre.value === value)?.label)
          .filter(Boolean)
          .slice(0, 2);
        const contents = [
          kit.photos > 0 && plural(kit.photos, "press photo", "press photos"),
          kit.tracks > 0 && plural(kit.tracks, "track", "tracks"),
          kit.documents > 0 && plural(kit.documents, "document", "documents"),
        ].filter(Boolean);

        return (
          <div
            key={kit.spotlightSlug}
            className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft"
          >
            {kit.coverAssetId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/spotlight/image/${kit.coverAssetId}?size=md`}
                alt={`Cover of ${kit.releaseTitle} by ${kit.artistName}`}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-square w-full bg-surface-muted" />
            )}
            <div className="flex flex-1 flex-col p-4">
              <p className="text-sm font-semibold leading-snug text-foreground">
                {kit.releaseTitle}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {kit.artistName} · {KIND_LABELS[kit.releaseKind]}
                {genres.length > 0 && ` · ${genres.join(", ")}`}
              </p>
              {contents.length > 0 && (
                <p className="mt-2 text-xs text-faint">{contents.join(" · ")}</p>
              )}
              <div className="mt-auto flex flex-col gap-1.5 pt-4 text-sm">
                {kit.kitPublished && kit.kitSlug ? (
                  <>
                    <Link
                      href={`/kit/${kit.kitSlug}`}
                      className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
                    >
                      Open the press kit →
                    </Link>
                    <Link
                      href={`/spotlight/${kit.spotlightSlug}`}
                      className={`text-muted transition-colors hover:text-foreground ${focusable} rounded`}
                    >
                      Read the Spotlight
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/spotlight/${kit.spotlightSlug}`}
                    className={`font-medium text-brand-600 hover:underline ${focusable} rounded`}
                  >
                    Read the Spotlight →
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
