import Link from "next/link";
import type { Metadata } from "next";
import { GuideFaq, GuideLayout, GuideSection } from "../../_components/guide-layout";
import { PressKitExamples } from "../../_components/press-kit-examples";
import { TermLink } from "@/app/_components/term-link";
import { focusable } from "@/app/_components/ui";

/*
 * Live examples: the "Real press kits" section reads featured releases from
 * the database on every request, so the page can't be prerendered (the
 * build step has no D1 access either).
 */
export const dynamic = "force-dynamic";

const PAGE_DESCRIPTION =
  "How to build a press kit (EPK) for your music: the music files, cover art, press photos, bio, logo and video a blog or promoter needs. With real examples from featured artists.";

export const metadata: Metadata = {
  title: "How to Build a Press Kit (EPK) for Your Music | Trenodo",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/knowledge/promote/press-kit" },
  openGraph: {
    title: "How to Build a Press Kit (EPK) for Your Music",
    description: PAGE_DESCRIPTION,
    url: "/knowledge/promote/press-kit",
    siteName: "Trenodo",
    type: "article",
  },
};

const CHECKLIST = [
  { item: "Music", format: "MP3 to listen, WAV or FLAC for radio", tip: "Masters, not demos" },
  { item: "Cover art", format: "JPG or PNG, 3000 × 3000 px", tip: "The same file as in the stores" },
  { item: "Press photos", format: "3 to 5 JPGs, full resolution", tip: "Both portrait and landscape" },
  { item: "Bio", format: "A short one and a long one", tip: "About 50 and 200 words" },
  { item: "Press release", format: "One page, PDF", tip: "Who, what, when, and why it matters" },
  { item: "Logo", format: "PNG with a clear background, plus SVG", tip: "Only if you have one" },
  { item: "Video", format: "30 to 60 seconds, vertical or square", tip: "Optional, but it helps" },
  { item: "Links and contact", format: "Release link, socials, one email", tip: "Check every link works" },
] as const;

