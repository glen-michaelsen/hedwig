# Link in Bio — build spec

Status: **v1 shipped.** Source of truth for the feature; update it here
rather than in chat.

Shipped in v1: handle claim with reserved words and old-handle redirects,
six theme presets, custom accent and background (solid / gradient / photo)
with derived contrast, avatar upload, Link / Text / Music / Video blocks with
reorder and per-block visibility, social row, publish toggle, public page at
`/@handle`, page views and per-block click counts.

Deferred from v1 — see Phasing:
- Live preview in the editor (the page is one click away instead)
- Edge caching of the public page; it's server-rendered per request today,
  which is also how views are counted. Both change together.
- Social icons — the row renders text pills for now.

Trenodo (codename hedwig) becomes a **musician's toolbox**. The account owner is a musician who
may teach, release, gig, or all three. Tutoring is one tool among several.

```
account (musician)
 ├── Tutor         teaching — students, library, lesson notes   built
 ├── Link in Bio   public page(s)                               this spec
 └── Press Kit     EPK                                          later
```

The reason to build this inside Trenodo rather than point people at Linktree:
**blocks can address the other tools.** A tutor's page links straight to their
student portal; an artist's will link to their press kit. Nothing else can do
that.

## Decisions

| Decision | Choice |
| --- | --- |
| App shell | Tutoring moves to `/tutor/*` (was briefly `/studio`); `/admin/*` redirects |
| Public URL | `trenodo.com/@handle` |
| v1 blocks | Link, Text, Social icons, Player, Video |
| Theming | Curated presets **plus** custom accent and background |

Explicitly **not** in v1: release smart links, pre-save, tour dates, email
capture, custom domains, multiple pages per account.

---

## Phase 0 — platform restructure

Do this before the second tool exists. It gets more expensive with every
feature added, and right now there is one tutor and one student in production.

**Routes**

| Now | After |
| --- | --- |
| `/admin` | `/` when signed in → tool dashboard |
| `/admin/students/*` | `/studio/students/*` |
| `/admin/library/*` | `/studio/library/*` |
| `/admin/settings` | `/account/settings` |
| `/admin/login`, `/admin/signup` | `/login`… see below |
| — | `/@handle` (public bio) |
| `/s/*` | unchanged (student portal) |

Sign-in is currently split: students at `/login`, tutors at `/admin/login`.
With multiple tools, "tutor" stops being the right word for the account. Keep
two doors but rename: `/login` stays the student door, `/account/login`
becomes the musician door. The landing page's Student / Tutor buttons become
Student / Musician.

**Redirects.** Keep `/admin/*` working permanently — QR codes and bookmarks
exist. A `redirects` entry in `next.config.ts` is enough; no proxy needed.

**Naming in code.** `requireTutor()` → `requireAccount()`, `Tutor` type →
`Account`. The DB column `student.tutor_id` can stay — renaming it means a
migration for no behavioural gain, same call as `parent_email`.

**Landing page.** Stops being "software for music tutors". Hero speaks to
musicians; a section per tool; tutoring keeps a deeper page of its own.

---

## Data model

```
bio_page
  id, account_id, handle (unique), title, tagline, avatar_key,
  theme_preset, accent_color?, background_kind, background_value?,
  published (bool), created_at, updated_at

bio_handle_history
  handle (pk), page_id, changed_at        -- old handles keep redirecting

bio_block
  id, page_id, kind, position, visible (bool), config (json)

bio_social
  id, page_id, platform, url, position    -- icon row, not a block

bio_view / bio_click                       -- see Analytics
```

`config` as JSON is deliberate: block kinds will multiply, and a column per
kind means a migration per idea. Validate each kind's shape with zod at the
edge of the action, not in the database.

**Block kinds in v1**

| kind | config |
| --- | --- |
| `link` | `{ label, url, description?, thumbnailKey? }` |
| `text` | `{ variant: "heading" \| "paragraph" \| "divider", value? }` |
| `player` | `{ url, provider }` — Spotify, Apple, Bandcamp, SoundCloud |
| `video` | `{ url, provider }` — YouTube, Vimeo |

Social icons are separate from blocks because they pin to the header and are
laid out as a row, not a stack.

**Ordering.** `position` as a plain integer, reindexed across the whole page
on every reorder. A page has tens of blocks, not thousands — fractional
indexing is not worth the complexity here.

---

## Handles

- `^[a-z0-9](?:[a-z0-9_.-]{1,28}[a-z0-9])$` — lowercase, no leading or
  trailing punctuation, 3–30 chars.
- Reserved list must include every current and plausible top-level route:
  `admin, account, api, login, logout, s, studio, bio, press, help, about,
  terms, privacy, support, settings, static, _next, assets, i, new, me`.
  Add to it whenever a top-level route is added — a handle that shadows a
  route is a broken app, not a broken page.
- Changing a handle writes the old one to `bio_handle_history` and redirects
  it permanently. Printed QR codes and Instagram bios outlive handle changes.

---

## Public page

`/@handle` is the only page in Trenodo a stranger sees, so it has different
constraints from everything built so far.

