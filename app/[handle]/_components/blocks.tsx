import type { ParsedBlock } from "@/lib/bio/blocks";
import type { ReleaseLink } from "@/lib/dal/press";
import { embedUrl, musicEmbedUrl } from "@/lib/embed";
import { TrackedLink } from "./tracked-link";

const cardClass =
  "block rounded-[var(--bio-radius)] border border-white/10 bg-[var(--bio-card)] px-6 py-4 text-center transition-transform hover:-translate-y-px";

const frameClass =
  "overflow-hidden rounded-[var(--bio-radius)] border border-white/10";

export function BlockRenderer({
  block,
  release,
  today,
}: {
  block: ParsedBlock;
  /** Resolved live for release blocks; null if the release is gone. */
  release?: ReleaseLink | null;
  today: string;
}) {
  if (block.kind === "release") {
    // The release, or its link, may have been removed since the block was
    // added. A block with nothing to point at renders as nothing.
    if (!release || !release.url) return null;

    // Before the release date it's a pre-save; on or after, it's out. An
    // undated release reads as already available.
    const isOut = !release.releaseDate || today >= release.releaseDate;
    const label = isOut
      ? `Listen to ${release.title}`
      : `Pre-save ${release.title}`;

    return (
      <TrackedLink
        blockId={block.id}
        href={release.url}
        className="block rounded-[var(--bio-radius)] bg-[var(--bio-accent)] px-6 py-4 text-center text-[var(--bio-accent-fg)] transition-transform hover:-translate-y-px"
      >
        <span className="block text-[15px] font-semibold">{label}</span>
      </TrackedLink>
    );
  }

  if (block.kind === "link") {
    return (
      <TrackedLink
        blockId={block.id}
        href={block.config.url}
        className="block rounded-[var(--bio-radius)] bg-[var(--bio-accent)] px-6 py-4 text-center text-[var(--bio-accent-fg)] transition-transform hover:-translate-y-px"
      >
        <span className="block text-[15px] font-semibold">
          {block.config.label}
        </span>
        {block.config.description && (
          <span className="mt-0.5 block text-xs opacity-80">
            {block.config.description}
          </span>
        )}
      </TrackedLink>
    );
  }

  if (block.kind === "text") {
    if (block.config.variant === "divider") {
      return (
        <hr className="my-8 h-1 rounded-full border-0 bg-[var(--bio-accent)] opacity-30" />
      );
    }
    if (block.config.variant === "heading") {
      return (
        <h2 className="pt-2 text-center text-lg font-semibold tracking-tight">
          {block.config.value}
        </h2>
      );
    }
    return (
      <p className="text-center text-sm leading-relaxed whitespace-pre-wrap text-[var(--bio-muted)]">
        {block.config.value}
      </p>
    );
  }

  if (block.kind === "player") {
    const embed = musicEmbedUrl(block.config.url);
    if (!embed) {
      // Bandcamp and anything else we can't frame becomes a link rather
      // than an empty box.
      return (
        <TrackedLink
          blockId={block.id}
          href={block.config.url}
          className={cardClass}
        >
          <span className="text-[15px] font-medium">Listen</span>
        </TrackedLink>
      );
    }
    return (
      <div className={frameClass}>
        <iframe
          src={embed.src}
          height={embed.height}
          title="Player"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="w-full"
          style={{ height: embed.height }}
        />
      </div>
    );
  }

  const embed = embedUrl(block.config.url, block.config.provider ?? null);
  if (!embed) {
    return (
      <TrackedLink
        blockId={block.id}
        href={block.config.url}
        className={cardClass}
      >
        <span className="text-[15px] font-medium">Watch</span>
      </TrackedLink>
    );
  }

  return (
    <div className={`${frameClass} aspect-video bg-black`}>
      <iframe
        src={embed}
        title="Video"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
