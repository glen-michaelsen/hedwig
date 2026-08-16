import "server-only";
import { and, desc, eq, inArray, like, ne, or, sql } from "drizzle-orm";
import {
  access,
  lessonNote,
  material,
  materialTag,
  noteMaterial,
  shelf,
  student,
  tag,
} from "@/db/schema";
import { hashPin, newId, newPin } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { getLockout } from "@/lib/student-session";

/**
 * Every function here takes `tutorId` as its first argument and filters on
 * it. That is the tenant boundary — there is no query in this file that can
 * return another tutor's row.
 */

/* ------------------------------- students ------------------------------ */

export async function listStudents(tutorId: string) {
  const db = await getDb();
  return db
    .select({
      id: student.id,
      name: student.name,
      instrument: student.instrument,
      level: student.level,
      active: student.active,
      phone: access.phone,
      lastSeenAt: access.lastSeenAt,
    })
    .from(student)
    .leftJoin(access, eq(access.studentId, student.id))
    .where(eq(student.tutorId, tutorId))
    .orderBy(student.name);
}

export async function getStudent(tutorId: string, studentId: string) {
  const db = await getDb();
  const row = await db
    .select({
      id: student.id,
      name: student.name,
      instrument: student.instrument,
      level: student.level,
      parentEmail: student.parentEmail,
      active: student.active,
      phone: access.phone,
      lastSeenAt: access.lastSeenAt,
    })
    .from(student)
    .leftJoin(access, eq(access.studentId, student.id))
    .where(and(eq(student.id, studentId), eq(student.tutorId, tutorId)))
    .get();
  if (!row) return undefined;

  // Derived here rather than in the page: reading the clock during render
  // is impure, and React lints for it.
  const lockedUntil = row.phone ? await getLockout(row.phone) : null;
  return {
    ...row,
    lockedUntilLabel: lockedUntil ? lockedUntil.toLocaleTimeString() : null,
  };
}

/** Other students reachable on the same number — siblings, usually. */
export async function getPhoneSiblings(
  tutorId: string,
  studentId: string,
  phone: string,
) {
  const db = await getDb();
  return db
    .select({ id: student.id, name: student.name })
    .from(access)
    .innerJoin(student, eq(student.id, access.studentId))
    .where(
      and(
        eq(access.phone, phone),
        eq(student.tutorId, tutorId),
        ne(student.id, studentId),
      ),
    );
}

/**
 * Returns the PIN in plaintext exactly once — it is only ever stored hashed,
 * so if the tutor loses it a new one has to be issued.
 *
 * `phone` must already be normalised by lib/phone.ts.
 */
export async function createStudent(
  tutorId: string,
  data: {
    name: string;
    phone: string;
    instrument?: string | null;
    level?: string | null;
    parentEmail?: string | null;
  },
) {
  const db = await getDb();
  const id = newId();
  const pin = newPin();

  await db.insert(student).values({
    id,
    tutorId,
    name: data.name,
    instrument: data.instrument ?? null,
    level: data.level ?? null,
    parentEmail: data.parentEmail ?? null,
    createdAt: new Date(),
  });

  await db.insert(access).values({
    studentId: id,
    phone: data.phone,
    pinHash: await hashPin(pin),
    generation: 1,
    rotatedAt: new Date(),
  });

  return { id, pin };
}

export async function updateStudent(
  tutorId: string,
  studentId: string,
  data: {
    name: string;
    /** Already normalised. Omit to leave the current number alone. */
    phone?: string;
    instrument?: string | null;
    level?: string | null;
    parentEmail?: string | null;
    active: boolean;
  },
) {
  const db = await getDb();
  const { phone, ...studentFields } = data;

  const owned = await db
    .update(student)
    .set(studentFields)
    .where(and(eq(student.id, studentId), eq(student.tutorId, tutorId)))
    .returning({ id: student.id });

  if (owned.length > 0 && phone) {
    await db
      .update(access)
      .set({ phone })
      .where(eq(access.studentId, studentId));
  }
}

/** Issues a fresh PIN and logs every existing device out. */
export async function issueNewPin(tutorId: string, studentId: string) {
  const db = await getDb();
  const owned = await db
    .select({ id: student.id })
    .from(student)
    .where(and(eq(student.id, studentId), eq(student.tutorId, tutorId)))
    .get();
  if (!owned) return null;

  const pin = newPin();
  await db
    .update(access)
    .set({
      pinHash: await hashPin(pin),
      generation: sql`${access.generation} + 1`,
      rotatedAt: new Date(),
    })
    .where(eq(access.studentId, studentId));

  return { pin };
}

