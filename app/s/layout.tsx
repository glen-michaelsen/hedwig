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
      <header className="shrink-0 border-b border-line/70 bg-background/80 backdrop-blur-xl">
        <div className={`${portalContainer} flex h-16 items-center gap-2`}>
          <Link
            href="/s"
            className={`flex min-w-0 items-center gap-2.5 rounded-xl ${focusable}`}
          >
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-brand"
            >
              {studio.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-[15px] font-semibold tracking-tight">
              {studio}
            </span>
          </Link>

          <form
            action={studentLogoutAction}
            className="ml-auto hidden shrink-0 sm:block"
          >
            <button
              className={`rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground ${focusable}`}
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Below sm this row is redundant with the bottom nav, and Sign out
            moves into its "More" panel. */}
        <div className="hidden sm:block">
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
