import "server-only";
import { and, desc, eq, gt } from "drizzle-orm";
import { waitlist } from "@/db/schema";
import { hashIp, newId } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { WAITLIST_FEATURES, type WaitlistFeature } from "@/lib/waitlist";

export type NewWaitlistEntry = {
  name: string;
  email: string;
  phone: string | null;
  features: WaitlistFeature[];
  ip: string | null;
};

/** Same idea as lib/dal/ideas.ts: public form, hashed-IP cap, no accounts involved. */
const HOURLY_LIMIT = 5;

export async function joinWaitlist(
  input: NewWaitlistEntry,
): Promise<{ ok: true } | { ok: false; reason: "rate-limited" }> {
  const db = await getDb();
  const ipHash = input.ip ? await hashIp(input.ip) : null;

  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(and(eq(waitlist.ipHash, ipHash), gt(waitlist.createdAt, since)))
      .limit(HOURLY_LIMIT);

    if (recent.length >= HOURLY_LIMIT) return { ok: false, reason: "rate-limited" };
  }

  await db
    .insert(waitlist)
    .values({
      id: newId(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      features: JSON.stringify(input.features),
      ipHash,
    })
    // Re-submitting — e.g. to add another feature — updates the existing
    // row rather than erroring or duplicating it. Email is the identity
    // here, same as it will be once they're invited.
    .onConflictDoUpdate({
      target: waitlist.email,
      set: {
        name: input.name,
        phone: input.phone,
        features: JSON.stringify(input.features),
      },
    });

  return { ok: true };
}

/* --------------------------------- admin -------------------------------- */

function parseFeatures(raw: string): WaitlistFeature[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WaitlistFeature[]) : [];
  } catch {
    return [];
  }
}

export async function listWaitlist() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(waitlist)
    .orderBy(desc(waitlist.createdAt))
    .limit(500);

  return rows.map((row) => ({ ...row, features: parseFeatures(row.features) }));
}

export type WaitlistRow = Awaited<ReturnType<typeof listWaitlist>>[number];

/** Total signups plus a count per feature, for the admin widget. */
export async function waitlistSummary() {
  const rows = await listWaitlist();

  const counts = Object.fromEntries(
    WAITLIST_FEATURES.map((option) => [option.key, 0]),
  ) as Record<WaitlistFeature, number>;

  for (const row of rows) {
    for (const feature of row.features) counts[feature] += 1;
  }

  return { total: rows.length, counts };
}
