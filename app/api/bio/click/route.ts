import { recordClick } from "@/lib/dal/bio";
import { todayIso } from "@/lib/clock";

/**
 * Click beacon from a public bio page. Unauthenticated by necessity — it
 * only ever increments a counter for a block id that already exists, and
 * returns nothing, so there's nothing to harvest here.
 */
export async function POST(request: Request) {
  let blockId: unknown;
  try {
    ({ blockId } = (await request.json()) as { blockId?: unknown });
  } catch {
    return new Response(null, { status: 204 });
  }

  if (typeof blockId !== "string" || blockId.length === 0) {
    return new Response(null, { status: 204 });
  }

  try {
    await recordClick(blockId, await todayIso());
  } catch {
    // A bad id hits the foreign key and is simply not counted. Never let
    // analytics failures surface to a visitor.
  }

  return new Response(null, { status: 204 });
}
