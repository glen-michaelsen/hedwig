import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { TermLink } from "@/app/_components/term-link";
import { focusable } from "@/app/_components/ui";

/*
 * Written against how releasing works in autumn 2026: the 1,000-stream
 * rule on Spotify (since 2024), the end of Amuse's free plan (2024),
 * 3000 px covers, AI disclosure in credits. Distributor prices move every
 * year, so the page describes how each one charges, never an amount.
 * Re-check the distributor table and the Spotify rules once a year.
 */

const PAGE_DESCRIPTION =
  "How to release your music on Spotify, Apple Music, TikTok and every other store: what to prepare, how to choose a distributor, when to release, and how the money reaches you.";

const TITLE = "How to Release Your Music on Spotify, Apple Music and Everywhere Else";

export const metadata: Metadata = {
  title: `${TITLE} | Trenodo`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/promote/release-your-music" },
  openGraph: {
    title: TITLE,
    description: PAGE_DESCRIPTION,
    url: "/knowledge/promote/release-your-music",
    siteName: "Trenodo",
    type: "article",
  },
};

const CHECKLIST = [
  { item: "Master", format: "WAV, 16-bit 44.1 kHz or better", tip: "The final master. No MP3s." },
  { item: "Cover art", format: "Square JPG or PNG, 3000 × 3000 px", tip: "No web addresses, prices or blurry logos" },
  { item: "Artist name", format: "Spelled exactly as on your other releases", tip: "One letter off makes a second artist profile" },
  { item: "Credits", format: "Songwriters, producer, featured artists", tip: "Songwriter names are how royalties find you" },
  { item: "Release date", format: "A Friday, 3 to 4 weeks away", tip: "Never \"as soon as possible\"" },
  { item: "Explicit tag", format: "Yes or no, per track", tip: "Mark it, or the track can be pulled" },
  { item: "AI use", format: "Declared, if you used it", tip: "Vocals, instruments or production" },
  { item: "Lyrics", format: "Optional, but worth it", tip: "They show up in Spotify and Apple Music" },
] as const;

const DISTRIBUTORS = [
  { name: "DistroKid", url: "https://distrokid.com", model: "Yearly fee, unlimited releases", cut: "None", fit: "Artists who release often" },
  { name: "TuneCore", url: "https://www.tunecore.com", model: "Yearly plans, unlimited releases", cut: "None on paid plans", fit: "Artists who want publishing help in the same place" },
  { name: "CD Baby", url: "https://cdbaby.com", model: "One fee per release, no yearly fee", cut: "A small share", fit: "Artists who release now and then" },
  { name: "Ditto Music", url: "https://dittomusic.com", model: "Yearly fee, unlimited releases", cut: "None", fit: "A budget yearly option" },
  { name: "Amuse", url: "https://www.amuse.io", model: "Yearly plans. The free plan is gone.", cut: "None while you pay", fit: "Artists who want advances later" },
] as const;

