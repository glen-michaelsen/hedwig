import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* ------------------------------------------------------------------ *
 * Better Auth core tables. A row in `user` IS a tutor — every app
 * table below hangs off user.id as its tenant key.
 * Field names match @better-auth/core/db getAuthTables().
 * ------------------------------------------------------------------ */

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  // hedwig additions
  studioName: text("studioName"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

/* ------------------------------------------------------------------ *
 * Students
 * ------------------------------------------------------------------ */

export const student = sqliteTable(
  "student",
  {
    id: text("id").primaryKey(),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    instrument: text("instrument"),
    level: text("level"),
    /** Contact of record for minors. */
    parentEmail: text("parent_email"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("student_tutor_idx").on(t.tutorId)],
);

/**
 * How a student gets in: their phone number plus a 4-digit PIN.
 *
 * Phone numbers are deliberately NOT unique — siblings at the same studio
 * routinely share a parent's mobile. The PIN is what identifies which
 * student is signing in; see loginStudent() in lib/student-session.ts.
 */
export const access = sqliteTable(
  "access",
  {
    studentId: text("student_id")
      .primaryKey()
      .references(() => student.id, { onDelete: "cascade" }),
    /**
     * Normalised to E.164 by lib/phone.ts before it ever reaches here.
     * Nullable only because students created before phone sign-in existed
     * don't have one — they can't sign in until their tutor adds it.
     * The create form requires it.
     */
    phone: text("phone"),
    pinHash: text("pin_hash").notNull(),
    /** Bumped when a new PIN is issued, so old cookies stop working. */
    generation: integer("generation").notNull().default(1),
    rotatedAt: integer("rotated_at", { mode: "timestamp" }),
    lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
  },
  (t) => [index("access_phone_idx").on(t.phone)],
);

/**
 * Failed sign-ins are counted against the phone number, not the student.
 * Keying it per student would let one sibling's typos lock out the other,
 * and would leave a shared number with no effective limit at all.
 */
export const phoneLockout = sqliteTable("phone_lockout", {
  phone: text("phone").primaryKey(),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: integer("locked_until", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/* ------------------------------------------------------------------ *
 * Library
 * ------------------------------------------------------------------ */

/** pdf lives in R2; link and video are just URLs we render nicely. */
export const material = sqliteTable(
  "material",
  {
    id: text("id").primaryKey(),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["pdf", "link", "video"] }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    /** kind = pdf */
    r2Key: text("r2_key"),
    sizeBytes: integer("size_bytes"),
    /** kind = link | video */
    url: text("url"),
    embedProvider: text("embed_provider"),
    /** Filled by the weekly link-rot cron. */
    linkOk: integer("link_ok", { mode: "boolean" }),
    linkCheckedAt: integer("link_checked_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("material_tutor_idx").on(t.tutorId)],
);

export const tag = sqliteTable(
  "tag",
  {
    id: text("id").primaryKey(),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
  },
  (t) => [uniqueIndex("tag_tutor_name_idx").on(t.tutorId, t.name)],
);

export const materialTag = sqliteTable(
  "material_tag",
  {
    materialId: text("material_id")
      .notNull()
      .references(() => material.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.materialId, t.tagId] }),
    index("material_tag_tag_idx").on(t.tagId),
  ],
);

/* ------------------------------------------------------------------ *
 * Delivery: the shelf (permanent) and lesson notes (weekly)
 * ------------------------------------------------------------------ */

/** Material the tutor pins to a student, independent of any lesson. */
export const shelf = sqliteTable(
  "shelf",
  {
    studentId: text("student_id")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    materialId: text("material_id")
      .notNull()
      .references(() => material.id, { onDelete: "cascade" }),
    pinnedAt: integer("pinned_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [primaryKey({ columns: [t.studentId, t.materialId] })],
);

/**
 * `summaryShared` and `homework` are visible to the student.
 * `notesPrivate` must never leave the admin — see lib/dal/student.ts,
 * which is the only module allowed to read notes for the portal.
 */
export const lessonNote = sqliteTable(
  "lesson_note",
  {
    id: text("id").primaryKey(),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    /** YYYY-MM-DD, the date of the lesson itself. */
    date: text("date").notNull(),
    summaryShared: text("summary_shared"),
    homework: text("homework"),
    notesPrivate: text("notes_private"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("lesson_note_student_idx").on(t.studentId, t.date)],
);

export const noteMaterial = sqliteTable(
  "note_material",
  {
    noteId: text("note_id")
      .notNull()
      .references(() => lessonNote.id, { onDelete: "cascade" }),
    materialId: text("material_id")
      .notNull()
      .references(() => material.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.noteId, t.materialId] })],
);

/* ------------------------------------------------------------------ *
 * Link in Bio
 *
 * One public page per account in v1. See docs/link-in-bio.md.
 * ------------------------------------------------------------------ */

export const bioPage = sqliteTable(
  "bio_page",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Lowercase, without the leading @. Validated in lib/bio/handles.ts. */
    handle: text("handle").notNull(),
    title: text("title").notNull(),
    tagline: text("tagline"),
    avatarKey: text("avatar_key"),
    themePreset: text("theme_preset").notNull().default("midnight"),
    /** Hex, overrides the preset's accent when set. */
    accentColor: text("accent_color"),
    backgroundKind: text("background_kind", {
      enum: ["preset", "solid", "gradient", "image"],
    })
      .notNull()
      .default("preset"),
    /** Hex for solid/gradient, an R2 key for image. */
    backgroundValue: text("background_value"),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    /** The "Made with Trenodo" footer. On by default; theirs to turn off. */
    showCredit: integer("show_credit", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex("bio_page_handle_idx").on(t.handle)],
);

/** Old handles keep resolving — printed QR codes outlive a rename. */
export const bioHandleHistory = sqliteTable("bio_handle_history", {
  handle: text("handle").primaryKey(),
  pageId: text("page_id")
    .notNull()
    .references(() => bioPage.id, { onDelete: "cascade" }),
  changedAt: integer("changed_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * `config` is JSON, shaped per kind and validated with zod at the edge of
 * every action — block kinds multiply, and a column per kind means a
 * migration per idea.
 */
export const bioBlock = sqliteTable(
  "bio_block",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => bioPage.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["link", "text", "player", "video"] }).notNull(),
    position: integer("position").notNull(),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    config: text("config").notNull(),
  },
  (t) => [index("bio_block_page_idx").on(t.pageId, t.position)],
);

/** Kept apart from blocks: these render as an icon row, not a stack. */
export const bioSocial = sqliteTable(
  "bio_social",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => bioPage.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    url: text("url").notNull(),
    position: integer("position").notNull(),
  },
  (t) => [index("bio_social_page_idx").on(t.pageId, t.position)],
);

/**
 * Daily counters rather than a row per hit. Fine while traffic is small;
 * move to Workers Analytics Engine before a page takes off.
 */
export const bioView = sqliteTable(
  "bio_view",
  {
    pageId: text("page_id")
      .notNull()
      .references(() => bioPage.id, { onDelete: "cascade" }),
    day: text("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.pageId, t.day] })],
);

export const bioClick = sqliteTable(
  "bio_click",
  {
    blockId: text("block_id")
      .notNull()
      .references(() => bioBlock.id, { onDelete: "cascade" }),
    day: text("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.blockId, t.day] })],
);

/* ------------------------------------------------------------------ *
 * Ideas — the public suggestion board at /ideas
 * ------------------------------------------------------------------ */

export const idea = sqliteTable(
  "idea",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    detail: text("detail"),
    /** Both optional — an idea is worth having without a name attached. */
    name: text("name"),
    email: text("email"),
    area: text("area", { enum: ["platform", "link-in-bio", "tutor"] })
      .notNull()
      .default("platform"),
    status: text("status", {
      enum: ["new", "planned", "shipped", "declined"],
    })
      .notNull()
      .default("new"),
    /** Nothing reaches the public list until it has been read. */
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    /**
     * SHA-256 of the submitter's IP, for the per-hour submission cap in
     * lib/dal/ideas.ts. The address itself is never stored — this form is
     * open to the public and the addresses are of no use to us afterwards.
     */
    ipHash: text("ip_hash"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    index("idea_published_idx").on(t.published, t.createdAt),
    index("idea_ip_idx").on(t.ipHash, t.createdAt),
  ],
);

export type Idea = typeof idea.$inferSelect;

export type BioPage = typeof bioPage.$inferSelect;
export type BioBlock = typeof bioBlock.$inferSelect;
export type BioSocial = typeof bioSocial.$inferSelect;

export type Student = typeof student.$inferSelect;
export type Material = typeof material.$inferSelect;
export type LessonNote = typeof lessonNote.$inferSelect;
export type Tag = typeof tag.$inferSelect;