**Rendering.** Read-mostly and public: cache at the edge and purge on save,
rather than hitting D1 per request. This means enabling the OpenNext
incremental cache that `open-next.config.ts` currently omits (R2-backed), and
tagging the page so a save can `revalidateTag`. Without it, every visit from a
shared Instagram link is a database read.

**Images.** The R2 bucket is entirely private today — every read goes through
an ownership check. Bio avatars and backgrounds are public by nature, so they
need a separate path: store them under a `public/` key prefix and serve them
from a route that only ever serves that prefix. Do **not** loosen the existing
`/s/m/[id]` route or the bucket itself; sheet music and a profile photo have
opposite requirements.

**Social sharing.** Per-page OG image with the avatar, name and tagline.
Verify `next/og` works under OpenNext on Workers before promising it — if it
doesn't, fall back to the uploaded avatar as a static OG image.

**No app chrome.** The public page renders none of Trenodo's header, footer or
navigation. A small "Made with Trenodo" mark is the only tie back, and it's
also the growth loop.

---

## Theming

The public page carries **its own theme**, independent of Trenodo's admin UI.
The app is pinned light; a bio page may be dark, and that's the artist's call.

Implement as a scoped token set: the page wrapper sets `--bio-bg`,
`--bio-fg`, `--bio-accent`, `--bio-muted`, `--bio-card` as inline styles, and
every element inside reads only from those. Never reuse the app's semantic
tokens (`bg-surface`, `text-muted`) inside the public page — they're pinned to
the admin palette and will fight the artist's choices.

**Presets** ship as complete sets (ground, accent, type pairing, button
shape). 6–8 of them, each actually designed.

**Custom accent and background** layer on top:

- `background_kind`: `preset | solid | gradient | image | video`
- `accent_color`: any hex

**Contrast is the risk in letting people pick colours.** Someone will choose
pale yellow on white and publish a page nobody can read — and unlike the admin
UI, this one is seen by their audience. Handle it in two places:

1. **Derive, don't ask.** Text colour on the accent (button labels) is
   computed from the accent's relative luminance — white or near-black,
   whichever passes. Same for text over a solid background. The artist picks
   one colour; the system picks the colour that has to work with it.
2. **Warn, don't block.** If a custom combination falls below 4.5:1, the
   editor says so plainly next to the swatch. It's their page — but they
   should know.

Image and video backgrounds get an automatic scrim behind text, strength
derived from the theme, because you cannot know what the photo looks like.

---

## Editor

`/studio/bio` — or `/bio` once the tool dashboard exists.

- Block list with drag-to-reorder. Start with **move up / move down buttons**:
  they're accessible for free, work on touch, and cost nothing. Add drag on
  top later if it's missed, keeping the buttons as the keyboard path.
- "Add block" opens the shared `Modal` with the kinds as cards.
- Each block edits in place; per-block visibility toggle so something can be
  hidden without deleting it.
- **Live preview** in a phone-shaped frame beside the list on desktop, behind
  a toggle on mobile.
- Publish state: `published` boolean. Edits to a published page go live
  immediately — no draft/publish split in v1. Say so in the UI ("Changes are
  live") so nobody is surprised.

Reuse what already exists: `Modal`, `TagPicker`'s interaction pattern for
socials, `PhoneInput`'s hidden-field trick for structured values, and the
`actionPill` / `Card` / `SectionTitle` primitives.

---

## Analytics

v1 records two things: page views and block clicks.

Start in D1 (`bio_view`, `bio_click`, aggregated nightly or on read at this
volume) because it's one binding and no new concepts. **Switch to Workers
Analytics Engine before a page gets real traffic** — a click is a write, and a
successful artist's link in bio will produce more writes than D1 should be
asked to absorb. The switch point is roughly "any page doing thousands of
views a day"; make it a deliberate migration, not an emergency.

Show the artist: views over time, clicks per block, and top referrers. Don't
show a dashboard of vanity numbers — clicks per block is the one that changes
what they do next.

---

## Phasing

**v1 — a page worth publishing**
Handle + reserved words, presets, custom accent/background with the contrast
guard, avatar upload, Link / Text / Social / Player / Video blocks, reorder,
publish toggle, public page with edge caching, basic view + click counts.

**v2 — the music layer**
Releases with per-platform links, smart platform routing, tour dates, email
capture, proper analytics on Analytics Engine.

**v3 — the moat**
Pre-save (OAuth per platform, encrypted refresh tokens, a Cron Trigger firing
on release day), custom domains via Cloudflare for SaaS, one page per release,
Press Kit tie-in.

---

## Risks

- **Handle namespace collisions.** Mitigated by the reserved list, but it has
  to be updated whenever a top-level route is added. Worth a test that asserts
  every top-level route segment appears in the reserved list.
- **Public images loosening R2.** The temptation is to make the bucket public.
  Don't — a separate prefix and route keeps sheet music private.
- **Custom colours producing unreadable pages.** Handled by derivation plus a
  warning, above.
- **Pre-save is a different class of feature.** Storing third-party refresh
  tokens and firing scheduled writes into fans' accounts carries obligations
  the rest of this app doesn't. Don't let it into v1 by accident.
- **`next/og` under OpenNext** is unverified on this stack.