const FAQS = [
  {
    q: "How long does it take to get my music on Spotify?",
    a: "The stores usually have it within a few days. But plan for 3 to 4 weeks between upload and release day. That's the time Spotify's editors need to hear your pitch, and the time you need to build up to the release.",
  },
  {
    q: "Do I keep the rights to my music?",
    a: "Yes, with every distributor named here. They deliver your music and collect the money; you still own it. Read the terms anyway, especially what happens to your songs if you stop paying.",
  },
  {
    q: "How much does Spotify pay per stream?",
    a: "Roughly 0.3 to 0.5 US cents per stream, but it changes with the listener's country and subscription. A track also needs at least 1,000 streams in a year before it earns anything on Spotify.",
  },
  {
    q: "Can I release a cover song?",
    a: "Yes, but you need a licence for the song, because someone else wrote it. Most distributors can arrange one for a fee. You don't need permission to record it, only the licence to release it.",
  },
  {
    q: "Can I change a song after it's out?",
    a: "You can fix the title, credits and some details. You can't swap the audio. A new mix means a new release, so listen to the master one last time before you upload. Twice, if you're honest with yourself.",
  },
  {
    q: "Do I need a record label?",
    a: "No. A distributor gets you into every store a label can. A label brings money, people and contacts, and takes a share for it. Plenty of artists release on their own first, and talk to labels once they have listeners.",
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
      dateModified: "2026-10-05",
    },
    {
      "@type": "HowTo",
      name: TITLE,
      step: [
        "Get the master, cover and credits ready",
        "Choose a distributor",
        "Upload 3 to 4 weeks before a Friday release",
        "Claim your artist profiles and pitch to Spotify's editors",
        "Share it everywhere on release day",
      ].map((text, index) => ({ "@type": "HowToStep", position: index + 1, text })),
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

const linkClass = `font-medium text-brand-600 hover:underline ${focusable} rounded`;
const tableWrap = "overflow-x-auto rounded-3xl border border-line bg-surface";
const thead = "bg-surface-muted/60 text-xs font-semibold uppercase tracking-[0.08em] text-muted";

export default function ReleaseYourMusicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, hand-written content only, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Promoting Your Music"
        categoryHref="/knowledge/promote"
        title={TITLE}
        intro="Anyone can put a song on Spotify today, no label needed. The upload takes ten minutes. Getting it heard takes a little planning. Here's how to do both. 🚀"
      >
        <GuideSection title="How it works">
          <p>
            You can&rsquo;t upload straight to Spotify or Apple Music. A
            distributor does it for you. You upload once, and they deliver
            your release to Spotify, Apple Music, YouTube Music, TikTok,
            Instagram, Amazon, Deezer, Tidal and many more. Then they collect
            what the stores pay and pass it on to you.
          </p>
          <p>
            You keep the rights. The distributor is a delivery service, not a
            label.
          </p>
        </GuideSection>

        <GuideSection title="1. Get everything ready">
          <p>Stores are strict. Have all of this ready before you start the upload:</p>
          <div className={tableWrap}>
            <table className="w-full text-left text-sm">
              <thead className={thead}>
                <tr>
                  <th scope="col" className="px-4 py-3">What</th>
                  <th scope="col" className="px-4 py-3">Format</th>
                  <th scope="col" className="hidden px-4 py-3 sm:table-cell">Tip</th>
                </tr>
              </thead>
              <tbody>
                {CHECKLIST.map((row) => (
                  <tr key={row.item} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-medium text-foreground">{row.item}</td>
                    <td className="px-4 py-3">{row.format}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">{row.tip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The codes stores need, ISRC for each track and UPC for the
            release, come free from your distributor. Covers and samples need
            permission: a song someone else wrote needs a licence, and so does
            a sample you didn&rsquo;t make.
          </p>
        </GuideSection>

        <GuideSection title="2. Choose a distributor">
          <p>
            They all reach the same big stores. The difference is how you pay.
            Release often? A yearly fee with unlimited releases is cheapest.
            Release once or twice a year? Paying per release can work out
            better.
          </p>
          <div className={tableWrap}>
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className={thead}>
                <tr>
                  <th scope="col" className="px-4 py-3">Distributor</th>
                  <th scope="col" className="px-4 py-3">How you pay</th>
                  <th scope="col" className="px-4 py-3">Their cut</th>
                  <th scope="col" className="px-4 py-3">Good for</th>
                </tr>
              </thead>
              <tbody>
                {DISTRIBUTORS.map((row) => (
                  <tr key={row.name} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <a href={row.url} target="_blank" rel="noopener" className={linkClass}>
                        {row.name}
                      </a>
                    </td>
                    <td className="px-4 py-3">{row.model}</td>
                    <td className="px-4 py-3">{row.cut}</td>
                    <td className="px-4 py-3">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Before you pick, check one thing: what happens to your music if
            you stop paying. Some take it down. Others keep it up and start
            taking a cut. Neither is wrong, but you want to know before, not
            after.
          </p>
        </GuideSection>

        <GuideSection title="3. Pick the date, then work backwards">
          <p>
            New music comes out on Fridays, worldwide. That&rsquo;s when the
            playlists refresh, so release on a Friday too.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">4 weeks before:</strong>{" "}
              upload to your distributor, with the release date set.
            </li>
            <li>
              <strong className="text-foreground">3 weeks before:</strong>{" "}
              pitch one song to Spotify&rsquo;s editors in Spotify for Artists.
              The last chance is 7 days before release day.
            </li>
            <li>
              <strong className="text-foreground">2 weeks before:</strong>{" "}
              share a pre-save link, and send your{" "}
              <TermLink href="/press-kit">Press Kit</TermLink> to blogs and
              radio. Our guide to{" "}
              <Link href="/knowledge/promote/press-kit" className={linkClass}>
                building a press kit
              </Link>{" "}
              shows what goes in.
            </li>
            <li>
              <strong className="text-foreground">Release day:</strong> post
              it everywhere, and put it at the top of your{" "}
              <TermLink href="/link-in-bio">Link in Bio</TermLink>.
            </li>
          </ul>
          <p>
            &ldquo;As soon as possible&rdquo; skips all of it. Your song comes
            out, and nobody knows. 🙈
          </p>
        </GuideSection>

        <GuideSection title="4. Claim your artist profiles">
          <p>
            Once your first release is in the stores, claim your free artist
            profiles. They give you your stats, a verified profile, and on
            Spotify, the pitch form.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <a href="https://artists.spotify.com" target="_blank" rel="noopener" className={linkClass}>
                Spotify for Artists
              </a>
              : pitching, your profile picture, and Canvas, the short loop
              that plays behind your song.
            </li>
            <li>
              <a href="https://artists.apple.com" target="_blank" rel="noopener" className={linkClass}>
                Apple Music for Artists
              </a>
              : plays, Shazams and where your listeners are.
            </li>
            <li>
              <strong className="text-foreground">YouTube:</strong> ask your
              distributor to merge your channel and your music into one
              Official Artist Channel.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="5. How the money reaches you">
          <p>
            A song earns in more ways than one. Most artists only collect the
            first.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">The recording.</strong>{" "}
              Streams and downloads. Your distributor collects this.
            </li>
            <li>
              <strong className="text-foreground">The song.</strong> Every
              stream, radio play and gig also pays the songwriter. Join your
              collecting society (Koda in Denmark, PRS in the UK, ASCAP or BMI
              in the US) and register your songs. A publishing service like
              Songtrust collects what&rsquo;s left abroad.
            </li>
            <li>
              <strong className="text-foreground">The performance.</strong>{" "}
              When your recording plays on radio or in shops, the performers
              on it are paid too, through societies like Gramex in Denmark or
              SoundExchange in the US.
            </li>
          </ul>
          <p>
            About Spotify: a stream pays a fraction of a cent, and a track
            earns nothing until it reaches 1,000 streams in a year. That
            sounds harsh. It also means one engaged fan base beats a hundred
            songs nobody plays.
          </p>
        </GuideSection>

        <GuideSection title="6. Sell it too">
          <p>
            Streaming pays per play. Fans who love you will pay more than
            that, if you let them.{" "}
            <a href="https://bandcamp.com" target="_blank" rel="noopener" className={linkClass}>
              Bandcamp
            </a>{" "}
            sells your music and merch straight to fans, and you keep most of
            every sale. On Bandcamp Fridays, a few days a year, it takes
            nothing at all. Vinyl, CDs and T-shirts at gigs still
            sell. Bring a card reader. 💳
          </p>
        </GuideSection>

        <GuideSection title="What to avoid">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Buying streams or followers.</strong>{" "}
              Stores spot fake streams, and the penalty lands on you: fines
              from your distributor, or your release taken down.
            </li>
            <li>
              <strong className="text-foreground">Playlist offers that guarantee numbers.</strong>{" "}
              A real curator can promise to listen, never to add you. Pitch
              through services that pay curators to listen, like the ones on
              our list of{" "}
              <Link href="/knowledge/websites-for-musicians#promote" className={linkClass}>
                useful websites for musicians
              </Link>
              .
            </li>
            <li>
              <strong className="text-foreground">Hiding AI use.</strong>{" "}
              Most stores accept music made with AI. Hiding it is what gets
              tracks pulled: declare it when you upload, and never imitate a
              real artist&rsquo;s voice.
            </li>
            <li>
              <strong className="text-foreground">A new name for every release.</strong>{" "}
              Release under the same artist name, spelled the same way, or
              your listeners get split across profiles.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="After release day">
          <p>
            The work starts now, not stops. Play the song live, post the
            story behind it, and send it to the people who said &ldquo;send
            me your next one&rdquo;. If it&rsquo;s good, it might even end up
            in the <TermLink href="/spotlight">Spotlight</TermLink>. 🎉
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
