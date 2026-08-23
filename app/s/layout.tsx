import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudioForStudent } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { focusable } from "@/app/_components/ui";
import { studentLogoutAction } from "@/app/actions";
import { StudentBottomNav } from "@/app/s/_components/student-bottom-nav";
import { StudentNav } from "@/app/s/_components/student-nav";

const portalContainer = "mx-auto w-full max-w-2xl px-6 sm:px-8";

export default async function PortalLayout({ children }: LayoutProps<"/s">) {
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const studio = await getStudioForStudent(student.id);

  return (
    // Fixed to the screen, with only `main` scrolling inside it — not the
    // page. A `position: fixed`/`sticky` bar pinned to a scrolling page gets
    // dragged around as Safari's own toolbar collapses and expands during
    // scroll, which is the "ducking" a fixed bottom nav is prone to there.
    // Chrome that's simply outside the scroll region never has that problem.
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="shrink-0 border-b border-line/70">
        {/* Full-bleed on desktop rather than boxed to `portalContainer` —
            this is the bold identity bar, not page content. */}
        <div className="bg-linear-to-br from-brand-600 via-brand-700 to-brand-900">
          <div className="flex h-16 items-center gap-2 px-6 sm:px-8 lg:px-10">
            <Link
              href="/s"
              className={`flex min-w-0 items-center gap-2.5 rounded-xl ${focusable}`}
            >
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-semibold text-white"
              >
                {studio.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate text-[15px] font-semibold tracking-tight text-white">
                {studio}
              </span>
            </Link>

            <form
              action={studentLogoutAction}
              className="ml-auto hidden shrink-0 sm:block"
            >
              <button
                className={`rounded-full px-4 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white ${focusable}`}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Below sm this row is redundant with the bottom nav, and Sign out
            moves into its "More" panel. */}
        <div className="hidden bg-background/80 backdrop-blur-xl sm:block">
          <StudentNav />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={`${portalContainer} py-12 sm:py-16`}>{children}</div>
      </main>

      <StudentBottomNav studio={studio} studentName={student.name} />
    </div>
  );
}
