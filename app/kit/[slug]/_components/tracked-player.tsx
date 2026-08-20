"use client";

import { useCallback } from "react";
import { TrackPlayer } from "@/app/_components/track-player";
import { sendKitEvent } from "./tracking";

/**
 * The player, plus a note to the counters the first time it's started.
 *
 * A thin client wrapper because the page rendering it is a server component,
 * and a callback can't cross that boundary — but a slug and an id can.
 */
export function TrackedPlayer({
  slug,
  assetId,
  src,
  title,
}: {
  slug: string;
  assetId: string;
  src: string;
  title: string;
}) {
  const onFirstPlay = useCallback(() => {
    sendKitEvent(slug, "play", assetId);
  }, [slug, assetId]);

  return <TrackPlayer src={src} title={title} onFirstPlay={onFirstPlay} />;
}
