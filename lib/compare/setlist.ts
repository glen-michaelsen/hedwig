import { LAST_CHECKED, TRENODO_PRICE } from "./shared";
import type { Roundup, Versus } from "./types";

/*
 * Trenodo facts from the code (app/setlists, lib/setlist): gigs, sets with a
 * target length, drag and drop, copy a gig or a set, a print view, and it
 * runs in any browser. No band sharing, no lyrics or chord charts, no MIDI.
 */

const PRICE = TRENODO_PRICE.setlist;

export const bandhelper: Versus = {
  kind: "versus",
  slug: "bandhelper",
  tool: "setlist",
  competitor: "BandHelper",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Setlist vs BandHelper. An honest comparison of setlists, band sharing, lyrics, MIDI and price, including where BandHelper is the better choice.",
  intro:
    "BandHelper is a full organiser for working bands: songs, lyrics, MIDI, stage plots, schedules and money. Trenodo Setlist does one thing: build a setlist fast and take it on stage. Here is the honest comparison.",
  chooseThem:
    "your band shares songs and charts, runs MIDI or backing tracks, or wants the calendar and finances in the same app. BandHelper is built for that.",
  chooseUs:
    "you just want the right songs in the right order, timed to the minute, and a clean sheet to print. In your browser, for free. 🎤",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "For one person: Basic $2.25, Plus $3 and Pro $3.75 a month, or less yearly. More for bigger bands. Free trial." },
      ],
    },
    {
      group: "Setlists",
      rows: [
        { feature: "Build setlists", trenodo: "Yes. Drag songs into sets.", them: "Yes." },
        { feature: "Target length per set", trenodo: "Yes. See the minutes add up while you build.", them: "Not listed." },
        { feature: "Print view for the stage", trenodo: "Yes. Big letters, black on white.", them: "Not listed." },
      ],
    },
    {
      group: "On stage",
      rows: [
        { feature: "Lyrics and chord charts", trenodo: "No.", them: "Yes." },
        { feature: "MIDI and recordings", trenodo: "No.", them: "Yes, on every plan." },
        { feature: "Stage plots", trenodo: "No.", them: "Yes, on Pro." },
      ],
    },
    {
      group: "The band",
      rows: [
        { feature: "Share with bandmates", trenodo: "No. One account per musician.", them: "Yes, with sync between members." },
        { feature: "Schedule and contacts", trenodo: "Gigs with date and place.", them: "Yes, on Plus and Pro." },
        { feature: "Finances", trenodo: "No.", them: "Yes, on Pro." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Where it runs", trenodo: "Any browser, phone or computer.", them: "iOS, macOS, Android and web." },
        { feature: "Other tools in the same account", trenodo: "Link in Bio, Press Kit and Tutor.", them: "Band management." },
      ],
    },
  ],
  theyWin: [
    "Lyrics, chord charts, MIDI and backing tracks.",
    "Sharing and syncing with the whole band.",
    "Stage plots, schedules and finances.",
  ],
  weWin: [
    "Free, forever.",
    "Target minutes per set, so you know before soundcheck.",
    "Quick to learn. Your first setlist takes minutes.",
    "Your Link in Bio and Press Kit in the same account.",
  ],
  faqs: [
    { q: "Is BandHelper expensive?", a: "Not really. For one person it's from $2.25 a month. It costs more for bigger bands, and the paid tiers add a lot of band tools." },
    { q: "Which is better for a solo artist?", a: "If you only need setlists, Trenodo is free and quick. If you want lyrics, charts and MIDI on stage, BandHelper does much more." },
  ],
  sources: [
    { label: "BandHelper pricing", href: "https://www.bandhelper.com/main/pricing.html" },
  ],
};

