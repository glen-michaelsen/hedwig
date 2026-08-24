import { requireAdmin } from "@/lib/auth";
import { listInvites, listMusicians, type InviteRow } from "@/lib/dal/musicians";
import { revokeInviteAction } from "./actions";
import { InviteMusicianButton } from "./_components/invite-musician-button";
import {
  Empty,
  PageHeader,
  Panel,
  PanelList,
  SectionTitle,
  actionPill,
} from "@/app/_components/ui";

// Reads every account's activity live, and none of the actions that create
// that activity know this page exists to revalidate it — so it can't rely on
// revalidatePath from elsewhere. Without this it risks being frozen at
// whatever it looked like at build/deploy time, same as the Spotlight index.
export const dynamic = "force-dynamic";

export const metadata = { title: "Musicians" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function inviteStatus(invite: InviteRow) {
  if (invite.acceptedAt) return { label: "Joined", tone: "accepted" } as const;
  if (invite.revokedAt) return { label: "Revoked", tone: "revoked" } as const;
  if (invite.expiresAt.getTime() < Date.now()) {
    return { label: "Expired", tone: "expired" } as const;
  }
  return { label: "Pending", tone: "pending" } as const;
}

const STATUS_STYLES = {
  accepted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  pending: "bg-brand-500/10 text-brand-700 dark:text-brand-300",
  revoked: "bg-surface-muted text-faint",
  expired: "bg-surface-muted text-faint",
} as const;

export default async function MusiciansPage() {
  const account = await requireAdmin("/account/musicians");
  const [musicians, invites] = await Promise.all([
    listMusicians(account.id),
    listInvites(account.id),
  ]);

  const pendingCount = invites.filter(
    (row) => inviteStatus(row).tone === "pending",
  ).length;

  return (
    <>
      <PageHeader
        title="Musicians"
        subtitle={
          musicians.length === 0
            ? "Nobody's joined from an invite yet."
            : `${musicians.length} ${musicians.length === 1 ? "account" : "accounts"}` +
              (pendingCount > 0
                ? ` · ${pendingCount} invited, not joined yet`
                : "")
        }
        action={<InviteMusicianButton />}
      />

      <section>
        <SectionTitle>Accounts</SectionTitle>
        {musicians.length === 0 ? (
          <Empty>No one&rsquo;s signed up from an invite yet.</Empty>
        ) : (
          <Panel>
            <PanelList>
              {musicians.map((musician) => (
                <li key={musician.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {musician.studioName || musician.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {musician.name} · {musician.email}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-faint">
                      <p>Joined {formatDate(musician.createdAt)}</p>
                      <p className="mt-0.5">
                        {musician.lastSeen
                          ? `Last seen ${formatDate(musician.lastSeen)}`
                          : "Never signed back in"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
                      {musician.releaseCount}{" "}
                      {musician.releaseCount === 1 ? "release" : "releases"}
                    </span>
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
                      {musician.gigCount} {musician.gigCount === 1 ? "gig" : "gigs"}
                    </span>
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
                      {musician.studentCount}{" "}
                      {musician.studentCount === 1 ? "student" : "students"}
                    </span>
                    {musician.hasBioPage && (
                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
                        Bio page
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </PanelList>
          </Panel>
        )}
      </section>

      {invites.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Invites</SectionTitle>
          <Panel>
            <PanelList>
              {invites.map((invite) => {
                const status = inviteStatus(invite);
                return (
                  <li
                    key={invite.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {invite.email}
                      </p>
                      <p className="mt-0.5 text-xs text-faint">
                        Sent {formatDate(invite.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLES[status.tone]}`}
                      >
                        {status.label}
                      </span>
                      {status.tone === "pending" && (
                        <form action={revokeInviteAction}>
                          <input type="hidden" name="inviteId" value={invite.id} />
                          <button className={actionPill}>Revoke</button>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </PanelList>
          </Panel>
        </section>
      )}
    </>
  );
}
