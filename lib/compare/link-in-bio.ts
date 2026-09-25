import { LAST_CHECKED, TRENODO_PRICE } from "./shared";
import type { Roundup, Versus } from "./types";

/*
 * Trenodo facts come from the code, not the marketing copy:
 * lib/bio/blocks.ts (block kinds), lib/embed.ts (players), lib/bio/theme.ts
 * (themes and the contrast check), app/[handle]/page.tsx ("Made with
 * Trenodo" is a switch).
 */

const PRICE = TRENODO_PRICE["link-in-bio"];

const TRENODO_PLAYER = "Yes. Spotify, Apple Music and SoundCloud.";
const TRENODO_SMART_LINK = "No. You paste your own link, for example from your distributor.";
const TRENODO_PRESAVE =
  "Partly. A release button says \"Pre-save\" before the release date and \"Listen\" after. You bring the pre-save link.";
const TRENODO_ANALYTICS = "Views over time and clicks per block. Free.";
const TRENODO_TOOLS =
  "Press Kit, Setlist and Tutor. A release block reads straight from your press kit. And your releases can be picked for Spotlight.";

export const linktree: Versus = {
  kind: "versus",
  slug: "linktree",
  tool: "link-in-bio",
  competitor: "Linktree",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo vs Linktree for musicians. An honest side by side of price, music features, branding, analytics and fees, including where Linktree is the better choice.",
  intro:
    "Both give you one link for your bio. But they are built for different people. Here is an honest side by side. Yes, we are Trenodo. So we link every Linktree fact to its source, and we tell you where Linktree is the better pick.",
  chooseThem:
    "you want smart links, built in pre-saves and tour dates. Or you sell merch from your bio, or want to grow an email list. And you don't mind paying for the extras.",
  chooseUs:
    "you want a clean page for your music that is free all the way. No logo, your own colours, real numbers. Plus a press kit and setlists in the same account. 🎸",
  rows: [
    {
      group: "Price",
      rows: [
        {
          feature: "Cost",
          trenodo: PRICE,
          them: "Free plan, plus Starter ($8), Pro ($15) and Premium ($35) per month. Cheaper billed yearly. Prices vary by region.",
        },
        {
          feature: "Fees when you sell",
          trenodo: "No shop, so no fees.",
          them: "You can sell digital products. Linktree takes 12% on Free, 9% on Starter and Pro, 0% on Premium. Payment processing comes on top.",
        },
      ],
    },
    {
      group: "Music",
      rows: [
        { feature: "Music player on your page", trenodo: TRENODO_PLAYER, them: "Yes. Several platforms, like Spotify, SoundCloud and Audiomack." },
        { feature: "Smart link to every streaming service", trenodo: TRENODO_SMART_LINK, them: "Yes. Paste one link, and it finds the same track on the other services." },
        { feature: "Pre-save", trenodo: TRENODO_PRESAVE, them: "Yes, built in. Spotify, Apple Music and TIDAL." },
        { feature: "Tour dates", trenodo: "Not yet.", them: "Yes, from Bandsintown or Seated." },
        { feature: "Video", trenodo: "Yes. YouTube and Vimeo.", them: "Yes." },
      ],
    },
    {
      group: "Look and feel",
      rows: [
        { feature: "Themes and colours", trenodo: "Ready themes or your own colours. It warns you if text gets hard to read. All free.", them: "Basic themes are free. More design control on paid plans." },
        { feature: "Remove the platform's logo", trenodo: "Free. One switch.", them: "Pro or Premium." },
        { feature: "Your address", trenodo: "trenodo.com/@you. Change it later, and the old one still works.", them: "linktr.ee/you" },
      ],
    },
    {
      group: "Growth",
      rows: [
        { feature: "Analytics", trenodo: TRENODO_ANALYTICS, them: "Basic on Free. Longer history on paid plans, up to lifetime on Premium." },
        { feature: "Collect emails from fans", trenodo: "No.", them: "Yes, from Starter." },
        { feature: "Schedule links", trenodo: "No. You show and hide blocks by hand.", them: "Yes, from Starter." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Made for", trenodo: "Musicians only.", them: "Everyone: creators, brands and businesses. With good music features on top." },
        { feature: "Other tools in the same account", trenodo: TRENODO_TOOLS, them: "Link in bio, plus its own shop and marketing tools." },
        { feature: "Track record", trenodo: "New and small. Built by one musician.", them: "Around since 2016, with millions of users." },
      ],
    },
  ],
  theyWin: [
    "Smart links that find your track on every streaming service by themselves.",
    "Built in pre-saves, and tour dates from Bandsintown or Seated.",
    "Email collection and link scheduling, if you pay for them.",
    "A shop for merch and digital products.",
    "Many years of track record, and a big team behind it.",
  ],
  weWin: [
    "Everything is free. No trial, no plan to upgrade to.",
    "Remove the logo, pick your colours and see your numbers. All free.",
    "Made only for musicians, so the page stays simple.",
    "Your Link in Bio, Press Kit and Setlist live in one account.",
    "A release button that switches from Pre-save to Listen on release day.",
  ],
  faqs: [
    { q: "Is Trenodo really free, or is that a trial?", a: "Really free. Link in Bio has no paid plan, and no feature on this page costs money. Trenodo is small, and free is how musicians find the rest of the toolbox." },
    { q: "Is Linktree bad for musicians?", a: "No. Linktree has strong music features, like smart links, pre-saves and tour dates. If you use those, or you sell merch from your bio, Linktree is a good choice. This page tries to show that honestly." },
    { q: "Can I move from Linktree to Trenodo?", a: "Yes, but by hand. There is no import button. You add your links again, which takes about ten minutes for most artists. Then you swap the link in your bio." },
    { q: "Where do these facts come from?", a: "Linktree's own help center and pricing guides, linked at the bottom of the page. Prices are in US dollars and change often. We check again every few months." },
  ],
  sources: [
    { label: "Linktree pricing", href: "https://linktr.ee/s/pricing" },
    { label: "Linktree Help Center: Can I hide the Linktree logo?", href: "https://help.linktr.ee/en/articles/5434182-can-i-hide-the-linktree-logo" },
    { label: "Linktree Help Center: Tours and Events links", href: "https://help.linktr.ee/en/articles/5915532-how-to-add-a-bandsintown-link" },
    { label: "Linktree for musicians: smart links and pre-saves", href: "https://linktr.ee/blog/share-streaming-music-link-on-linktree" },
    { label: "Talkspresso: Linktree pricing, plans and seller fees (2026)", href: "https://talkspresso.com/blog/linktree-pricing" },
  ],
};

export const beacons: Versus = {
  kind: "versus",
  slug: "beacons",
  tool: "link-in-bio",
  competitor: "Beacons",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo vs Beacons for musicians. An honest comparison of price, seller fees, branding, email tools and music features, including where Beacons is the better choice.",
  intro:
    "Beacons is a link in bio for creators who sell. A store, email marketing and more, all on one page. Trenodo is a link in bio made only for musicians. Here is how they compare, with a source for every Beacons fact.",
  chooseThem:
    "you sell merch, presets or other products from your bio. Or you want to send emails to your fans from the same place. Beacons is built for making money from your page.",
  chooseUs:
    "you want a clean music page without a price tag. No logo to pay away, no fee on anything, and your press kit and setlists in the same account. 🎸",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Free plan, plus Creator ($10), Creator Plus ($30) and Creator Max ($90) per month. About two months free if you pay yearly." },
        { feature: "Fees when you sell", trenodo: "No shop, so no fees.", them: "9% on Free and Creator. 0% on Creator Plus and Creator Max. Payment processing comes on top." },
      ],
    },
    {
      group: "Music",
      rows: [
        { feature: "Music player on your page", trenodo: TRENODO_PLAYER, them: "Yes. Spotify, Apple Music, SoundCloud and Bandcamp." },
        { feature: "Pre-save", trenodo: TRENODO_PRESAVE, them: "Through timed smart links: show a pre-save link until release, then swap it for the streaming link by itself." },
        { feature: "Made for", trenodo: "Musicians only.", them: "All kinds of creators. Music is one use among many." },
      ],
    },
    {
      group: "Look and feel",
      rows: [
        { feature: "Themes and colours", trenodo: "Ready themes or your own colours, with a warning if text gets hard to read. Free.", them: "Many templates and design options." },
        { feature: "Remove the platform's logo", trenodo: "Free. One switch.", them: "Creator Plus ($30 a month) and up." },
      ],
    },
    {
      group: "Growth",
      rows: [
        { feature: "Email to fans", trenodo: "No.", them: "Yes. 50 sends a month on Free, 500 on Creator, unlimited from Creator Plus." },
        { feature: "Online store", trenodo: "No.", them: "Yes. Digital products, merch and more." },
        { feature: "Analytics", trenodo: TRENODO_ANALYTICS, them: "Yes, with more on paid plans." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Other tools in the same account", trenodo: TRENODO_TOOLS, them: "Store, email marketing and other creator tools." },
      ],
    },
  ],
  theyWin: [
    "A real online store, right on your bio page.",
    "Email marketing to your fans, built in.",
    "Timed smart links, handy for a pre-save that turns into a stream link.",
    "Lots of templates and design options.",
  ],
  weWin: [
    "No fees and no paid plan. The logo switch is free too.",
    "Made only for musicians, so the page stays simple.",
    "Your Press Kit and Setlist live in the same account.",
    "A release block that reads straight from your press kit.",
  ],
  faqs: [
    { q: "Is Beacons free?", a: "It has a free plan. But Beacons takes 9% of what you sell on Free and on Creator. To remove the Beacons logo, you need Creator Plus, at $30 a month." },
    { q: "Which is better for musicians?", a: "If you sell a lot from your bio, Beacons. If you mostly share your music, releases and gigs, Trenodo does that for free, with no fees and no logo to pay away." },
    { q: "Can I move from Beacons to Trenodo?", a: "Yes, by hand. There is no import. Add your links and players again, which takes about ten minutes. Then swap the link in your bio." },
  ],
  sources: [
    { label: "Beacons Help Center: Pricing plans", href: "https://help.beacons.ai/en/articles/4695681" },
    { label: "Beacons Help Center: Music embeds", href: "https://help.beacons.ai/en/articles/4696833" },
    { label: "Beacons Support: Smart links", href: "https://support.beacons.ai/article/shqn1nzknl-smart-links" },
  ],
};

