# Trenodo

Tools for working musicians, at **trenodo.com**. Tutor — study material and
lesson notes, with a low-friction portal for students — is the first one.

> The Worker, D1 database and R2 bucket are all still named `hedwig`. That's
> the codename, not the brand: renaming the database would mean migrating the
> data, and renaming the Worker would break its self-reference binding.

Each musician gets a workspace. Students don't have accounts — they sign in
with their phone number and a 4-digit PIN their tutor hands them.

A phone number can belong to several students: siblings at the same studio
usually share a parent's mobile. The PIN is what identifies who is signing in,
and if it somehow matches more than one of them, the portal asks which.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Student sign-in (phone + PIN) |
| `/account/login`, `/account/signup` | Musician sign-in |
| `/account` | Tool dashboard |
| `/account/settings` | Account settings |
| `/tutor/*` | Tutor — the teaching tool |
| `/bio` | Link in Bio editor |
| `/@handle` | Public bio page |
| `/i/*` | Public images (bio avatars and backgrounds) |
| `/s/*` | Student portal |
| `/admin/*` | Permanent redirects to the above |

Trenodo is a toolbox for working musicians; Tutor (teaching) is the first
tool. `docs/link-in-bio.md` specs the second.

## Design system

Tokens live in `app/globals.css`; primitives in `app/_components/ui.tsx`.
Nothing should hardcode a colour — use the semantic utilities
(`bg-surface`, `text-muted`, `border-line`, `shadow-soft`) so both themes
stay correct.

- **Light only, deliberately.** The audience is parents, children and
  tutors, so the product is warm ivory (`#fdfaf6`) with white cards, warm
  grey text, and no dark mode. `color-scheme: light` is pinned so native
  date pickers and selects stay light even on a dark OS.
- **The `dark:` variant is rebound** to a `.dark` class that nothing sets
  (`@custom-variant dark` at the top of `globals.css`). Dark utilities left
  in the components are therefore inert instead of firing off the visitor's
  OS setting and half-repainting the page. To bring dark mode back: set
  `.dark` on `<html>` and restore the token overrides — no component
  changes needed.
