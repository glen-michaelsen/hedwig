"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAccount } from "@/lib/auth";
import * as dal from "@/lib/dal/tutor";
import { detectProvider } from "@/lib/embed";
import { fetchLinkMeta } from "@/lib/links";
import { formatPhone, normalizePhone } from "@/lib/phone";
import { deleteObject, MAX_PDF_BYTES, putPdf } from "@/lib/r2";

/** Empty strings from form fields mean "not set", not "" — see sharedNotes(). */
function nullable(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/* ------------------------------- students ------------------------------ */

export type NewStudentState = {
  error?: string;
  created?: { id: string; name: string; phone: string; pin: string };
};

export async function createStudentAction(
  _prev: NewStudentState,
  formData: FormData,
): Promise<NewStudentState> {
  const tutor = await requireAccount();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "A name is required" };

  // The phone number is the sign-in identifier, so it isn't optional.
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!phone) {
    return { error: "Enter a phone number they can sign in with" };
  }

  const parentEmail = nullable(formData.get("parentEmail"));
  if (parentEmail && !z.email().safeParse(parentEmail).success) {
    return { error: "That parent email doesn't look right" };
  }

  const { id, pin } = await dal.createStudent(tutor.id, {
    name,
    phone,
    instrument: nullable(formData.get("instrument")),
    level: nullable(formData.get("level")),
    parentEmail,
  });

  revalidatePath("/tutor/students");
  return { created: { id, name, phone: formatPhone(phone), pin } };
}

/** Called straight from the edit modal, so it reports problems back. */
export async function updateStudentAction(
  formData: FormData,
): Promise<{ error?: string } | void> {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "A name is required" };

  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!phone) {
    return { error: "Enter a phone number they can sign in with" };
  }

  const email = nullable(formData.get("parentEmail"));
  if (email && !z.email().safeParse(email).success) {
    return { error: "That email doesn't look right" };
  }

  await dal.updateStudent(tutor.id, studentId, {
    name,
    phone,
    instrument: nullable(formData.get("instrument")),
    level: nullable(formData.get("level")),
    parentEmail: email,
    active: formData.get("active") === "on",
  });

  revalidatePath(`/tutor/students/${studentId}`);
}

export type NewPinState = { pin?: string; error?: string };

export async function issueNewPinAction(
  _prev: NewPinState,
  formData: FormData,
): Promise<NewPinState> {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));

  const result = await dal.issueNewPin(tutor.id, studentId);
  if (!result) return { error: "Student not found" };

  revalidatePath(`/tutor/students/${studentId}`);
  return result;
}

export async function deleteStudentAction(formData: FormData) {
  const tutor = await requireAccount();
  await dal.deleteStudent(tutor.id, String(formData.get("studentId")));
  revalidatePath("/tutor/students");
  redirect("/tutor/students");
}

/* ------------------------------- library ------------------------------- */

/**
 * Reads a page's title so the form can fill an empty Title field as soon as
 * a URL is pasted, rather than only at save time.
 *
 * Signed in only — this fetches a URL of the caller's choosing from our
 * server, and shouldn't be an open proxy. The `global_fetch_strictly_public`
 * compatibility flag keeps it off internal addresses.
 */
export async function lookupLinkTitleAction(
  url: string,
): Promise<string | null> {
  await requireAccount();
  if (!z.url().safeParse(url.trim()).success) return null;
  return (await fetchLinkMeta(url.trim())).title;
}

export type NewMaterialState = { error?: string };

export async function createMaterialAction(
  _prev: NewMaterialState,
  formData: FormData,
): Promise<NewMaterialState> {
  const tutor = await requireAccount();
  const kind = String(formData.get("kind"));
  const tags = formData.getAll("tags").map(String);
  const description = nullable(formData.get("description"));
  let title = String(formData.get("title") ?? "").trim();
  let materialId: string;

  if (kind === "pdf") {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Choose a PDF to upload" };
    }
    if (file.type && file.type !== "application/pdf") {
      return { error: "Only PDFs can be uploaded" };
    }
    if (file.size > MAX_PDF_BYTES) {
      return { error: "That PDF is larger than 20 MB" };
    }

    const { key, size } = await putPdf(tutor.id, file);
    materialId = await dal.createMaterial(tutor.id, {
      kind: "pdf",
      title: title || file.name.replace(/\.pdf$/i, ""),
      description,
      r2Key: key,
      sizeBytes: size,
    });
  } else if (kind === "link" || kind === "video") {
    const url = String(formData.get("url") ?? "").trim();
    if (!z.url().safeParse(url).success) {
      return { error: "Enter a full URL, including https://" };
    }

    const provider = detectProvider(url);
    if (!title) {
      // Best effort — the tutor can rename it later.
      title = (await fetchLinkMeta(url)).title ?? url;
    }

    materialId = await dal.createMaterial(tutor.id, {
      kind: kind === "video" || provider ? "video" : "link",
      title,
      description,
      url,
      embedProvider: provider,
    });
  } else {
    return { error: "Pick a material type" };
  }

  await dal.setMaterialTags(tutor.id, materialId, tags);
  revalidatePath("/tutor/library");
  redirect("/tutor/library");
}

