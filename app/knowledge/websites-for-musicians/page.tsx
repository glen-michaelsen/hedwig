import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../_components/guide-layout";
import { TermLink } from "@/app/_components/term-link";
import { focusable } from "@/app/_components/ui";

/*
 * Other people's sites, picked for musicians. The rule for what gets in:
 * useful to the same people Trenodo is for, and not a rival to anything
 * Trenodo does. So no link-in-bio sites, EPK builders, setlist apps or
 * lesson admin tools, however good. Prices change, so cards say Free,
 * Freemium or Paid rather than amounts. Check the list twice a year and
 * move LAST_REVIEWED when you do. It goes to search engines as the
 * article's last-modified date, not onto the page.
 */

const LAST_REVIEWED = "2026-10-04";

type Price = "Free" | "Freemium" | "Paid";

type Site = {
  name: string;
  url: string;
  price: Price;
  what: string;
  bestFor: string;
  /**
   * The site's own app icon, downloaded once into
   * public/images/knowledge/websites/<icon>.png (160 px) and served from
   * here, so no visitor's browser calls 28 other sites. Left out where a
   * site only publishes a tiny favicon: the card shows a letter instead.
   */
  icon?: string;
};

type Group = {
  id: string;
  title: string;
  intro: string;
  sites: Site[];
};

