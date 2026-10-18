"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { revokeConnection } from "@/lib/dal/oauth";

/** Cuts an app off the admin MCP. Its tokens stop working on the next request. */
export async function disconnectAppAction(formData: FormData) {
  const admin = await requireAdmin();
  const clientId = String(formData.get("clientId") ?? "");
  if (clientId) await revokeConnection(admin.id, clientId);
  revalidatePath("/account/settings");
}