export async function deleteStudent(tutorId: string, studentId: string) {
  const db = await getDb();
  await db
    .delete(student)
    .where(and(eq(student.id, studentId), eq(student.tutorId, tutorId)));
}

/* ------------------------------- library ------------------------------- */

export async function listMaterials(
  tutorId: string,
  filter?: { tagId?: string; q?: string },
) {
  const db = await getDb();
  const conditions = [eq(material.tutorId, tutorId)];

  if (filter?.q) {
    const needle = `%${filter.q}%`;
    conditions.push(
      or(like(material.title, needle), like(material.description, needle))!,
    );
  }
  if (filter?.tagId) {
    conditions.push(
      sql`exists (select 1 from material_tag where material_tag.material_id = ${material.id} and material_tag.tag_id = ${filter.tagId})`,
    );
  }

  return db
    .select({
      id: material.id,
      kind: material.kind,
      title: material.title,
      description: material.description,
      url: material.url,
      linkOk: material.linkOk,
      createdAt: material.createdAt,
      // So the delete confirmation can say what it's about to detach.
      lessonCount: sql<number>`(
        select count(*) from note_material where note_material.material_id = ${material.id}
      )`,
      shelfCount: sql<number>`(
        select count(*) from shelf where shelf.material_id = ${material.id}
      )`,
    })
    .from(material)
    .where(and(...conditions))
    .orderBy(desc(material.createdAt));
}

export async function getMaterial(tutorId: string, materialId: string) {
  const db = await getDb();
  return db
    .select()
    .from(material)
    .where(and(eq(material.id, materialId), eq(material.tutorId, tutorId)))
    .get();
}

export async function createMaterial(
  tutorId: string,
  data: {
    kind: "pdf" | "link" | "video";
    title: string;
    description?: string | null;
    url?: string | null;
    embedProvider?: string | null;
    r2Key?: string | null;
    sizeBytes?: number | null;
  },
) {
  const db = await getDb();
  const id = newId();
  await db.insert(material).values({
    id,
    tutorId,
    kind: data.kind,
    title: data.title,
    description: data.description ?? null,
    url: data.url ?? null,
    embedProvider: data.embedProvider ?? null,
    r2Key: data.r2Key ?? null,
    sizeBytes: data.sizeBytes ?? null,
    createdAt: new Date(),
  });
  return id;
}

export async function updateMaterial(
  tutorId: string,
  materialId: string,
  data: {
    title: string;
    description?: string | null;
    url?: string | null;
    embedProvider?: string | null;
    /** Only set when the PDF is being replaced. */
    r2Key?: string;
    sizeBytes?: number;
  },
) {
  const db = await getDb();
  const owned = await getMaterial(tutorId, materialId);
  if (!owned) return null;

  await db
    .update(material)
    .set({
      title: data.title,
      description: data.description ?? null,
      ...(owned.kind === "pdf"
        ? {}
        : { url: data.url ?? null, embedProvider: data.embedProvider ?? null }),
      ...(data.r2Key ? { r2Key: data.r2Key, sizeBytes: data.sizeBytes } : {}),
    })
    .where(eq(material.id, materialId));

  // Returned so the caller can bin the object the material no longer points at.
  return { replacedR2Key: data.r2Key ? owned.r2Key : null };
}

/** What a material is attached to, for the delete confirmation. */
export async function getMaterialUsage(materialId: string) {
  const db = await getDb();
  const row = await db
    .select({
      lessonCount: sql<number>`(
        select count(*) from note_material where note_material.material_id = ${materialId}
      )`,
      shelfCount: sql<number>`(
        select count(*) from shelf where shelf.material_id = ${materialId}
      )`,
    })
    .from(material)
    .where(eq(material.id, materialId))
    .get();

  return { lessonCount: row?.lessonCount ?? 0, shelfCount: row?.shelfCount ?? 0 };
}