export const setlistHelper: Versus = {
  kind: "versus",
  slug: "setlist-helper",
  tool: "setlist",
  competitor: "Setlist Helper",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Setlist vs Setlist Helper. An honest comparison of setlists, lyrics, band sharing and price, including where Setlist Helper is the better choice.",
  intro:
    "Setlist Helper is a setlist app with a songbook inside: lyrics, chords and auto-scroll. Trenodo Setlist is for planning the order and the minutes. Here is how they compare.",
  chooseThem:
    "you read lyrics or chords from a tablet on stage, with auto-scroll and a foot pedal. That's what Setlist Helper is made for.",
  chooseUs:
    "you want to plan sets to the minute and print a clean sheet. No ads, nothing to install, and free. 🎤",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Free with ads. A paid version removes the ads and adds more." },
      ],
    },
    {
      group: "Setlists",
      rows: [
        { feature: "Build setlists", trenodo: "Yes. Drag songs into sets.", them: "Yes." },
        { feature: "Target length per set", trenodo: "Yes.", them: "Not listed." },
        { feature: "Print view for the stage", trenodo: "Yes. Big letters, black on white.", them: "Not listed. Made for reading on a screen." },
      ],
    },
    {
      group: "On stage",
      rows: [
        { feature: "Lyrics and chords", trenodo: "No.", them: "Yes. ChordPro, transpose and auto-scroll." },
        { feature: "Foot pedal", trenodo: "No.", them: "Yes, Bluetooth pedals." },
        { feature: "Audio with songs", trenodo: "No.", them: "Yes, attach MP3s." },
      ],
    },
    {
      group: "The bigger picture",
      rows: [
        { feature: "Band sharing", trenodo: "No.", them: "Yes, through Band Central." },
        { feature: "Where it runs", trenodo: "Any browser.", them: "iOS, Android and web." },
        { feature: "Ads", trenodo: "None.", them: "In the free version." },
      ],
    },
  ],
  theyWin: [
    "Lyrics and chords on stage, with auto-scroll.",
    "Foot pedal support.",
    "Band sharing through Band Central.",
  ],
  weWin: [
    "Free, with no ads.",
    "Target minutes per set.",
    "A clean printed sheet for the stage.",
    "Nothing to install.",
  ],
  faqs: [
    { q: "Can I use both?", a: "Yes. Plan the order and the minutes in Trenodo, and keep your lyrics and chords in Setlist Helper." },
  ],
  sources: [
    { label: "Setlist Helper", href: "https://www.setlisthelper.com/" },
    { label: "Setlist Helper on the App Store", href: "https://apps.apple.com/us/app/setlist-helper/id939098002" },
  ],
};

export const setlistApps: Roundup = {
  kind: "roundup",
  slug: "setlist-apps",
  tool: "setlist",
  title: "Setlist Apps for Musicians, Compared",
  lastChecked: LAST_CHECKED,
  description:
    "Setlist apps for musicians and bands, compared honestly. Trenodo Setlist, BandHelper, Setlist Helper and OnSong, with price and what each one is for.",
  intro:
    "A good setlist app saves you a panic before soundcheck. But they're built for different jobs: planning, reading on stage, or running the whole band. Full disclosure: the first one is ours.",
  entries: [
    { name: "Trenodo Setlist", price: "Free", bestFor: "Planning sets to the minute", body: "Drag songs into sets with a target length, copy old gigs, and print a clean sheet. In any browser. No lyrics or band sharing.", isTrenodo: true },
    { name: "BandHelper", price: "From $2.25 a month", bestFor: "Working bands", body: "Songs, lyrics, MIDI, stage plots, schedules and finances, shared with the whole band.", compareSlug: "bandhelper" },
    { name: "Setlist Helper", price: "Free with ads", bestFor: "Lyrics and chords on stage", body: "A songbook with ChordPro, auto-scroll and foot pedal support. Band Central for sharing.", compareSlug: "setlist-helper" },
    { name: "OnSong", price: "From $3.99 a month", bestFor: "Chord charts on iPhone and iPad", body: "Chord charts, the Nashville Number System and transposing. Backing tracks and MIDI on Premium." },
  ],
  faqs: [
    { q: "What is the best free setlist app?", a: "For planning and printing, Trenodo Setlist is free with no ads. For reading lyrics on stage, Setlist Helper has a free version with ads." },
    { q: "Do I need an app on stage at all?", a: "Not always. A printed sheet never runs out of battery. Many musicians plan in an app and print the result." },
  ],
  sources: [
    { label: "BandHelper pricing", href: "https://www.bandhelper.com/main/pricing.html" },
    { label: "Setlist Helper", href: "https://www.setlisthelper.com/" },
    { label: "OnSong: How much does OnSong cost?", href: "https://onsongapp.zendesk.com/hc/en-us/articles/360043713513-How-much-does-OnSong-cost" },
  ],
};
