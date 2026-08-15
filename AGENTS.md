<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trenodo (codename `hedwig`)

Read `README.md` first — it covers the domain model and the security rules that
matter. The short version:

- **Trenodo is a toolbox, not a tutoring app.** It lives at trenodo.com;
  the Worker, D1 and R2 keep the `hedwig` codename. The account owner is a
  *musician* who may teach, release or gig. Tutor (teaching) is one tool.
  See `docs/link-in-bio.md` for where this is going.
- **Surfaces.** `/` public landing · `/account/*` the account and its tool
  dashboard · `/tutor/*` the Tutor tool · `/login` and `/s/*` the student
  portal (phone + PIN). `/admin/*` permanently redirects — don't revive it.
- **`requireAccount()`**, not `requireTutor()`. The `Account` type is the
  signed-in musician; `student.tutor_id` keeps its name in the database.
- **Styling goes through the tokens.** `app/globals.css` defines the brand
  scale, warm surfaces and shadows; `app/_components/ui.tsx` holds the
  primitives. Use `bg-surface`, `text-muted`, `border-line`, `shadow-soft` —
  never a raw colour.
- **The product is light-theme only.** Don't add `dark:` utilities; the
  variant is rebound to an unused `.dark` class, so they'd be dead code.
- **`tutorId` is the tenant key.** Every query in `lib/dal/tutor.ts` filters on
  it. Adding a query that doesn't is a data leak between studios.
- **`lib/dal/student.ts` is the portal's only read path** for lesson notes, and
  it never selects `lesson_note.notes_private`. Keep the explicit column lists.
- **No `proxy.ts`** — it can't be deployed on Cloudflare with Next 16. Auth is
  checked in each page, action and route handler instead.
- **Deploy runs on Workers**, not Node. Use Web Crypto, not `node:crypto`.
  Bindings come from `getCloudflareContext()`, never `process.env`.

Schema changes: edit `db/schema.ts`, then `npm run db:generate`, then
`npm run db:migrate:local`.