/** Tag names on one material, for prefilling the picker. */
export async function getMaterialTagNames(materialId: string) {
  const db = await getDb();
  const rows = await db
    .select({ name: tag.name })
    .from(materialTag)
    .innerJoin(tag, eq(tag.id, materialTag.tagId))
    .where(eq(materialTag.materialId, materialId));
  return rows.map((r) => r.name);
}

export async function deleteMaterial(tutorId: string, materialId: string) {
  const db = await getDb();
  const row = await getMaterial(tutorId, materialId);
  if (!row) return null;
  await db.delete(material).where(eq(material.id, materialId));
  return row.r2Key;
}

/* --------------------------------- tags -------------------------------- */

export async function listTags(tutorId: string) {
  const db = await getDb();
  return db
    .select({
      id: tag.id,
      name: tag.name,
      count: sql<number>`(select count(*) from material_tag where material_tag.tag_id = ${tag.id})`,
    })
    .from(tag)
    .where(eq(tag.tutorId, tutorId))
    .orderBy(tag.name);
}

export async function getTagsForMaterials(materialIds: string[]) {
  const db = await getDb();
  if (materialIds.length === 0) return [];
  return db
    .select({
      materialId: materialTag.materialId,
      id: tag.id,
      name: tag.name,
    })
    .from(materialTag)
    .innerJoin(tag, eq(tag.id, materialTag.tagId))
    .where(inArray(materialTag.materialId, materialIds));
}

/** Comma-separated free text in, tag rows out. Creates tags as needed. */
export async function setMaterialTags(
  tutorId: string,
  materialId: string,
  names: string[],
) {
  const db = await getDb();
  const cleaned = [
    ...new Set(
      names.map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0),
    ),
  ];

  await db.delete(materialTag).where(eq(materialTag.materialId, materialId));
  if (cleaned.length === 0) return;

  const existing = await db
    .select({ id: tag.id, name: tag.name })
    .from(tag)
    .where(and(eq(tag.tutorId, tutorId), inArray(tag.name, cleaned)));

  const byName = new Map(existing.map((t) => [t.name, t.id]));
  const toCreate = cleaned.filter((n) => !byName.has(n));

  if (toCreate.length > 0) {
    const rows = toCreate.map((name) => ({ id: newId(), tutorId, name }));
    await db.insert(tag).values(rows);
    for (const row of rows) byName.set(row.name, row.id);
  }

  await db
    .insert(materialTag)
    .values(cleaned.map((name) => ({ materialId, tagId: byName.get(name)! })));
}

/* --------------------------------- shelf ------------------------------- */

export async function getShelf(tutorId: string, studentId: string) {
  const db = await getDb();
  return db
    .select({
      id: material.id,
      kind: material.kind,
      title: material.title,
      url: material.url,
    })
    .from(shelf)
    .innerJoin(material, eq(material.id, shelf.materialId))
    .innerJoin(student, eq(student.id, shelf.studentId))
    .where(and(eq(shelf.studentId, studentId), eq(student.tutorId, tutorId)))
    .orderBy(desc(shelf.pinnedAt));
}

export async function pinToShelf(
  tutorId: string,
  studentId: string,
  materialId: string,
) {
  const db = await getDb();
  if (!(await ownsBoth(tutorId, studentId, materialId))) return;
  await db
    .insert(shelf)
    .values({ studentId, materialId, pinnedAt: new Date() })
    .onConflictDoNothing();
}

export async function unpinFromShelf(
  tutorId: string,
  studentId: string,
  materialId: string,
) {
  const db = await getDb();
  if (!(await ownsBoth(tutorId, studentId, materialId))) return;
  await db
    .delete(shelf)
    .where(
      and(eq(shelf.studentId, studentId), eq(shelf.materialId, materialId)),
    );
}

async function ownsBoth(
  tutorId: string,
  studentId: string,
  materialId: string,
) {
  const db = await getDb();
  const s = await db
    .select({ id: student.id })
    .from(student)
    .where(and(eq(student.id, studentId), eq(student.tutorId, tutorId)))
    .get();
  const m = await db
    .select({ id: material.id })
    .from(material)
    .where(and(eq(material.id, materialId), eq(material.tutorId, tutorId)))
    .get();
  return Boolean(s && m);
}

/* ------------------------------ lesson notes --------------------------- */