const GROUPS: Group[] = [
  {
    id: "practice",
    title: "Practice and play along",
    intro: "A band that's always free on a Tuesday night. These make practice feel less like homework.",
    sites: [
      {
        name: "Acoustic Backs and Tracks",
        url: "https://www.acousticbacksandtracks.com",
        price: "Paid",
        what: "Acoustic guitar and piano backing tracks of popular songs, from classics to this year's hits. Bought one track at a time, with custom tracks on request.",
        bestFor: "Singers who play weddings, events and solo gigs",
        icon: "acousticbacksandtracks",
      },
      {
        name: "Karaoke-Version",
        url: "https://www.karaoke-version.com",
        price: "Paid",
        what: "Backing tracks where you can mute any single instrument, so you can play the guitar part while the rest of the band keeps going.",
        bestFor: "Learning your part inside the full song",
        icon: "karaoke-version",
      },
      {
        name: "Moises",
        url: "https://moises.ai",
        price: "Freemium",
        what: "Splits any song into vocals, drums, bass and the rest. Slow it down, change the key, loop the tricky bar.",
        bestFor: "Working out a part by ear",
        icon: "moises",
      },
      {
        name: "Chordify",
        url: "https://chordify.net",
        price: "Freemium",
        what: "Shows the chords of a song in time with the recording, so you can play along as it runs.",
        bestFor: "Strumming along to songs you love",
        icon: "chordify",
      },
      {
        name: "Ultimate Guitar",
        url: "https://www.ultimate-guitar.com",
        price: "Freemium",
        what: "The biggest library of guitar and bass tabs and chord charts, rated by the people who use them.",
        bestFor: "Finding how a song is played",
        icon: "ultimate-guitar",
      },
    ],
  },
  {
    id: "learn",
    title: "Learn and read music",
    intro: "For the days you want to understand why it works, not just that it does.",
    sites: [
      {
        name: "musictheory.net",
        url: "https://www.musictheory.net",
        price: "Free",
        what: "Short, clear theory lessons with exercises for notes, intervals, keys and chords. A classic for a reason.",
        bestFor: "Theory in small, daily bites",
        icon: "musictheory",
      },
      {
        name: "JustinGuitar",
        url: "https://www.justinguitar.com",
        price: "Free",
        what: "A complete guitar course in order, from your first chord onwards. Free lessons, with an app if you want one.",
        bestFor: "Teaching yourself guitar with a plan",
        icon: "justinguitar",
      },
      {
        name: "MuseScore",
        url: "https://musescore.org",
        price: "Free",
        what: "Free software for writing sheet music, with a large community library of scores to start from.",
        bestFor: "Writing out parts and arrangements",
        icon: "musescore",
      },
      {
        name: "IMSLP",
        url: "https://imslp.org",
        price: "Free",
        what: "A huge library of sheet music that's out of copyright. Bach to Debussy, free to download.",
        bestFor: "Classical repertoire",
        icon: "imslp",
      },
      {
        name: "Musicnotes",
        url: "https://www.musicnotes.com",
        price: "Paid",
        what: "Licensed sheet music for pop, rock and film songs, bought one song at a time.",
        bestFor: "Proper, legal sheet music for modern songs",
      },
    ],
  },
  {
    id: "record",
    title: "Record and produce",
    intro: "You don't need a big studio to sound good. You need one of these and a quiet room.",
    sites: [
      {
        name: "GarageBand",
        url: "https://www.apple.com/mac/garageband/",
        price: "Free",
        what: "Apple's free recording app for Mac, iPhone and iPad. Easy to start, and more capable than it looks.",
        bestFor: "Your first recordings on Apple gear",
        icon: "garageband",
      },
      {
        name: "BandLab",
        url: "https://www.bandlab.com",
        price: "Free",
        what: "A free recording studio in your browser and on your phone, with ways to work on a track together.",
        bestFor: "Recording on any device, and with others",
      },
      {
        name: "Audacity",
        url: "https://www.audacityteam.org",
        price: "Free",
        what: "A free audio editor for cutting, cleaning up and exporting recordings. Simple, and it runs anywhere.",
        bestFor: "Quick edits and voice recordings",
        icon: "audacity",
      },
      {
        name: "Reaper",
        url: "https://www.reaper.fm",
        price: "Paid",
        what: "A full professional recording program with a fair price and a long free trial.",
        bestFor: "Stepping up from your first studio app",
      },
      {
        name: "Komplete Start",
        url: "https://www.native-instruments.com/en/products/komplete/bundles/komplete-start/",
        price: "Free",
        what: "A free bundle from Native Instruments: synths, sampled instruments, effects and hundreds of sounds to play in your recording software.",
        bestFor: "Adding sounds you can't record yourself",
        icon: "komplete-start",
      },
      {
        name: "Freesound",
        url: "https://freesound.org",
        price: "Free",
        what: "A big shared library of sounds and field recordings. Check each sound's licence before you use it.",
        bestFor: "Rain, rooms, birds and textures",
        icon: "freesound",
      },
      {
        name: "Splice",
        url: "https://splice.com",
        price: "Paid",
        what: "A subscription library of samples and loops, cleared for use in your own releases.",
        bestFor: "Producers building tracks from loops",
        icon: "splice",
      },
    ],
  },
  {
    id: "release",
    title: "Release and get paid",
    intro: "The unglamorous part that pays the rent. Well, some of the rent.",
    sites: [
      {
        name: "DistroKid",
        url: "https://distrokid.com",
        price: "Paid",
        what: "Gets your music onto Spotify, Apple Music, TikTok and the rest for a yearly fee, with unlimited releases.",
        bestFor: "Artists who release often",
        icon: "distrokid",
      },
      {
        name: "CD Baby",
        url: "https://cdbaby.com",
        price: "Paid",
        what: "Distribution to the streaming services, paid per release instead of per year.",
        bestFor: "Artists who release now and then",
        icon: "cdbaby",
      },
      {
        name: "Spotify for Artists",
        url: "https://artists.spotify.com",
        price: "Free",
        what: "Your free dashboard for Spotify: who listens, where, and from which playlists. You can also pitch new songs to Spotify's editors here.",
        bestFor: "Every artist on Spotify",
        icon: "spotify-for-artists",
      },
      {
        name: "Apple Music for Artists",
        url: "https://artists.apple.com",
        price: "Free",
        what: "The same for Apple Music and Shazam: plays, listeners and where they are.",
        bestFor: "Every artist on Apple Music",
        icon: "apple-music-for-artists",
      },
      {
        name: "Songtrust",
        url: "https://www.songtrust.com",
        price: "Paid",
        what: "Collects the songwriting royalties that streaming alone doesn't pay you, from collecting societies around the world.",
        bestFor: "Songwriters releasing their own songs",
        icon: "songtrust",
      },
      {
        name: "Your collecting society",
        url: "https://www.cisac.org",
        price: "Free",
        what: "Koda in Denmark, PRS in the UK, ASCAP or BMI in the US. They pay you when your songs are played on radio, TV and at gigs. CISAC lists them all.",
        bestFor: "Anyone whose songs get played in public",
      },
    ],
  },
  {
    id: "promote",
    title: "Promote and find people",
    intro: "Good music still needs a little push. And sometimes a drummer.",
    sites: [
      {
        name: "Canva",
        url: "https://www.canva.com",
        price: "Freemium",
        what: "Easy design for cover art, posters and social posts, with templates sized for every platform.",
        bestFor: "Looking good without a designer",
        icon: "canva",
      },
      {
        name: "Bandsintown for Artists",
        url: "https://artists.bandsintown.com",
        price: "Freemium",
        what: "Add your gigs once, and fans who follow you get told when you play near them.",
        bestFor: "Artists who play live",
        icon: "bandsintown",
      },
      {
        name: "SubmitHub",
        url: "https://www.submithub.com",
        price: "Freemium",
        what: "Send your song to blogs, playlists and radio, and get an answer from each one, even if it's a no.",
        bestFor: "Pitching a new single",
      },
      {
        name: "Groover",
        url: "https://groover.co",
        price: "Paid",
        what: "Pitch to curators, labels and media, mostly in Europe, with a guaranteed reply.",
        bestFor: "Reaching European blogs and radio",
        icon: "groover",
      },
      {
        name: "Kompoz",
        url: "https://www.kompoz.com",
        price: "Freemium",
        what: "Find musicians online to finish a song with. Upload a part, and others add theirs.",
        bestFor: "Collaborating without a rehearsal room",
        icon: "kompoz",
      },
    ],
  },
];