export const featureFm: Versus = {
  kind: "versus",
  slug: "feature-fm",
  tool: "link-in-bio",
  competitor: "Feature.fm",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo vs Feature.fm for musicians. Smart links, pre-saves, bio links, analytics and price, compared honestly, including where Feature.fm is the better choice.",
  intro:
    "Feature.fm is a marketing tool for releases: smart links, pre-saves and ads. Trenodo is your everyday music page, with a press kit and setlists next to it. They overlap on the bio link. Here is the honest comparison.",
  chooseThem:
    "you run release campaigns. Smart links, pre-saves on every service, retargeting pixels and ads. Feature.fm is built for exactly that, and it's very good at it.",
  chooseUs:
    "you want one calm page for your music, for free, all year round. Plus a press kit and setlists in the same account. No campaign needed. 🎶",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Free plan, plus Basic Artist ($8), Artist ($19) and Pro Artist ($39) per month." },
      ],
    },
    {
      group: "Music",
      rows: [
        { feature: "Bio link page", trenodo: "Yes. That's what Link in Bio is.", them: "Yes, on every plan." },
        { feature: "Smart links", trenodo: TRENODO_SMART_LINK, them: "Yes, unlimited. Their main strength." },
        { feature: "Pre-save", trenodo: TRENODO_PRESAVE, them: "Yes. The free plan is limited to one pre-save service." },
        { feature: "Tour and event links", trenodo: "Not yet.", them: "Yes." },
        { feature: "Music player on your page", trenodo: TRENODO_PLAYER, them: "Built around links to the streaming services." },
      ],
    },
    {
      group: "Growth",
      rows: [
        { feature: "Analytics", trenodo: TRENODO_ANALYTICS, them: "7 days of history on Free, 28 on Basic Artist, 90 on Artist, lifetime on Pro Artist." },
        { feature: "Fan emails", trenodo: "No.", them: "Collected on every plan. Reading them needs a paid plan: 50 per link on Basic Artist, 200 on Artist, unlimited on Pro Artist." },
        { feature: "Retargeting pixels and ads", trenodo: "No.", them: "Yes. Pixels from Basic Artist, and ad tools." },
      ],
    },
    {
      group: "Look and feel",
      rows: [
        { feature: "Remove the platform's branding", trenodo: "Free. One switch.", them: "Artist ($19 a month) and up." },
        { feature: "Custom domain", trenodo: "No. Your page is trenodo.com/@you.", them: "Artist and up." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Other tools in the same account", trenodo: TRENODO_TOOLS, them: "Release marketing: links, pre-saves, fan data and ads." },
      ],
    },
  ],
  theyWin: [
    "Smart links and pre-saves across every streaming service.",
    "Retargeting pixels and ad tools for paid campaigns.",
    "Fan email collection on every link.",
    "Tour and event links.",
  ],
  weWin: [
    "Free, with no limits on history and no logo to pay away.",
    "A music player and video right on your page.",
    "Your Press Kit and Setlist in the same account.",
    "Simple on purpose. No campaign to set up.",
  ],
  faqs: [
    { q: "Do I need Feature.fm if I use Trenodo?", a: "Maybe for a big release. Many artists use a smart link tool for the campaign, and put that link on their everyday page. The two can work together." },
    { q: "Is the Feature.fm free plan enough?", a: "For a start. But the free plan keeps 7 days of data, allows one pre-save service, and hides the fan emails until you upgrade." },
    { q: "Which one is cheaper?", a: "Trenodo is free. Feature.fm is free to start, with paid plans from $8 a month. For campaign tools, that can be money well spent." },
  ],
  sources: [
    { label: "Feature.fm pricing", href: "https://www.feature.fm/pricing" },
  ],
};

