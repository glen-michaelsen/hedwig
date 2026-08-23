import "server-only";
import { and, desc, eq, inArray, isNotNull, or, sql } from "drizzle-orm";
import {
  lessonNote,
  material,
  materialTag,
  noteMaterial,
  shelf,
  student,
  tag,
  user,
} from "@/db/schema";
import { getDb } from "@/lib/db";

/**
 * The ONLY module the student portal reads notes through.
 *
 * `lessonNote.notesPrivate` is never selected here. Every query lists its
 * columns explicitly — do not replace these with `select()`, which would
 * pull the private column into the render tree.
 */

export type StudentMaterial = {
  id: string;
  kind: "pdf" | "link" | "video";
  title: string;
  description: string | null;
  url: string | null;
  embedProvider: string | null;
};

const materialColumns = {
  id: material.id,
  kind: material.kind,
  title: material.title,
  description: material.description,
  url: material.url,
  embedProvider: material.embedProvider,
};

/** A note is in the student's feed only once it has something shared on it. */
function sharedNotes(studentId: string) {
  return and(
    eq(lessonNote.studentId, studentId),
    or(isNotNull(lessonNote.summaryShared), isNotNull(lessonNote.homework)),
  );
}

export async function getFeed(studentId: string) {
  const db = await getDb();
  const notes = await db
    .select({
      id: lessonNote.id,
      date: lessonNote.date,
      summaryShared: lessonNote.summaryShared,
      homework: lessonNote.homework,
      materialCount: sql<number>`(
        select count(*) from note_material where note_material.note_id = ${lessonNote.id}
      )`,
    })
    .from(lessonNote)
    .where(sharedNotes(studentId))
    .orderBy(desc(lessonNote.date))
    .limit(50);
  return notes;
}

export async function getNoteForStudent(studentId: string, noteId: string) {
  const db = await getDb();
  const note = await db
    .select({
      id: lessonNote.id,
      date: lessonNote.date,
      summaryShared: lessonNote.summaryShared,
      homework: lessonNote.homework,
    })
    .from(lessonNote)
    .where(and(eq(lessonNote.id, noteId), sharedNotes(studentId)))
    .get();
  if (!note) return null;

  const materials = await db
    .select(materialColumns)
    .from(noteMaterial)
    .innerJoin(material, eq(material.id, noteMaterial.materialId))
    .where(eq(noteMaterial.noteId, noteId));

  return { ...note, materials: materials as StudentMaterial[] };
}

export async function getShelfForStudent(studentId: string) {
  const db = await getDb();
  const rows = await db
    .select(materialColumns)
    .from(shelf)
    .innerJoin(material, eq(material.id, shelf.materialId))
    .where(eq(shelf.studentId, studentId))
    .orderBy(desc(shelf.pinnedAt));
  return rows as StudentMaterial[];
}

export type StudentLibraryItem = StudentMaterial & {
  tags: string[];
  /** Set on lesson items: the date of the most recent lesson it appeared in. */
  lessonDate?: string;
  noteId?: string;
};

/**
 * Everything this student can see, split into the two ways material reaches
 * them. An item pinned to the shelf *and* attached to a lesson appears in
 * both — that's true, and hiding either would misrepresent where it came
 * from.
 *
 * Tags come along so the portal can filter without another round trip.
 */
export async function getStudentLibrary(studentId: string) {
  const db = await getDb();

  const [shelfRows, noteRows] = await Promise.all([
    db
      .select(materialColumns)
      .from(shelf)
      .innerJoin(material, eq(material.id, shelf.materialId))
      .where(eq(shelf.studentId, studentId))
      .orderBy(desc(shelf.pinnedAt)),
    db
      .select({
        ...materialColumns,
        noteId: lessonNote.id,
        lessonDate: lessonNote.date,
      })
      .from(noteMaterial)
      .innerJoin(lessonNote, eq(lessonNote.id, noteMaterial.noteId))
      .innerJoin(material, eq(material.id, noteMaterial.materialId))
      .where(sharedNotes(studentId))
      .orderBy(desc(lessonNote.date)),
  ]);

  const ids = [
    ...new Set([...shelfRows.map((r) => r.id), ...noteRows.map((r) => r.id)]),
  ];

  const tagRows =
    ids.length > 0
      ? await db
          .select({ materialId: materialTag.materialId, name: tag.name })
          .from(materialTag)
          .innerJoin(tag, eq(tag.id, materialTag.tagId))
          .where(inArray(materialTag.materialId, ids))
      : [];

  const tagsByMaterial = new Map<string, string[]>();
  for (const row of tagRows) {
    const list = tagsByMaterial.get(row.materialId) ?? [];
    list.push(row.name);
    tagsByMaterial.set(row.materialId, list);
  }

  const withTags = <T extends { id: string }>(row: T) => ({
    ...row,
    tags: tagsByMaterial.get(row.id) ?? [],
  });

  // Ordered by date descending already, so the first hit for a material is
  // the most recent lesson it appeared in.
  const seen = new Set<string>();
  const fromLessons: StudentLibraryItem[] = [];
  for (const row of noteRows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    fromLessons.push(withTags(row) as StudentLibraryItem);
  }

  return {
    onShelf: shelfRows.map(withTags) as StudentLibraryItem[],
    fromLessons,
  };
}

/**
 * Authorization gate for R2 reads: the student may open a file only if it
 * is on their shelf or attached to one of their shared notes.
 */
export async function getReadableMaterial(studentId: string, materialId: string) {
  const db = await getDb();

  const onShelf = await db
    .select({ id: shelf.materialId })
    .from(shelf)
    .where(and(eq(shelf.studentId, studentId), eq(shelf.materialId, materialId)))
    .get();

  if (!onShelf) {
    const onNote = await db
      .select({ id: noteMaterial.materialId })
      .from(noteMaterial)
      .innerJoin(lessonNote, eq(lessonNote.id, noteMaterial.noteId))
      .where(
        and(eq(noteMaterial.materialId, materialId), sharedNotes(studentId)),
      )
      .get();
    if (!onNote) return null;
  }

  return db
    .select({
      id: material.id,
      kind: material.kind,
      title: material.title,
      r2Key: material.r2Key,
      url: material.url,
    })
    .from(material)
    .where(eq(material.id, materialId))
    .get();
}

export type StudentFeedNote = Awaited<ReturnType<typeof getFeed>>[number];

/** Studio name for the portal header. */
export async function getStudioForStudent(studentId: string) {
  const db = await getDb();
  const row = await db
    .select({ studioName: user.studioName, tutorName: user.name })
    .from(student)
    .innerJoin(user, eq(user.id, student.tutorId))
    .where(eq(student.id, studentId))
    .get();
  return row?.studioName || row?.tutorName || "Trenodo";
}
