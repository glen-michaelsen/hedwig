# Moving muuv.dk into Trenodo

MUUV closes, and muuv.dk points at the Trenodo Worker. Every old URL answers
with a 301 to the closest Trenodo page, so the links and rankings MUUV built
carry over instead of breaking.

Source data: Search Console, exported 30 September 2026 (1,000 pages,
69,302 clicks), plus the "Top target pages" backlink report.

- `redirects.csv`: every page in the export (985 once `?ref=` and `#anchor`
  duplicates are merged), its traffic, and where it goes. `redirect_to` is
  the target today. `redirect_to_when_built` is the better target once that
  page exists; switch the redirect over when it ships.
- The section rules below catch everything else. Search Console stops at
  1,000 rows, so muuv.dk has URLs that aren't in the file.

## Pages to create

Ranked by the MUUV traffic they would take over. All English, all in the
Knowledge hub, which already has most of the neighbours.

| # | New page | Clicks | Impressions | Replaces |
|---|---|---:|---:|---|
| 1 | Song chord pages, e.g. `/knowledge/guitar/songs/what-a-wonderful-world` | 6,960 | ~200k | 9 chord sheet PDFs (What a Wonderful World 2,686 · Knockin' on Heaven's Door 2,481 · Hallelujah 700 · The Scientist 458 · Save Tonight 279 · When You Say Nothing at All 231 · House of the Rising Sun 106) |
| 2 | `/knowledge/guitar/easy-songs` | 2,257 | ~95k | "Songs with 2, 3 and 4 chords", beginner songs, sing-alongs |
| 3 | **Built.** `/knowledge/guitar/chords/<root>` (a, b-flat, b, c, c-sharp, d, e-flat, e, f, f-sharp, g, a-flat); the CSV now points here | 1,628 | 243k | 12 chord variation pages |
| 4 | **Built.** `/knowledge/promote/release-your-music` | 815 | 49k | Release on Spotify, Apple Music and the rest; sell online; pay per stream |
| 5 | `/knowledge/perform/gig-fees` | 773 | 64k | What to charge for a gig |
| 6 | `/knowledge/piano/scales` | 408 | 24k | Piano scales |
| 7 | `/knowledge/drums/anatomy` | 335 | 27k | The drum kit, piece by piece |
| 8 | `/knowledge/promote/social-media` | 101 | 7k | Social media for musicians (ranked 27th, room to grow) |
| 9 | `/knowledge/drums/beats` | 97 | 5k | Basic drum beats |
| 10 | `/knowledge/guitar/buying-your-first-guitar` | 95 | 8k | First guitar, plus what to buy with it |
| 11 | `/knowledge/drums/rudiments` | 95 | 4k | Sticking, paradiddles |
| 12 | `/knowledge/guitar/fretboard` | 85 | 17k | Learn the fretboard |
| 13 | `/knowledge/teach/pricing-lessons` | 53 | 3k | What music lessons cost |
| 14 | `/knowledge/perform/busking` | 34 | 2k | Busking |

Notes:

- **Song chord pages (1)** are the biggest prize, but tread carefully. Chords
  and a progression are fine. Lyrics are not: they're licensed, so the pages
  show chords, the strumming, and where the changes fall, never the words. Until they exist the
  PDFs go to the chord guide.
- **Chord roots (3)** earn more than their clicks suggest: 243k impressions
  at an average position around 6. One page per root matches how people
  search ("c akkord guitar").
- The existing piano chords page already takes the single biggest non-Danish
  page (4,175 clicks), so that one is covered.

## Covered already

About 11,400 clicks land on Trenodo pages that already exist: guitar chords,
scales, tuning, tabs, transposing, strings, anatomy; piano chords and anatomy;
bass scales and anatomy; theory (circle of fifths, scales and notes, chord
notation, overtones, concert pitch); vocals; recording; songwriting; press kit.

`/musik/danske-sangerinder.html` (4,667 clicks) goes to
`/discover/danish-female-singers`, which is live.

MUUV articles about artists with a Trenodo Spotlight go to that article.

## Skipped on purpose

These redirect somewhere sensible, but get no new page:

| Group | Clicks | Why |
|---|---:|---|
| X Factor winners, Toppen af Poppen, gold and platinum rules | 12,258 | Danish TV and charts |
| Kim Larsen chord sheets | 12,089 | Danish repertoire, and licensed lyrics on the sheets |
| MUUVtube video lessons (songs, children's songs) | 4,860 | Video lessons for Danish songs |
| Danish playlists (stille musik, julemusik, kærlighedssange) | 853 | Danish |
| Venue and music shop lists for Denmark | 1,113 | Danish, and they go stale |
| Super Bowl halftime shows, famous musicians with a diagnosis | 417 | Off topic for Trenodo |
| Shop (299 pages) | 2,674 | No shop on Trenodo |
| Teacher profiles and lesson pages (379 pages) | 3,717 | All go to Tutor |

## Section rules

In order; the first match wins. Query strings and `#anchors` are dropped
before matching, and every answer is a 301.

| Old URL | Goes to |
|---|---|
| `/` | `/` |
| `/log-ind*` | `/account/login` |
| `/musik/danske-sangerinder.html` | `/discover/danish-female-singers` |
| `/musik*` | `/discover` |
| `/blog/*` or `/artist/*` about an artist with a Spotlight | that Spotlight article |
| `/shop*` | `/` |
| `/musikunderviser*`, `/undervisning*`, `/underviserforespoergsel*` | `/tutoring` |
| `/muuvtube*` | `/knowledge/guitar/getting-started` |
| topic matches (chords, scales, tuning, theory terms, press kit…) | the matching Knowledge page, see the CSV |
| `/data/material/chords/*` | `/knowledge/guitar/chords` |
| `/selvstudie/…/guitar*`, `…/klaver*`, `…/bas*`, `…/trommer*`, `…/sang*`, `…/lydstudie*`, `…/musikteori*` | that instrument or topic hub |
| `/blog/musikinspiration*`, `/artist/*` (no Spotlight) | `/spotlight` |
| `/blog*` | `/knowledge` |
| `/selvstudie*`, `/guides*` | `/knowledge` |
| anything else | `/` |

## Doing the switch

1. Add muuv.dk (and www.muuv.dk) to the Worker as custom domains.
2. In the Worker, answer any request whose host is muuv.dk with the 301
   from these rules, before Next.js sees it.
3. In Search Console, verify trenodo.com and use **Change of address** from
   muuv.dk to trenodo.com.
4. Keep muuv.dk registered and redirecting for at least a year.
