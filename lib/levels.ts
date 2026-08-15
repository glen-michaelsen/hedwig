/**
 * The standard three-tier progression used in music teaching. "Advanced"
 * rather than "Expert" — it's the conventional top tier for a student, and
 * grade systems (ABRSM and friends) sit underneath these rather than
 * replacing them.
 *
 * Not enforced server-side: students created before this was a dropdown may
 * hold anything, and LevelSelect keeps such a value as an extra option
 * rather than silently resetting it on the next save.
 */
export const STUDENT_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export type StudentLevel = (typeof STUDENT_LEVELS)[number];
