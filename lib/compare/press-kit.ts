import { LAST_CHECKED, TRENODO_PRICE } from "./shared";
import type { Roundup, Versus } from "./types";

/*
 * Trenodo facts from the code: one kit per release (lib/dal/press.ts),
 * publish and unpublish, full-size files with smaller downloads, and the
 * stats on the release page (visits, plays, downloads, listen clicks).
 * There is no password and no gig calendar in a kit.
 */

const PRICE = TRENODO_PRICE["press-kit"];

export const bandzoogle: Versus = {
  kind: "versus",
  slug: "bandzoogle",
  tool: "press-kit",
  competitor: "Bandzoogle",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Press Kit vs Bandzoogle EPK. An honest comparison of price, press kit features, websites and selling, including where Bandzoogle is the better choice.",
  intro:
    "Bandzoogle is a website builder for bands, with an EPK builder inside. Trenodo Press Kit makes one press kit for every release. Both help you get written about. Here is how they compare.",
  chooseThem:
    "you want a full band website, a store and an EPK in one place. Or you need a gig calendar and password protection on your EPK.",
  chooseUs:
    "you release often, and want a press kit for each release. Cover, photos, masters and paperwork, with stats on who looks. Without a monthly bill. 📸",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "EPK plan $6.95 a month. Website plans $11, $17 and $22 a month. Cheaper billed yearly. 14 day free trial." },
        { feature: "Fees when you sell", trenodo: "No shop, so no fees.", them: "0% commission on merch and music sales." },
      ],
    },
    {
      group: "Press kit",
      rows: [
        { feature: "One kit per release", trenodo: "Yes. Every single, EP and album gets its own.", them: "You build your EPK as a page. One per release is up to you." },
        { feature: "Full-size files", trenodo: "Yes. Cover, photos and masters stay the size you uploaded. Smaller downloads too.", them: "Download links for high-res images and riders." },
        { feature: "Music player", trenodo: "Yes. Your uploaded tracks, MP3, WAV or FLAC.", them: "Yes." },
        { feature: "Press quotes and bio", trenodo: "Bio, lyrics and one sheet as documents.", them: "Yes, press quotes and a long bio." },
        { feature: "Gig calendar", trenodo: "No.", them: "Yes." },
        { feature: "Password protection", trenodo: "No. A kit is private until you publish it.", them: "Yes, if you want it." },
        { feature: "Stats", trenodo: "Visits, plays, downloads and listen clicks per kit.", them: "Not listed for the EPK." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Band website", trenodo: "No. Link in Bio is your page.", them: "Yes. The core product, with your own domain." },
        { feature: "Storage", trenodo: "Every release gets its own files.", them: "Lite: 10 tracks, 100 photos. Standard: 50 tracks. Pro: unlimited." },
        { feature: "Spotlight", trenodo: "Your kit puts your release on our Spotlight list.", them: "No." },
        { feature: "Track record", trenodo: "New and small.", them: "Over 20 years, 60,000+ musicians." },
      ],
    },
  ],
  theyWin: [
    "A full band website, with your own domain.",
    "A store with 0% commission.",
    "Gig calendar and password protection in the EPK.",
    "Over 20 years of experience and support.",
  ],
  weWin: [
    "Free, with no plan to pick.",
    "A separate kit for every release, not one page to keep updating.",
    "Stats on visits, plays and downloads.",
    "A chance to be featured in Spotlight.",
  ],
  faqs: [
    { q: "Is Bandzoogle's EPK free?", a: "No. There's a 14 day free trial. After that, the EPK plan is $6.95 a month, or it comes with a website plan." },
    { q: "Can I use both?", a: "Yes. Keep your Bandzoogle site, and link to a Trenodo press kit for each new release." },
  ],
  sources: [
    { label: "Bandzoogle pricing", href: "https://bandzoogle.com/pricing" },
    { label: "Bandzoogle EPK features", href: "https://bandzoogle.com/features/epk" },
    { label: "DropCue: Best EPK builder 2026 (on Bandzoogle's size and age)", href: "https://dropcue.app/best-epk-builder-2026" },
  ],
};

