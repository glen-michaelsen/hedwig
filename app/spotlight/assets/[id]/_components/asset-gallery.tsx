"use client";

import { useState, useSyncExternalStore } from "react";
import { Modal } from "@/app/_components/modal";
import { useSaveImage } from "@/app/_components/save-image";
import { actionPill, actionPillBrand, focusable } from "@/app/_components/ui";
import { BADGE_DESIGNS, badgeEmbedCode, badgeSize, type BadgeVariant } from "@/lib/press/badge-meta";

type Image = { src: string; name: string; label: string };

/** A post or story. Tapping it does what its button says: Save on a phone, Download elsewhere. */
function ImageTile({ image, aspect }: { image: Image; aspect: "post" | "story" }) {
  const { label, save } = useSaveImage(image.src, image.name);
  return (
    <li>
      <button
        type="button"
        onClick={save}
        aria-label={`${label} ${image.label}`}
        className={`group block w-full overflow-hidden rounded-2xl border border-line bg-surface-muted shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${focusable}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt=""
          loading="lazy"
          className={`w-full object-cover ${aspect === "post" ? "aspect-[4/5]" : "aspect-[9/16]"}`}
        />
      </button>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{image.label}</span>
        <button type="button" onClick={save} className={actionPill}>
          {label}
        </button>
      </div>
    </li>
  );
}

function subscribe() {
  return () => {};
}

/** Absolute URLs for the embed code, so it works pasted anywhere; preview's code points at preview. */
function useOrigin() {
  return useSyncExternalStore(subscribe, () => window.location.origin, () => null);
}

type BadgeData = { slug: string; title: string; artist: string; rating: number; maxRating: number };

function BadgeModal({
  variant,
  badge,
  onClose,
}: {
  variant: BadgeVariant | null;
  badge: BadgeData;
  onClose: () => void;
}) {
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const design = BADGE_DESIGNS.find((candidate) => candidate.variant === variant);
  if (!variant || !design) return null;

  const src = `/spotlight/${badge.slug}/badge/${variant}.png`;
  const { width, height } = badgeSize(variant);
  const code = badgeEmbedCode(`${origin ?? ""}/spotlight/${badge.slug}`, variant, badge);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied. The code is still on screen to select.
    }
  }

  return (
    <Modal
      open
      onClose={() => {
        setCopied(false);
        onClose();
      }}
      title={design.tone ? `${design.name}, ${design.tone.toLowerCase()}` : design.name}
      description="Download it, or copy the code for your website. It links to the review."
    >
      <div className={`flex items-center justify-center px-6 py-10 ${variant.endsWith("dark") ? "bg-foreground" : "bg-surface-muted"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={width} height={height} className="max-w-full" />
      </div>
      <div className="space-y-4 px-6 py-6 sm:px-7">
        <a href={`${src}?download`} download className={actionPill}>
          Download PNG
        </a>
        <div>
          <p className="text-sm font-medium">Embed code</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-2xl bg-surface-muted px-4 py-3 font-mono text-xs leading-relaxed text-muted">
            {code}
          </pre>
          <button type="button" onClick={copy} className={`mt-3 ${actionPillBrand}`}>
            {copied ? "Copied ✓" : "Copy code"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function SectionTitle({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted">{note}</p>
    </div>
  );
}

export function AssetGallery({
  post,
  stories,
  badge,
}: {
  post: Image;
  stories: Image[];
  /** Only once the review is live: the badges link to it. */
  badge: BadgeData | null;
}) {
  const [openBadge, setOpenBadge] = useState<BadgeVariant | null>(null);

  return (
    <div className="space-y-14">
      <section>
        <SectionTitle title="Post" note="4:5, for the feed." />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          <ImageTile image={post} aspect="post" />
        </ul>
      </section>

      <section>
        <SectionTitle title="Stories" note="9:16. Out now and Read the review leave room for a link sticker." />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {stories.map((story) => (
            <ImageTile key={story.src} image={story} aspect="story" />
          ))}
        </ul>
      </section>

      {badge && (
        <section>
          <SectionTitle title="Badges" note="For your website or EPK. Each links to the review." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BADGE_DESIGNS.map((design) => {
              const { width, height } = badgeSize(design.variant);
              return (
                <li key={design.variant}>
                  <button
                    type="button"
                    onClick={() => setOpenBadge(design.variant)}
                    className={`block w-full overflow-hidden rounded-3xl border border-line bg-surface text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${focusable}`}
                  >
                    <span
                      className={`flex h-32 items-center justify-center px-4 ${
                        design.variant.endsWith("dark") ? "bg-foreground" : "bg-surface-muted"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/spotlight/${badge.slug}/badge/${design.variant}.png`}
                        alt=""
                        width={width}
                        height={height}
                        loading="lazy"
                        className="max-h-24 w-auto max-w-full"
                      />
                    </span>
                    <span className="flex items-center justify-between gap-2 px-4 py-3">
                      <span className="text-sm font-medium">
                        {design.name}
                        {design.tone && <span className="text-muted"> · {design.tone}</span>}
                      </span>
                      <span className="text-xs text-muted">Get it</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <BadgeModal variant={openBadge} badge={badge} onClose={() => setOpenBadge(null)} />
        </section>
      )}
    </div>
  );
}
