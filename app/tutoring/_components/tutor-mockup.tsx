import { LessonNotes, type NoteSummary } from "@/app/tutor/students/[id]/_components/lesson-notes";
import { BrowserFrame } from "@/app/_components/mockup/browser-frame";

/**
 * A browser window showing a student's lesson history — the real
 * LessonNotes component (list view, calendar toggle and all) with made-up
 * notes, not a screenshot. It's fully prop-driven with no DB or server
 * action calls, so it drops in as-is.
 */

const NOTES: NoteSummary[] = [
  {
    id: "n1",
    date: "2026-08-25",
    summaryShared: "Scales, then worked on the bridge of “Nordlys”",
    hasHomework: true,
    materialCount: 2,
  },
  {
    id: "n2",
    date: "2026-08-18",
    summaryShared: "Sight-reading and chord voicings up the neck",
    hasHomework: false,
    materialCount: 1,
  },
  {
    id: "n3",
    date: "2026-08-11",
    summaryShared: "Recording technique — mic placement, gain staging",
    hasHomework: true,
    materialCount: 0,
  },
];

export function TutorMockup() {
  return (
    <BrowserFrame
      screenClassName="bg-background"
      frameWidth={440}
      screenHeight={340}
      nativeWidth={460}
      scale={0.62}
      url="trenodo.com/tutor/students/glen"
    >
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/12 text-sm font-semibold text-brand-700">
            G
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">Glen</p>
            <p className="text-xs text-faint">Guitar · since Jan 2026</p>
          </div>
        </div>

        <div className="mt-6">
          <LessonNotes studentId="mock" notes={NOTES} today="2026-08-25" />
        </div>
      </div>
    </BrowserFrame>
  );
}
