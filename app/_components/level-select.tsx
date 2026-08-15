import { STUDENT_LEVELS } from "@/lib/levels";
import { input } from "./ui";

export function LevelSelect({
  id,
  name = "level",
  defaultValue,
}: {
  id: string;
  name?: string;
  defaultValue?: string | null;
}) {
  // A legacy free-text level stays selectable, so editing anything else
  // about the student doesn't quietly wipe it.
  const legacy =
    defaultValue &&
    !STUDENT_LEVELS.includes(defaultValue as (typeof STUDENT_LEVELS)[number])
      ? defaultValue
      : null;

  return (
    <select
      className={input}
      id={id}
      name={name}
      defaultValue={defaultValue ?? ""}
    >
      <option value="">Not set</option>
      {STUDENT_LEVELS.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
      {legacy && <option value={legacy}>{legacy}</option>}
    </select>
  );
}
