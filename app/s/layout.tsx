import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudioForStudent } from "@/lib/dal/student";
import { getStudentSession } from "@/lib/student-session";
import { NavLink, focusable } from "@/app/_components/ui";
import { studentLogoutAction } from "@/app/actions";

const portalContainer = "mx-auto w-full max-w-2xl px-6 sm:px-8";

export default async function PortalLayout({ children }: LayoutProps<"/s">) {
  const student = await getStudentSession();
  if (!student) redirect("/login");

  const studio = await getStudioForStudent(student.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
        <div className={`${portalContainer} flex h-18 items-center gap-1`}>
          <Link
            href="/s"
            className={`mr-4 flex items-center gap-2.5 rounded-xl ${focusable}`}
          >
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-brand"
            >
              {studio.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-[15px] font-semibold tracking-tight">
              {studio}
            </span>
          </Link>

          <nav className="flex items-center gap-0.5">
            <NavLink href="/s">Lessons</NavLink>
            <NavLink href="/s/shelf">My material</NavLink>
          </nav>

          <form action={studentLogoutAction} className="ml-auto">
            <button
              className={`rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground ${focusable}`}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className={`${portalContainer} flex-1 py-12 sm:py-16`}>
        {children}
      </main>
    </div>
  );
}
