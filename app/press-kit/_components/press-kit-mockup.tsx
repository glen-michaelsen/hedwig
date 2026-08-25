import { TrackPlayer } from "@/app/_components/track-player";
import { BrowserFrame } from "@/app/_components/mockup/browser-frame";

/**
 * A browser window showing a press kit — the real audio player component
 * with a placeholder track (it renders correctly with no metadata to load,
 * just shows 0:00 until something's actually playing), plus a cover and a
 * photo grid. The photos are gradient tiles rather than the real gallery
 * component: that one needs resolvable image URLs, and there's no sample
 * press photo to point it at that wouldn't be passing off a stock or
 * borrowed image as someone's actual promo shot.
 */

const PHOTO_TILES = [
  "from-brand-400 to-brand-600",
  "from-amber-300 to-brand-500",
  "from-brand-300 to-amber-500",
];

export function PressKitMockup() {
  return (
    <BrowserFrame
      screenClassName="bg-background"
      frameWidth={440}
      screenHeight={360}
      nativeWidth={460}
      scale={0.62}
      url="trenodo.com/kit/glen-nordlys"
    >
      <div className="px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 shadow-soft" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight">
              Nordlys
            </p>
            <p className="text-sm text-muted">Glen · Single · 12 Sept 2026</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Tracks
          </p>
          <div className="mt-3">
            <TrackPlayer src="#" title="Nordlys" />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Press photos
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {PHOTO_TILES.map((gradient) => (
              <div
                key={gradient}
                className={`aspect-4/3 rounded-2xl bg-linear-to-br ${gradient}`}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
