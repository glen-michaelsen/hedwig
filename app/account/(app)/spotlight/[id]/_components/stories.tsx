import { Card } from "@/app/_components/ui";
import type { StorySlot } from "@/lib/spotlight/story-image";
import { SaveStoryButton } from "./save-story-button";

/**
 * Every Instagram story the article makes, to look at and download. Drawn
 * on first view and kept, so the first visit after an edit takes a moment.
 */
export function Stories({
  spotlightId,
  slots,
  fileBase,
}: {
  spotlightId: string;
  slots: StorySlot[];
  /** "artist-title-type-mon-year", as the downloads are named. */
  fileBase: string;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Stories</h2>
      <Card className="mt-4">
        <p className="text-sm leading-relaxed text-muted text-pretty">
          Sized for Instagram stories. Out now and Read the review leave room for the link sticker.
          On a phone, Save opens the share sheet: Save Image puts it in Photos.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map(({ slot, label }) => {
            const src = `/account/spotlight/${spotlightId}/story/${slot}`;
            return (
              <li key={slot}>
                <a href={src} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={label}
                    loading="lazy"
                    className="aspect-[9/16] w-full rounded-2xl border border-line bg-surface-muted object-cover"
                  />
                </a>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-sm">{label}</span>
                  <SaveStoryButton src={src} name={`${fileBase}-story-${slot}`} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