export const linkfire: Versus = {
  kind: "versus",
  slug: "linkfire",
  tool: "link-in-bio",
  competitor: "Linkfire",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo vs Linkfire for independent musicians. Smart links, bio links, analytics and price, compared honestly, including where Linkfire is the better choice.",
  intro:
    "Linkfire is the smart link platform the big labels use. Deep data, pixels and a team setup for many artists. Trenodo is a free music page for one artist. Different leagues, some overlap. Here is the honest version.",
  chooseThem:
    "you run releases like a label. You need attribution data, retargeting and workspaces for several artists. That's Linkfire's home turf.",
  chooseUs:
    "you are an independent artist who wants a good page for your music, without a monthly bill. Plus a press kit and setlists in the same account. 🎸",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Pro $27 and Teams $55 per month, less if paid yearly. Premium and Enterprise on request. A limited free account after the trial." },
      ],
    },
    {
      group: "Music",
      rows: [
        { feature: "Smart links", trenodo: TRENODO_SMART_LINK, them: "Yes, their core. Release, pre-release and more." },
        { feature: "Bio link page", trenodo: "Yes. That's what Link in Bio is.", them: "Yes, bio links on every plan." },
        { feature: "Music player on your page", trenodo: TRENODO_PLAYER, them: "Built around links to the streaming services." },
      ],
    },
    {
      group: "Growth",
      rows: [
        { feature: "Analytics", trenodo: TRENODO_ANALYTICS, them: "Deep: streaming insights, channels and locations. Raw data export on the top plans." },
        { feature: "Retargeting pixels", trenodo: "No.", them: "Yes." },
        { feature: "Teams and several artists", trenodo: "One account per musician.", them: "Teams covers up to five artist workspaces." },
      ],
    },
    {
      group: "Look and feel",
      rows: [
        { feature: "Remove the platform's branding", trenodo: "Free. One switch.", them: "Yes, on all plans." },
        { feature: "Your address", trenodo: "trenodo.com/@you", them: "lnk.to links and subdomains." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Other tools in the same account", trenodo: TRENODO_TOOLS, them: "Release links, widgets and QR codes." },
        { feature: "Made for", trenodo: "Independent musicians.", them: "Labels and established artists, plus independents on Pro." },
      ],
    },
  ],
  theyWin: [
    "Smart links used across the music industry.",
    "Deep analytics and retargeting.",
    "Workspaces for teams and several artists.",
  ],
  weWin: [
    "Free, with no monthly bill.",
    "A music player and video right on your page.",
    "Your Press Kit and Setlist in the same account.",
    "Made for one artist, so it's simple to set up.",
  ],
  faqs: [
    { q: "Is Linkfire worth it for an independent artist?", a: "If you run paid campaigns and read the data, it can be. For a page that simply shows your music, the Pro plan at $27 a month is a lot. That's where Trenodo fits." },
    { q: "Can I use both?", a: "Yes. Make a Linkfire link for a release, and add it as a link on your Trenodo page." },
  ],
  sources: [
    { label: "Linkfire pricing", href: "https://www.linkfire.com/pricing" },
  ],
};