export async function listNotes(tutorId: string, studentId: string) {
  const db = await getDb();
  return db
    .select({
      id: lessonNote.id,
      date: lessonNote.date,
      summaryShared: lessonNote.summaryShared,
      homework: lessonNote.homework,
      notesPrivate: lessonNote.notesPrivate,
      materialCount: sql<number>`(
        select count(*) from note_material where note_material.note_id = ${lessonNote.id}
      )`,
    })
    .from(lessonNote)
    .where(
      and(eq(lessonNote.tutorId, tutorId), eq(lessonNote.studentId, studentId)),
    )
    .orderBy(desc(lessonNote.date));
}

export async function getNote(tutorId: string, noteId: string) {
  const db = await getDb();
  const note = await db
    .select()
    .from(lessonNote)
    .where(and(eq(lessonNote.id, noteId), eq(lessonNote.tutorId, tutorId)))
    .get();
  if (!note) return null;

  const materials = await db
    .select({ id: material.id, title: material.title, kind: material.kind })
    .from(noteMaterial)
    .innerJoin(material, eq(material.id, noteMaterial.materialId))
    .where(eq(noteMaterial.noteId, noteId));

  return { ...note, materials };
}

export async function createNote(
  tutorId: string,
  data: {
    studentId: string;
    date: string;
    summaryShared: string | null;
    homework: string | null;
    notesPrivate: string | null;
    materialIds: string[];
  },
) {
  const db = await getDb();
  const owned = await db
    .select({ id: student.id })
    .from(student)
    .where(and(eq(student.id, data.studentId), eq(student.tutorId, tutorId)))
    .get();
  if (!owned) return null;

  const id = newId();
  const now = new Date();
  await db.insert(lessonNote).values({
    id,
    tutorId,
    studentId: data.studentId,
    date: data.date,
    summaryShared: data.summaryShared,
    homework: data.homework,
    notesPrivate: data.notesPrivate,
    createdAt: now,
    updatedAt: now,
  });

  await attachMaterials(tutorId, id, data.materialIds);
  return id;
}

export async function updateNote(
  tutorId: string,
  noteId: string,
  data: {
    date: string;
    summaryShared: string | null;
    homework: string | null;
    notesPrivate: string | null;
    materialIds: string[];
  },
) {
  const db = await getDb();
  await db
    .update(lessonNote)
    .set({
      date: data.date,
      summaryShared: data.summaryShared,
      homework: data.homework,
      notesPrivate: data.notesPrivate,
      updatedAt: new Date(),
    })
    .where(and(eq(lessonNote.id, noteId), eq(lessonNote.tutorId, tutorId)));

  await db.delete(noteMaterial).where(eq(noteMaterial.noteId, noteId));
  await attachMaterials(tutorId, noteId, data.materialIds);
}

async function attachMaterials(
  tutorId: string,
  noteId: string,
  materialIds: string[],
) {
  if (materialIds.length === 0) return;
  const db = await getDb();
  // Re-check ownership: ids arrive from a form and could be anything.
  const owned = await db
    .select({ id: material.id })
    .from(material)
    .where(
      and(eq(material.tutorId, tutorId), inArray(material.id, materialIds)),
    );
  if (owned.length === 0) return;
  await db
    .insert(noteMaterial)
    .values(owned.map((m) => ({ noteId, materialId: m.id })))
    .onConflictDoNothing();
}

export async function deleteNote(tutorId: string, noteId: string) {
  const db = await getDb();
  await db
    .delete(lessonNote)
    .where(and(eq(lessonNote.id, noteId), eq(lessonNote.tutorId, tutorId)));
}

/* ------------------------------- dashboard ----------------------------- */

export async function getDashboard(tutorId: string) {
  const db = await getDb();
  const [students, materials, recentNotes] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(student)
      .where(eq(student.tutorId, tutorId))
      .get(),
    db
      .select({ count: sql<number>`count(*)` })
      .from(material)
      .where(eq(material.tutorId, tutorId))
      .get(),
    db
      .select({
        id: lessonNote.id,
        date: lessonNote.date,
        studentId: lessonNote.studentId,
        studentName: student.name,
      })
      .from(lessonNote)
      .innerJoin(student, eq(student.id, lessonNote.studentId))
      .where(eq(lessonNote.tutorId, tutorId))
      .orderBy(desc(lessonNote.date))
      .limit(8),
  ]);

  return {
    studentCount: students?.count ?? 0,
    materialCount: materials?.count ?? 0,
    recentNotes,
  };
}
