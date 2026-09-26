import "server-only";
import { isAdmin, type Account } from "@/lib/auth";
import { getReleaseOwnerId } from "@/lib/dal/press";

/**
 * The account a press kit page or action runs as. Every press kit query is
 * scoped by account, so this is the one place admin access is decided:
 *
 *   your own release        -> you
 *   someone else's, admin   -> its owner, so the admin sees and edits it
 *   someone else's, anyone  -> you, and the scoped queries find nothing
 *
 * Nothing else changes. The queries still filter on an account; for an
 * admin it's just the owner's instead of their own.
 */
export async function pressOwnerFor(account: Account, releaseId: string) {
  const ownerId = await getReleaseOwnerId(releaseId);
  if (!ownerId || ownerId === account.id) return account.id;
  return (await isAdmin(account)) ? ownerId : account.id;
}
