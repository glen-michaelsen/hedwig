@AGENTS.md

# Branching: `dev` only

All work goes to `dev`. Push there and nowhere else.

`main` is production. A push to `main` deploys trenodo.com to real users, so
treat it as a deploy button rather than a branch:

- Never commit to `main`, merge into it, or push to it.
- Not to fix a bug, not to update a skill file, not because something looks
  urgent or trivial, and not because a task seems to require it.
- The **only** way code reaches `main` is Glen asking for it in those terms —
  "merge to prod", "ship it", "release". A request to build, fix or finish
  something is never also a request to deploy it.

This binds every agent working in this repo: interactive sessions, the Linear
task loop, and anything else holding a token.

## The production database follows the same rule

Applying a migration to production is part of shipping, not part of building.

- `npm run db:migrate:preview` — automation may run this.
- `npm run db:migrate` — production. A human runs this, at merge time.

D1 tokens are account-scoped, so Cloudflare cannot fence production off from
a token that can reach preview. This rule is the only thing keeping anything
out of it.

## What "done" means here

Work is done when it is on `dev` and verified on preview.trenodo.com. Leaving
it there is the correct end state, not an unfinished one.
