import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader, button, buttonGhost, buttonQuiet } from "@/app/_components/ui";
import { requireAdmin } from "@/lib/auth";
import { buildNudge } from "@/lib/spotlight/nudge";
import { sendNudgeAction } from "../../../actions";

export const metadata = { title: "Email about a press kit" };

const SENT = {
  owner: { tone: "bg-emerald-500/12 text-emerald-800", text: "Sent. The board shows when they were emailed." },
  me: { tone: "bg-brand-500/10 text-brand-800", text: "A test copy is on its way to you." },
  failed: { tone: "bg-rose-500/12 text-rose-800", text: "It didn't send. Try again in a moment." },
} as const;

/**
 * The exact email the Spotlight board would send to a release's owner,
 * before it goes. Nothing is sent from the board itself: only from here.
 */
export default async function NudgeEmailPage({
  params,
  searchParams,
}: PageProps<"/account/spotlight/board/email/[releaseId]">) {
  const admin = await requireAdmin();
  const { releaseId } = await params;
  const { sent } = await searchParams;
  const built = await buildNudge(releaseId);
  if (!built) notFound();
  const { release, content, complete } = built;
  const notice = typeof sent === "string" && sent in SENT ? SENT[sent as keyof typeof SENT] : null;

  return (
    <>
      <PageHeader
        title="Email about a press kit"
        subtitle={`${release.title} by ${release.artistName}`}
        action={
          <Link className={buttonQuiet} href="/account/spotlight/board">
            ← Board
          </Link>
        }
      />

      {notice && <p className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${notice.tone}`}>{notice.text}</p>}

      {complete ? (
        <Card>
          <p className="text-sm text-muted">This press kit has everything. There&rsquo;s nothing to ask for.</p>
        </Card>
      ) : (
        <Card>
          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[5rem_minmax(0,1fr)]">
            <dt className="text-muted">To</dt>
            <dd className="font-medium">
              {release.ownerName} &lt;{release.ownerEmail}&gt;
            </dd>
            <dt className="text-muted">Subject</dt>
            <dd className="font-medium">{content.subject}</dd>
            {release.nudgedAt && (
              <>
                <dt className="text-muted">Last sent</dt>
                <dd>
                  {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(release.nudgedAt)}
                </dd>
              </>
            )}
          </dl>

          <iframe
            title="Email preview"
            srcDoc={content.html}
            sandbox=""
            className="mt-5 h-[860px] w-full rounded-3xl border border-line"
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <form action={sendNudgeAction}>
              <input type="hidden" name="releaseId" value={release.id} />
              <input type="hidden" name="to" value="owner" />
              <button className={button}>Send to {release.ownerName.split(" ")[0]}</button>
            </form>
            <form action={sendNudgeAction}>
              <input type="hidden" name="releaseId" value={release.id} />
              <input type="hidden" name="to" value="me" />
              <button className={buttonGhost}>Send to me ({admin.email})</button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
