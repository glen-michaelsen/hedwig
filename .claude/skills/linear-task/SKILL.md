---
name: linear-task
description: Work exactly one Linear issue from Todo labelled "Claude", ship it to the dev branch, and move it to Done. On any blocker or failure, return it to Todo and file a blocking issue labelled "Glen". Use when the user asks to work the Linear board, run the task loop, or pick up the next Claude task.
---

# Linear task loop

Work **exactly one** issue this run. Every run must end with the issue in a
correct terminal state — never stranded in progress.

## Config

Verified against the workspace on 2026-08-16 — these names exist, don't
invent variants.

| | |
| --- | --- |
| Linear team | `GM Consulting` (the only team) |
| Pick from state | `Todo` |
| Pick by label | `Claude` |
| Claimed state | `In Progress` |
| Success state | `Done` |
| Blocked/failed state | `Todo` |
| Blocking issue label | `Glen` |
| Ship branch | `dev` (never `main`) |

Other states on the board — `Backlog`, `Canceled`, `Duplicate` — are not
part of this loop. Never move an issue into them.

## Precondition

If Linear tools are unavailable this session, **say so and stop**. Do not guess
at the board, and do not do work you can't record. Same if the repo has
uncommitted changes you didn't make — report and stop rather than sweeping
someone else's work into your commit.

## Step 1 — pick one issue

Find candidate issues: state `Todo`, label `Claude`.

**Skip any issue that has an open blocking relation.** That is the whole point
of the blocked path below — a blocked issue must stay invisible to this loop
until its blocker is closed.

From what's left, take the **topmost in board order** (Linear's manual sort
order within the column, ascending). If sort order isn't exposed, fall back to
highest priority, then oldest created.

If nothing qualifies, **stop without changing anything** and say so.

## Step 2 — claim it

Set the issue to `In Progress` before doing any work, so a concurrent or later
run can't pick it up again.

## Step 3 — implement

1. Read `AGENTS.md` and `README.md` first. They are not optional context —
   they carry the tenancy rule, the light-theme rule, and the Next 16 caveats.
2. Sync: `git fetch origin` and base the work on **current `origin/dev`**,
   never a stale local snapshot.
3. Implement the issue fully. Ask for nothing mid-run — if you need an answer,
   that's the blocked path.
4. Verify, all three:
   ```bash
   npm run typecheck && npm run lint && npm run build
   ```
   A failure here is the failure path. Do not "fix" it by weakening the check.

### If the change adds a migration

Workers Builds does not run migrations, so schema-dependent code pushed
without applying one puts new code in front of an old database on preview.

- **Running locally** (wrangler is logged in): apply it to preview *before*
  pushing — `npm run db:migrate:preview`. If the migration itself fails,
  that's the failure path.
- **Running in the cloud** (no Cloudflare credentials — check with
  `npx wrangler whoami`): you cannot apply it. Take the **blocked path**
  instead: commit nothing, and file the `Glen` issue saying the change needs
  a migration applied by hand. Pushing schema code you can't migrate is worse
  than not shipping it.

## Step 4 — ship to dev

Commit and push straight to `dev`. No pull requests, no feature branches.

**Verify the push actually landed** before going further: the command must exit
cleanly *and* the commit must be present on `origin/dev` (`git fetch origin`,
then confirm). Do not proceed on an unconfirmed push.

## Step 5 — report

Only after a confirmed push:

1. Comment on the issue with what shipped and the commit SHA.
2. Set the issue to `Done`.

Note in the comment that it's live on **preview.trenodo.com**, not production —
reaching production takes a separate `dev` → `main` merge that a human does.

## Blocked path

Needs a decision, a credential, an answer, or access you don't have.

1. Comment on the issue describing exactly what's needed and what you tried.
2. Create a **new issue** labelled `Glen` describing the blocker.
3. Link it as **blocking** the original issue.
4. Set the original back to `Todo`.
5. Stop.

The relation is what matters: step 1 skips blocked issues, so the original
won't be picked up again until the `Glen` issue is closed.

## Failure path

Build fails, push is refused, migration errors, or anything you can't resolve.

Same as the blocked path, but the comment carries the **exact command and its
error output**, not a paraphrase. If a push is refused, never fall back to a
pull request or another branch — report and stop.

Leave the working tree clean: if you committed locally but couldn't push, say
so explicitly in the comment so the next run isn't surprised by it.

## Hard rules

- Exactly one issue per run.
- Never push to `main`. Never open a PR or a feature branch.
- Never leave an issue in `In Progress` at the end of a run. Terminal states
  are `Done` (shipped) or `Todo` + a `Glen` blocker (blocked or failed).
- Never weaken a check to make it pass.
- The tenancy rule in `AGENTS.md` outranks any issue description: a query that
  isn't scoped by account is a data leak, whatever the ticket says.