export const reverbnation: Versus = {
  kind: "versus",
  slug: "reverbnation",
  tool: "press-kit",
  competitor: "ReverbNation",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Press Kit vs ReverbNation. An honest comparison of press kits, price, distribution and gig opportunities, including where ReverbNation is the better choice.",
  intro:
    "ReverbNation is an all-round platform for artists: distribution, opportunities to submit to, and an EPK. Trenodo Press Kit does one thing: a press kit for every release. Here is how they compare.",
  chooseThem:
    "you want your music distributed to the streaming services, and to submit to gigs, festivals and label opportunities from the same place.",
  chooseUs:
    "you want a press kit you can send to anyone today. One per release, with your files at full size and stats on who looks. 📸",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Premium is $199.50 a year at full price, often on sale. 14 day free trial." },
      ],
    },
    {
      group: "Press kit",
      rows: [
        { feature: "Public press kit", trenodo: "Yes. Publish a kit, share the link.", them: "Right now the EPK is used for their Opportunities. Public press kits are announced as coming soon." },
        { feature: "One kit per release", trenodo: "Yes.", them: "One EPK for you as an artist." },
        { feature: "Full-size files", trenodo: "Yes, with smaller downloads too.", them: "Not documented." },
        { feature: "Stats", trenodo: "Visits, plays, downloads and listen clicks.", them: "Not documented for the EPK." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Distribution to streaming services", trenodo: "No.", them: "Yes, unlimited on Premium." },
        { feature: "Gig and label opportunities", trenodo: "No. Spotlight is the closest.", them: "Yes. Their Opportunities, for gigs, festivals and more." },
        { feature: "Spotlight", trenodo: "Your kit puts your release on our Spotlight list.", them: "No." },
      ],
    },
  ],
  theyWin: [
    "Distribution to Spotify, Apple Music and more.",
    "Opportunities to submit to, for gigs, festivals and labels.",
    "A name many promoters and venues know.",
  ],
  weWin: [
    "A public press kit you can share today.",
    "One kit per release, with full-size files.",
    "Stats on visits, plays and downloads.",
    "Free.",
  ],
  faqs: [
    { q: "Can I send my ReverbNation EPK to a blog?", a: "According to ReverbNation, the EPK is currently used inside their Opportunities, and fully public press kits are coming. Check their help center for the latest." },
    { q: "Can I use both?", a: "Yes. Distribute through ReverbNation, and send a Trenodo press kit to the press." },
  ],
  sources: [
    { label: "ReverbNation pricing", href: "https://www.reverbnation.com/pricing" },
    { label: "ReverbNation Help: What is ReverbNation v2?", href: "https://help.reverbnation.com/hc/en-us/articles/56107277734937-What-is-ReverbNation-v2" },
  ],
};

export const epkBuilders: Roundup = {
  kind: "roundup",
  slug: "epk-builders",
  tool: "press-kit",
  title: "EPK Builders for Musicians, Compared",
  lastChecked: LAST_CHECKED,
  description:
    "Electronic press kit builders for musicians, compared honestly. Price and features for Trenodo, Bandzoogle, ReverbNation, DropCue, EPK Builder and Storydoc.",
  intro:
    "An EPK is what a blog, radio station or promoter looks at first. Here are the tools that build one, from free and simple to paid and powerful. Full disclosure: the first one is ours.",
  entries: [
    { name: "Trenodo Press Kit", price: "Free right now", bestFor: "A kit for every release", body: "One press kit per single, EP or album. Cover, photos and masters at full size, bio and one sheet, and stats on visits, plays and downloads. No password protection.", isTrenodo: true },
    { name: "Bandzoogle", price: "From $6.95 a month", bestFor: "A band website with an EPK", body: "A full website builder, a store with 0% commission, and an EPK with password protection and a gig calendar.", compareSlug: "bandzoogle" },
    { name: "ReverbNation", price: "Premium $199.50 a year", bestFor: "Distribution and opportunities", body: "Distribution and submissions to gigs and labels. The EPK is currently tied to their Opportunities.", compareSlug: "reverbnation" },
    { name: "DropCue", price: "From $8 a month", bestFor: "Pitching to industry", body: "Built for composers, sync and A&R: listen stats per person, password protection and expiring links." },
    { name: "EPK Builder", price: "Free", bestFor: "A quick, basic EPK", body: "Bio, music, photos and contact info. No analytics or access control." },
    { name: "Storydoc", price: "Paid", bestFor: "A presentation-style EPK", body: "Interactive, animated pages. Not made for music only." },
  ],
  faqs: [
    { q: "What should an EPK include?", a: "At least cover art at full size, a few press photos, your music (masters, not demos) and a short bio or one sheet. The rest is a bonus." },
    { q: "Is a free EPK good enough?", a: "Often, yes. What matters is that the files are good and easy to download. Pay when you need extras, like a website, a store or per-person stats." },
  ],
  sources: [
    { label: "Bandzoogle pricing", href: "https://bandzoogle.com/pricing" },
    { label: "ReverbNation pricing", href: "https://www.reverbnation.com/pricing" },
    { label: "DropCue: Best EPK builder 2026 (their own ranking)", href: "https://dropcue.app/best-epk-builder-2026" },
    { label: "EPK Builder", href: "https://epkbuilder.com/" },
    { label: "Storydoc EPK maker", href: "https://www.storydoc.com/epk-maker" },
  ],
};