- **Brand** is a muted violet defined as an OKLCH scale, `brand-50` to
  `brand-900`. `brand-600` (#825abe) is the primary.
- **Neutrals are warm** (hue ~62–78, not blue-grey) — that's most of what
  makes it feel welcoming rather than clinical. `muted` and `faint` are
  both kept dark enough to clear WCAG AA on the ivory background; get
  hierarchy from size and weight, not by fading text further.
- **Shadows** are large, low-opacity and warm-tinted rather than black.
- `Card`, `Panel`/`PanelList`, `PageHeader`, `SectionTitle`, `Empty`,
  `Pill`, `KindBadge` and the `button*` / `input*` class strings cover
  almost everything. Reach for those before writing new markup.

## Stack

- **Next.js 16** (App Router) on **Cloudflare Workers** via `@opennextjs/cloudflare`
- **D1** + **Drizzle ORM**
- **R2** for PDFs — never public, always streamed through an authorized route
- **Better Auth** (email + password) for tutors

## Setup

```bash
npm install
```

Create the D1 database and paste the id into `wrangler.jsonc`:

```bash
npx wrangler d1 create hedwig
```

Create the R2 bucket:

```bash
npx wrangler r2 bucket create hedwig-media
```

Local secrets — copy `.dev.vars.example` to `.dev.vars` and fill both values
with `openssl rand -base64 32`. Then apply migrations and start the dev server:

```bash
npm run db:migrate:local && npm run dev
```

Visit `/account/signup` to create an account, add a student, and note the PIN it
shows you — the PIN is hashed, so that screen is the only time it exists in
plaintext.

## Environments

| | Branch | URL | Worker | Database | Bucket |
| --- | --- | --- | --- | --- | --- |
| Production | `main` | trenodo.com | `hedwig` | `hedwig` | `hedwig-media` |
| Preview | `dev` | preview.trenodo.com | `hedwig-preview` | `hedwig-preview` | `hedwig-media-preview` |

Preview is a **separate Worker with its own database, bucket and secrets**.
A preview that shares production's data isn't a preview — it's production
with a different hostname. Sessions don't transfer between the two, because
the signing secrets differ.

Work on `dev` → it deploys to preview. Merge `dev` → `main` to release.

## Deploying

Pushing to `main` triggers a Cloudflare **Workers Build**, which runs
`npm run cf:build` and deploys. Pushing to `dev` does the same for preview.
Node is pinned to 22 by `.node-version`.

> **Workers Builds does not run migrations.** If a change includes a new file
> in `drizzle/`, apply it *before* the code lands — `npm run db:migrate:preview`
> before pushing to `dev`, and `npm run db:migrate` before merging to `main`.
> Otherwise the new code runs against the old schema. Migrations here are
> additive, so applying one early is safe; applying one late is not.

To deploy by hand (or to roll back):

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put STUDENT_SESSION_SECRET
npm run db:migrate
npm run cf:deploy
```

Set `APP_URL` in `wrangler.jsonc` to the production origin before deploying —
Better Auth uses it as its base URL.

Workers **Paid** is assumed. Password hashing alone exceeds the free plan's
10 ms CPU limit per request.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next dev server, with real D1/R2 bindings |
| `npm run db:generate` | Drizzle → SQL migration in `drizzle/` |
| `npm run db:migrate:local` | Apply migrations to the local D1 |
| `npm run db:migrate` | Apply migrations to the remote D1 |
| `npm run cf:types` | Regenerate `worker-configuration.d.ts` |
| `npm run cf:preview` | Build the Worker and serve it with wrangler |
| `npm run cf:deploy` | Build and deploy |

## How the pieces fit

```
tutor (= Better Auth user)
 ├── student ──── access (phone, pin_hash, generation)
 │     ├── shelf ──────────► material    permanent, tutor-pinned
 │     └── lesson_note ────► material    weekly, via note_material
 └── material ─── material_tag ─── tag
```

The **lesson note is the delivery mechanism**: a tutor writes up a lesson,
attaches material to it, and the student sees it in their feed. The **shelf** is
for things that should stay available regardless of which lesson they came from.

### Security notes

- `lesson_note.notes_private` is tutor-only. `lib/dal/student.ts` is the single
  module the portal reads notes through, and it selects columns explicitly.
  Don't introduce a bare `select()` there.
- Student PDFs are served by `app/s/m/[id]/route.ts`, which checks the material
  is on that student's shelf or attached to one of their shared notes before
  streaming it. R2 keys never reach the browser.
- Issuing a new PIN bumps `access.generation`, which invalidates every cookie
  already issued to that student.
- Failed sign-ins are counted in `phone_lockout`, keyed on the **phone number**
  rather than the student: 3 tries, then 30 minutes. Counting per student would
  let one sibling's typos lock the other out, and would leave a shared number
  with no real limit. Since the identifier is now knowable, this lockout is the
  main thing protecting a 4-digit PIN — don't loosen it without adding
  Turnstile first.
- Phone numbers are stored as E.164 and nothing else. `lib/phone.ts` parses and
  validates with `libphonenumber-js`, defaulting to `DK` only when a number
  arrives without a country code — the UI always sends one.
- `app/_components/phone-input.tsx` is the single entry point for typing a
  number: country selector with flag and dial code, as-you-type national
  formatting, and a hidden E.164 field that is what actually gets submitted.
  Its country names are pinned to English on purpose; see the comment there.

### There is no `proxy.ts`

Next 16 renamed Middleware to Proxy and made it Node.js-only;
`@opennextjs/cloudflare` refuses to build a Worker that has one. Authorization
is therefore enforced in each page, Server Action and route handler — via
`requireAccount()` or `getStudentSession()` — which is where the framework docs
say it belongs anyway. Don't add a `proxy.ts` back without checking whether
OpenNext has since gained support.

## Not built yet

- **Turnstile** on the student sign-in form. The lockout stops one code being
  hammered; it doesn't stop a sweep across the code space.
- **Storage quotas.** `material.size_bytes` is recorded but nothing enforces a
  per-tutor cap.
- **Link-rot cron.** `material.link_ok` and `link_checked_at` exist for a weekly
  Cron Trigger that HEADs every link; the trigger isn't written.
- **Consent record for minors.** `parent_email` is stored, but there's no
  consent timestamp or data-deletion flow beyond deleting the student.
- **Email.** No transactional email at all yet — no password reset for tutors.