export type EditMaterialState = { error?: string };

export async function updateMaterialAction(
  _prev: EditMaterialState,
  formData: FormData,
): Promise<EditMaterialState> {
  const tutor = await requireAccount();
  const materialId = String(formData.get("materialId"));

  const existing = await dal.getMaterial(tutor.id, materialId);
  if (!existing) return { error: "That material no longer exists" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "A title is required" };

  const description = nullable(formData.get("description"));
  let url: string | null = existing.url;
  let embedProvider: string | null = existing.embedProvider;
  let r2Key: string | undefined;
  let sizeBytes: number | undefined;

  if (existing.kind === "pdf") {
    // Replacing the file is optional — an empty file input means "keep it".
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      if (file.type && file.type !== "application/pdf") {
        return { error: "Only PDFs can be uploaded" };
      }
      if (file.size > MAX_PDF_BYTES) {
        return { error: "That PDF is larger than 20 MB" };
      }
      const uploaded = await putPdf(tutor.id, file);
      r2Key = uploaded.key;
      sizeBytes = uploaded.size;
    }
  } else {
    url = String(formData.get("url") ?? "").trim();
    if (!z.url().safeParse(url).success) {
      return { error: "Enter a full URL, including https://" };
    }
    embedProvider = detectProvider(url);
  }

  const result = await dal.updateMaterial(tutor.id, materialId, {
    title,
    description,
    url,
    embedProvider,
    r2Key,
    sizeBytes,
  });

  // Only bin the old object once the row points at the new one.
  if (result?.replacedR2Key) await deleteObject(result.replacedR2Key);

  await dal.setMaterialTags(
    tutor.id,
    materialId,
    formData.getAll("tags").map(String),
  );

  revalidatePath("/tutor/library");
  redirect("/tutor/library");
}

export async function deleteMaterialAction(formData: FormData) {
  const tutor = await requireAccount();
  const r2Key = await dal.deleteMaterial(
    tutor.id,
    String(formData.get("materialId")),
  );
  if (r2Key) await deleteObject(r2Key);
  revalidatePath("/tutor/library");
  // Also called from the edit page, which no longer exists once it's gone.
  redirect("/tutor/library");
}

/* -------------------------------- shelf -------------------------------- */

export async function pinToShelfAction(formData: FormData) {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));
  await dal.pinToShelf(tutor.id, studentId, String(formData.get("materialId")));
  revalidatePath(`/tutor/students/${studentId}`);
}

export async function unpinFromShelfAction(formData: FormData) {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));
  await dal.unpinFromShelf(
    tutor.id,
    studentId,
    String(formData.get("materialId")),
  );
  revalidatePath(`/tutor/students/${studentId}`);
}

/* ------------------------------ lesson notes --------------------------- */

export async function saveNoteAction(formData: FormData) {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));
  const noteId = nullable(formData.get("noteId"));

  const payload = {
    date: String(formData.get("date") ?? "").trim(),
    summaryShared: nullable(formData.get("summaryShared")),
    homework: nullable(formData.get("homework")),
    notesPrivate: nullable(formData.get("notesPrivate")),
    materialIds: formData.getAll("materialIds").map(String),
  };

  if (noteId) {
    await dal.updateNote(tutor.id, noteId, payload);
  } else {
    await dal.createNote(tutor.id, { studentId, ...payload });
  }

  revalidatePath(`/tutor/students/${studentId}`);
  redirect(`/tutor/students/${studentId}`);
}

export async function deleteNoteAction(formData: FormData) {
  const tutor = await requireAccount();
  const studentId = String(formData.get("studentId"));
  await dal.deleteNote(tutor.id, String(formData.get("noteId")));
  revalidatePath(`/tutor/students/${studentId}`);
  redirect(`/tutor/students/${studentId}`);
}
