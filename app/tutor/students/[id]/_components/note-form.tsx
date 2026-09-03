import { button, input, label } from "@/app/_components/ui";
import { saveNoteAction } from "../../../actions";
import {
  MaterialAttachField,
  type MaterialOption,
} from "./material-attach-field";

export function NoteForm({
  studentId,
  materials,
  allTags,
  note,
  defaultDate,
}: {
  studentId: string;
  materials: MaterialOption[];
  allTags: string[];
  /** Used when creating: today, or the day picked in the calendar. */
  defaultDate?: string;
  note?: {
    id: string;
    date: string;
    summaryShared: string | null;
    homework: string | null;
    notesPrivate: string | null;
    materialIds: string[];
  };
}) {
  return (
    <form action={saveNoteAction} className="space-y-7">
      <input type="hidden" name="studentId" value={studentId} />
      {note && <input type="hidden" name="noteId" value={note.id} />}

      <div className="max-w-[13rem]">
        <label className={label} htmlFor="date">
          Lesson date
        </label>
        <input
          className={input}
          id="date"
          name="date"
          type="date"
          defaultValue={note?.date ?? defaultDate}
          required
        />
      </div>

      <div className="space-y-6 rounded-4xl border border-line bg-surface p-7 shadow-soft sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Shared with the student
        </p>

        <div>
          <label className={label} htmlFor="summaryShared">
            What we covered
          </label>
          <textarea
            className={`${input} min-h-32 leading-relaxed`}
            id="summaryShared"
            name="summaryShared"
            defaultValue={note?.summaryShared ?? ""}
            placeholder="Worked through the B section, slowed the run to 60bpm…"
          />
        </div>

        <div>
          <label className={label} htmlFor="homework">
            Homework
          </label>
          <textarea
            className={`${input} min-h-24 leading-relaxed`}
            id="homework"
            name="homework"
            defaultValue={note?.homework ?? ""}
            placeholder="15 min a day, hands separately"
          />
        </div>

        <MaterialAttachField
          materials={materials}
          allTags={allTags}
          initialAttachedIds={note?.materialIds ?? []}
        />
      </div>

      <div className="rounded-4xl border border-amber-500/30 bg-amber-500/[0.05] p-7 sm:p-8">
        <label className={label} htmlFor="notesPrivate">
          <span className="text-amber-700 dark:text-amber-300">
            Private notes — never shown to the student
          </span>
        </label>
        <textarea
          className={`${input} min-h-28 leading-relaxed`}
          id="notesPrivate"
          name="notesPrivate"
          defaultValue={note?.notesPrivate ?? ""}
          placeholder="Rushing when nervous. Parent keen to push grade 4 early."
        />
      </div>

      <button className={button}>
        {note ? "Save changes" : "Save lesson note"}
      </button>
    </form>
  );
}
