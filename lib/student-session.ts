import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { access, phoneLockout, student } from "@/db/schema";
import { getDb, getEnv } from "./db";
import { signToken, verifyPin, verifyToken } from "./crypto";
import { normalizePhone } from "./phone";

const COOKIE = "trenodo_student";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

// The identifier is a phone number, which is knowable, so the PIN is the only
// real secret. These are tighter than they would be behind a random code.
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 30;

/** How long the "which sibling are you?" hand-off stays valid. */
const CHOICE_TOKEN_MINUTES = 5;

type StudentToken = { sid: string; gen: number; exp: number };
type ChoiceToken = { ids: string[]; exp: number };

export type StudentSession = {
  id: string;
  name: string;
  tutorId: string;
  instrument: string | null;
};

export type Candidate = { id: string; name: string };

export type LoginResult =
  | { status: "ok" }
  /** The PIN matched more than one student on this number. */
  | { status: "choose"; candidates: Candidate[]; token: string }
  | { status: "invalid" }
  | { status: "locked"; retryInMinutes: number };

/**
 * Resolves the student cookie. `gen` is checked against the access row so
 * that issuing a new PIN logs every existing device out.
 */
export async function getStudentSession(): Promise<StudentSession | null> {
  const env = await getEnv();
  const jar = await cookies();
  const payload = await verifyToken<StudentToken>(
    env.STUDENT_SESSION_SECRET,
    jar.get(COOKIE)?.value,
  );
  if (!payload || payload.exp < Date.now()) return null;

  const db = await getDb();
  const row = await db
    .select({
      id: student.id,
      name: student.name,
      tutorId: student.tutorId,
      instrument: student.instrument,
      active: student.active,
      generation: access.generation,
    })
    .from(student)
    .innerJoin(access, eq(access.studentId, student.id))
    .where(eq(student.id, payload.sid))
    .get();

  if (!row || !row.active || row.generation !== payload.gen) return null;
  return {
    id: row.id,
    name: row.name,
    tutorId: row.tutorId,
    instrument: row.instrument,
  };
}

/**
 * Phone + PIN sign-in.
 *
 * A phone number can belong to several students (siblings share a parent's
 * mobile), so the PIN is what picks the student out. If it somehow matches
 * more than one, we hand back the names and let them choose rather than
 * guessing.
 */
export async function loginStudent(
  rawPhone: string,
  pin: string,
): Promise<LoginResult> {
  const phone = normalizePhone(rawPhone);
  if (!phone) return { status: "invalid" };

  const db = await getDb();
  const env = await getEnv();

  const lockout = await db
    .select()
    .from(phoneLockout)
    .where(eq(phoneLockout.phone, phone))
    .get();

  if (lockout?.lockedUntil && lockout.lockedUntil.getTime() > Date.now()) {
    return {
      status: "locked",
      retryInMinutes: Math.max(
        1,
        Math.ceil((lockout.lockedUntil.getTime() - Date.now()) / 60_000),
      ),
    };
  }

  const rows = await db
    .select({
      studentId: access.studentId,
      pinHash: access.pinHash,
      generation: access.generation,
      name: student.name,
      active: student.active,
    })
    .from(access)
    .innerJoin(student, eq(student.id, access.studentId))
    .where(eq(access.phone, phone));

  // One PBKDF2 pass per student on the number. Families are small, and the
  // lockout above caps how often this can be triggered.
  const matches = [];
  for (const row of rows) {
    if (!row.active) continue;
    if (await verifyPin(pin, row.pinHash)) matches.push(row);
  }

  if (matches.length === 0) {
    await recordFailure(phone);
    return { status: "invalid" };
  }

  await clearFailures(phone);

  if (matches.length === 1) {
    await startSession(matches[0].studentId, matches[0].generation);
    return { status: "ok" };
  }

  const token = await signToken(env.STUDENT_SESSION_SECRET, {
    ids: matches.map((m) => m.studentId),
    exp: Date.now() + CHOICE_TOKEN_MINUTES * 60_000,
  } satisfies ChoiceToken);

  return {
    status: "choose",
    candidates: matches.map((m) => ({ id: m.studentId, name: m.name })),
    token,
  };
}

/**
 * Second step of a shared-number sign-in. The token proves the PIN was
 * already verified for exactly these students, so no PIN is needed again —
 * but the id has to be one the token names.
 */
export async function chooseStudent(
  token: string,
  studentId: string,
): Promise<boolean> {
  const env = await getEnv();
  const payload = await verifyToken<ChoiceToken>(
    env.STUDENT_SESSION_SECRET,
    token,
  );
  if (!payload || payload.exp < Date.now()) return false;
  if (!payload.ids.includes(studentId)) return false;

  const db = await getDb();
  const row = await db
    .select({ generation: access.generation, active: student.active })
    .from(access)
    .innerJoin(student, eq(student.id, access.studentId))
    .where(eq(access.studentId, studentId))
    .get();

  if (!row || !row.active) return false;

  await startSession(studentId, row.generation);
  return true;
}

async function startSession(studentId: string, generation: number) {
  const db = await getDb();
  const env = await getEnv();

  await db
    .update(access)
    .set({ lastSeenAt: new Date() })
    .where(eq(access.studentId, studentId));

  const token = await signToken(env.STUDENT_SESSION_SECRET, {
    sid: studentId,
    gen: generation,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  } satisfies StudentToken);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

async function recordFailure(phone: string) {
  const db = await getDb();
  const now = new Date();

  const current = await db
    .select({ failedAttempts: phoneLockout.failedAttempts })
    .from(phoneLockout)
    .where(eq(phoneLockout.phone, phone))
    .get();

  const attempts = (current?.failedAttempts ?? 0) + 1;
  const locked =
    attempts >= MAX_FAILED_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
      : null;

  await db
    .insert(phoneLockout)
    .values({
      phone,
      failedAttempts: locked ? 0 : attempts,
      lockedUntil: locked,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: phoneLockout.phone,
      set: {
        failedAttempts: locked ? 0 : attempts,
        lockedUntil: locked,
        updatedAt: now,
      },
    });
}

async function clearFailures(phone: string) {
  const db = await getDb();
  await db
    .update(phoneLockout)
    .set({ failedAttempts: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(phoneLockout.phone, phone));
}

/** Whether this number is currently locked out, for the tutor's view. */
export async function getLockout(phone: string) {
  const db = await getDb();
  const row = await db
    .select()
    .from(phoneLockout)
    .where(eq(phoneLockout.phone, phone))
    .get();
  if (!row?.lockedUntil || row.lockedUntil.getTime() <= Date.now()) return null;
  return row.lockedUntil;
}

export async function logoutStudent() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export const STUDENT_COOKIE_NAME = COOKIE;
export const LOCKOUT_POLICY = { MAX_FAILED_ATTEMPTS, LOCKOUT_MINUTES };