export const linktreeAlternatives: Roundup = {
  kind: "roundup",
  slug: "linktree-alternatives",
  tool: "link-in-bio",
  title: "Link in Bio Tools for Musicians, Compared",
  lastChecked: LAST_CHECKED,
  description:
    "Link in bio tools for musicians, compared honestly. Price, fees and music features for Trenodo, Linktree, Beacons, Feature.fm and Linkfire, and the best Linktree alternatives.",
  intro:
    "Linktree is the default. But it's made for everyone, and the good parts cost money. Here are the alternatives worth a look if you make music. Full disclosure: the first one is ours.",
  entries: [
    { name: "Trenodo", price: "Free", bestFor: "Musicians who want a free, clean page", body: "Made only for musicians. Music player, video and release blocks, your own colours, no logo, and a press kit and setlists in the same account. No smart links or tour dates yet.", isTrenodo: true },
    { name: "Linktree", price: "Free, paid from $8 a month", bestFor: "Smart links, pre-saves and tour dates", body: "The original, with strong music features. The best bits, like email collection and removing the logo, need a paid plan.", compareSlug: "linktree" },
    { name: "Beacons", price: "Free, paid from $10 a month", bestFor: "Selling from your bio", body: "A store and email marketing on your bio page. 9% seller fee on the cheaper plans. Made for creators in general.", compareSlug: "beacons" },
    { name: "Feature.fm", price: "Free, paid from $8 a month", bestFor: "Release campaigns", body: "Smart links, pre-saves, pixels and ads. Great for a release. The free plan keeps only 7 days of data.", compareSlug: "feature-fm" },
    { name: "Linkfire", price: "From $27 a month", bestFor: "Labels and data-heavy campaigns", body: "The smart link platform of the big labels. Deep analytics and team workspaces, priced for it.", compareSlug: "linkfire" },
  ],
  faqs: [
    { q: "What is the best free Linktree alternative for musicians?", a: "If you want everything free, Trenodo. No paid plan, no fees and no logo to pay away. If you need smart links, the free plans of Linktree and Feature.fm are worth a look." },
    { q: "Do I need a smart link and a bio link?", a: "Often both. A smart link is for one release. A bio link is your page for everything. Many artists put the smart link on their bio page." },
  ],
  sources: [
    { label: "Linktree pricing", href: "https://linktr.ee/s/pricing" },
    { label: "Beacons Help Center: Pricing plans", href: "https://help.beacons.ai/en/articles/4695681" },
    { label: "Feature.fm pricing", href: "https://www.feature.fm/pricing" },
    { label: "Linkfire pricing", href: "https://www.linkfire.com/pricing" },
  ],
};