const FAQS = [
  {
    q: "What is the difference between a press kit and an EPK?",
    a: "None, really. EPK stands for electronic press kit. It is the same thing, just online instead of a folder of printed photos and a CD. Today, every press kit is an EPK.",
  },
  {
    q: "How many press photos do I need?",
    a: "Three to five is a good number. Give a blog a choice, but not so many that they have to spend time picking. Include at least one portrait and one landscape photo, so they fit both a phone screen and a website banner.",
  },
  {
    q: "Is it safe to share my music before the release date?",
    a: "Yes, with the people you pitch to. That's the point: a blog needs to hear the song before it comes out, to write about it on release day. Share it through a private link, not as a public post.",
  },
  {
    q: "Do I need a new press kit for every release?",
    a: "Yes. A blog writing about your new single needs that single's cover, music and press release. Not photos and text from an album two years ago. Your bio can stay the same, as long as you keep it up to date.",
  },
  {
    q: "Where can I make a press kit for free?",
    a: "Trenodo Press Kit is free right now. You get one press kit per release, one link to share, and stats on who opened it, played your music and downloaded your files.",
  },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Build a Press Kit (EPK) for Your Music",
      description: PAGE_DESCRIPTION,
      author: { "@type": "Organization", name: "Trenodo" },
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

export default function PressKitGuidePage() {
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
        title="How to Build a Press Kit (EPK) for Your Music"
        intro="A press kit is everything a blog, radio station or promoter needs to write about your release, in one place. Get it right, and saying yes to you gets easy. Here is what goes in, what to leave out, and real examples to learn from. 📸"
      >
        <GuideSection title="What a press kit is">
          <p>
            A press kit is a collection of files about one release: the music,
            the cover, photos and a few texts. Journalists get lots of music
            every week. A good press kit saves them time, so your release has a
            better chance of being picked.
          </p>
          <p>
            Share it as one link, never as a pile of attachments. Email puts
            limits on file size, and some mail apps shrink your photos without
            telling you. A link to a folder or a press kit page keeps every
            file at full quality, and it never bounces.
          </p>
        </GuideSection>

        <GuideSection title="What goes in: the checklist">
          <p>
            These are the pieces a blog or promoter looks for. The first five
            are a must. The rest make you look professional, and they make the
            job easier for whoever writes about you.
          </p>
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted/60 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
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
        </GuideSection>

        <GuideSection title="Music: two versions of every track">
          <p>
            Give people an MP3 to listen to right away. It&rsquo;s small, and it
            plays anywhere. Add a WAV or FLAC for radio and anyone who wants
            the best quality. Always the final masters, never a demo or a rough
            mix. And if the release isn&rsquo;t out yet, that&rsquo;s fine. Hearing it
            early is exactly why they need your kit.
          </p>
        </GuideSection>

        <GuideSection title="Press photos: no photos, no feature">
          <p>
            This is the part artists skip most often, and the one that matters
            most. Without a good photo, most blogs simply can&rsquo;t use your
            release. The good news: you don&rsquo;t need a photographer.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Shoot in daylight.</strong>{" "}
              Soft light outside, or by a big window, beats any lamp.
            </li>
            <li>
              <strong className="text-foreground">Pick a background with some character.</strong>{" "}
              A brick wall, an old building, trees, graffiti. Anything but a
              messy room.
            </li>
            <li>
              <strong className="text-foreground">Mix it up.</strong> Close
              and far away, different angles, portrait and landscape.
            </li>
            <li>
              <strong className="text-foreground">A phone is fine.</strong>{" "}
              Afterwards, adjust the contrast, brightness and sharpness a
              little. Small changes, no heavy filters.
            </li>
            <li>
              <strong className="text-foreground">Upload full size, and credit the photographer.</strong>{" "}
              A blog can make a photo smaller, but never bigger.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="The texts: bio and press release">
          <p>
            <strong className="text-foreground">Your bio</strong> tells who
            you are. Write two: a short one of about 50 words for a quick
            mention, and a longer one of about 200 words for a real article.
            Write it in the third person, so a journalist can copy it straight
            in.
          </p>
          <p>
            <strong className="text-foreground">The press release</strong> is
            about this release. One page is enough: what it is, when it comes
            out, the story behind it, and why it matters now. A good quote from
            you makes it come alive. End with your contact details.
          </p>
          <p>
            Need help with the words? Our guides on{" "}
            <Link href="/knowledge/songwriting/finding-your-subject" className={linkClass}>
              finding your subject
            </Link>{" "}
            work for bios too. The story behind a song is often the best hook.
          </p>
        </GuideSection>

        <GuideSection title="Logo and video: the nice to haves">
          <p>
            <strong className="text-foreground">A logo</strong> is optional,
            but if you have one, include it. A PNG with a clear background for
            everyday use, and a vector file (SVG or AI) for designers who make
            posters and festival flyers.
          </p>
          <p>
            <strong className="text-foreground">Video</strong> is optional too,
            and it&rsquo;s worth it. Short clips of 30 to 60 seconds are easy to
            share. Make them vertical (9:16) for reels and stories, or square
            for a feed. They don&rsquo;t need a big budget. A good performance, filmed
            on a phone, is enough.
          </p>
        </GuideSection>

        <GuideSection title="Real press kits, from Spotlight">
          <p>
            The best way to learn is to look at real ones. These are the
            newest releases featured in{" "}
            <TermLink href="/spotlight">Spotlight</TermLink>, with their
            actual press kits. Open one and see how the cover, photos, tracks
            and texts come together. The list updates by itself as new
            releases get featured. ✨
          </p>
          <PressKitExamples />
        </GuideSection>

        <GuideSection title="How to send it">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Send early.</strong> Reach
              out a few weeks before release day, so there is time to listen
              and plan an article.
            </li>
            <li>
              <strong className="text-foreground">Keep the email short and personal.</strong>{" "}
              Use their name, say why your release fits what they write about,
              and put the press kit link at the top.
            </li>
            <li>
              <strong className="text-foreground">One link, not ten files.</strong>{" "}
              Everything in one place, easy to find again next week.
            </li>
            <li>
              <strong className="text-foreground">Follow up once.</strong> A
              friendly reminder after a week is fine. After that, move on.
            </li>
          </ul>
        </GuideSection>

        <GuideSection title="Common mistakes">
          <ul className="list-disc space-y-2 pl-5">
            <li>Demos or rough mixes instead of the final masters.</li>
            <li>Small or blurry photos, or no photos at all.</li>
            <li>A bio from three years ago that doesn&rsquo;t match the new music.</li>
            <li>No contact email, or links that don&rsquo;t work.</li>
            <li>One press kit for everything, instead of one per release.</li>
          </ul>
        </GuideSection>

        <GuideSection title="Build yours with Trenodo">
          <p>
            <TermLink href="/press-kit">Press Kit</TermLink> gives every
            single, EP and album its own press kit, with one link to share.
            Your files stay at full size, and you can see who opened the kit,
            played your music and downloaded your photos. It&rsquo;s free right now.
          </p>
          <p>
            Every press kit also puts your release on our list for{" "}
            <Link href="/spotlight/get-featured" className={linkClass}>
              Spotlight
            </Link>
            . Who knows, yours could be the next example on this page. 🎶
          </p>
        </GuideSection>

        <GuideFaq items={FAQS} />
      </GuideLayout>
    </>
  );
}