const COUNT = GROUPS.reduce((sum, group) => sum + group.sites.length, 0);

const TITLE = `Useful Websites for Musicians: ${COUNT} Picks Worth Bookmarking`;

const PAGE_DESCRIPTION = `${COUNT} useful websites for musicians: backing tracks, theory, free recording software, distribution, royalties and promotion. Picked for players, singers and songwriters.`;

export const metadata: Metadata = {
  title: `${TITLE} | Trenodo`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/websites-for-musicians" },
  openGraph: {
    title: TITLE,
    description: PAGE_DESCRIPTION,
    url: "/knowledge/websites-for-musicians",
    siteName: "Trenodo",
    type: "article",
    images: ["/images/knowledge/journey/useful-websites.jpg"],
  },
};

const FAQS = [
  {
    q: "What is the best free recording software for beginners?",
    a: "GarageBand if you have a Mac, iPhone or iPad. BandLab if you don't: it runs in the browser and on any phone. Both are free, and both are enough for your first real recordings.",
  },
  {
    q: "How do I get my music on Spotify?",
    a: "Through a distributor. You can't upload to Spotify directly. DistroKid suits artists who release often, CD Baby suits those who release now and then. Once you're live, claim your Spotify for Artists profile to see your stats and pitch new songs.",
  },
  {
    q: "Where can I find backing tracks to sing or play over?",
    a: "Acoustic Backs and Tracks for acoustic guitar and piano versions of popular songs, ready for a gig. Karaoke-Version if you want the full band with one instrument muted. Moises if you want to make your own from a song you already have.",
  },
  {
    q: "Do I get paid when my songs are played on the radio or at gigs?",
    a: "You can, but streaming payouts don't cover it. Join your collecting society, like Koda, PRS or ASCAP, and register your songs. A publishing service like Songtrust can collect the rest from abroad.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
      dateModified: LAST_REVIEWED,
      image: "https://trenodo.com/images/knowledge/journey/useful-websites.jpg",
    },
    {
      "@type": "ItemList",
      name: TITLE,
      numberOfItems: COUNT,
      itemListElement: GROUPS.flatMap((group) => group.sites).map((site, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: site.name,
        url: site.url,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

const PRICE_STYLES: Record<Price, string> = {
  Free: "bg-emerald-500/12 text-emerald-700",
  Freemium: "bg-brand-500/10 text-brand-700",
  Paid: "bg-surface-muted text-muted",
};

function SiteIcon({ site, className = "h-12 w-12" }: { site: Site; className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-surface ${className}`}
    >
      {site.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/knowledge/websites/${site.icon}.png`}
          alt=""
          width={160}
          height={160}
          loading="lazy"
          className="h-3/4 w-3/4 rounded-lg object-contain"
        />
      ) : (
        <span className="text-lg font-semibold text-brand-700" aria-hidden="true">
          {site.name.charAt(0)}
        </span>
      )}
    </span>
  );
}

function SiteCard({ site }: { site: Site }) {
  const host = new URL(site.url).hostname.replace(/^www\./, "");
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener"
      className={`group flex flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift ${focusable}`}
    >
      <div className="flex items-start gap-3.5">
        <SiteIcon site={site} className="h-12 w-12 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand-700">
              {site.name}
              <span className="ml-1 text-faint transition-colors group-hover:text-brand-600" aria-hidden="true">
                ↗
              </span>
            </h3>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${PRICE_STYLES[site.price]}`}>
              {site.price}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-faint">{host}</p>
        </div>
      </div>
      <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted text-pretty">{site.what}</p>
      <p className="mt-3 text-xs text-faint">
        <span className="font-semibold text-muted">Best for:</span> {site.bestFor}
      </p>
    </a>
  );
}

export default function WebsitesForMusiciansPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        title={TITLE}
        intro={`The internet is full of tools for musicians, and most of them want your email before they're any use. These are the ones we'd actually bookmark: for practice, learning, recording, releasing and getting heard. ${COUNT} picks, no fluff. 🔖`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/knowledge/websites-banner.jpg"
          alt="A musician at her desk planning releases, recordings and gigs on a project board"
          width={1254}
          height={705}
          className="aspect-video w-full rounded-4xl object-cover shadow-lift"
        />

        <nav aria-label="On this page">
          <ul className="grid gap-3 sm:grid-cols-2">
            {GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className={`group flex items-center gap-4 rounded-3xl border border-line bg-surface px-4 py-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-line-strong ${focusable}`}
                >
                  {/* The group's first three icons, fanned like a hand of cards. */}
                  <span className="flex shrink-0 -space-x-3" aria-hidden="true">
                    {group.sites
                      .filter((site) => site.icon)
                      .slice(0, 3)
                      .map((site, index) => (
                        <SiteIcon
                          key={site.name}
                          site={site}
                          className={`h-10 w-10 ring-2 ring-surface transition-transform duration-300 ${
                            ["-rotate-6 group-hover:-rotate-12", "z-10 group-hover:-translate-y-1", "rotate-6 group-hover:rotate-12"][index]
                          }`}
                        />
                      ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-brand-700">
                      {group.title}
                    </span>
                    <span className="block text-xs text-faint">{group.sites.length} sites</span>
                  </span>
                  <span className="text-brand-600 transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {GROUPS.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-balance">{group.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted text-pretty">{group.intro}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {group.sites.map((site) => (
                <SiteCard key={site.name} site={site} />
              ))}
            </div>
          </section>
        ))}

        <GuideSection title="And the rest is Trenodo">
          <p>
            Trenodo covers the rest, free for now: a{" "}
            <TermLink href="/link-in-bio">Link in Bio</TermLink> page for all
            your links, a <TermLink href="/press-kit">Press Kit</TermLink> for
            every release, a <TermLink href="/setlist">Setlist</TermLink> you
            can print, and <TermLink href="/tutoring">Tutor</TermLink> for
            teaching. And if your release is good, it might end up in the{" "}
            <TermLink href="/spotlight">Spotlight</TermLink>. 🎶
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
