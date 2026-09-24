import { LAST_CHECKED, TRENODO_PRICE } from "./shared";
import type { Roundup, Versus } from "./types";

/*
 * Trenodo facts from the code (app/tutor, app/s): students log in with a
 * phone number and PIN, lesson notes have a private part, a tagged material
 * library, a pinned shelf per student, and a calendar view of past notes.
 * There is no scheduling, billing, reminders or website builder. The pages
 * below say so plainly: that's the honest line between the two kinds of
 * tool.
 */

const PRICE = TRENODO_PRICE.tutor;

const TEACHING_ROWS = [
  { feature: "Lesson notes", trenodo: "Yes. What you did, homework and the material used.", them: "" },
  { feature: "Private notes", trenodo: "Yes. Every lesson note has a part only you see.", them: "" },
  { feature: "Material library", trenodo: "Yes. Sheet music, chord links and videos, tagged and searchable.", them: "" },
];

export const myMusicStaff: Versus = {
  kind: "versus",
  slug: "my-music-staff",
  tool: "tutor",
  competitor: "My Music Staff",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Tutor vs My Music Staff for private music teachers. Scheduling, billing, lesson notes, student portal and price, compared honestly.",
  intro:
    "My Music Staff runs the business side of a music studio: calendar, invoices, payments and reminders. Trenodo Tutor is about the teaching itself: lesson notes, your material and a portal your students actually use. Here is the honest comparison.",
  chooseThem:
    "you need scheduling, invoices, online payments and reminders. That's the heart of My Music Staff, and Trenodo doesn't do any of it.",
  chooseUs:
    "your calendar and payments already work, and you want a better way to share notes, homework and material with your students. For free, right now. 🎓",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "$16.95 a month for the first teacher, $4.95 for each extra. Unlimited students. 30 day free trial." },
      ],
    },
    {
      group: "Running the studio",
      rows: [
        { feature: "Scheduling and calendar", trenodo: "No. A calendar of past lesson notes only.", them: "Yes. Calendar, rescheduling, cancellations and two-way calendar sync." },
        { feature: "Invoices and payments", trenodo: "No.", them: "Yes. Automatic invoices, online payments and late fees." },
        { feature: "Reminders", trenodo: "No.", them: "Yes, SMS reminders included." },
        { feature: "Attendance", trenodo: "Lesson notes by date.", them: "Yes." },
        { feature: "Website builder", trenodo: "No.", them: "Yes, with online registration and booking." },
      ],
    },
    {
      group: "Teaching",
      rows: [
        { ...TEACHING_ROWS[0], them: "Yes, in the student portal." },
        { ...TEACHING_ROWS[1], them: "Not listed." },
        { ...TEACHING_ROWS[2], them: "Learning management is included." },
        { feature: "Pinned basics per student", trenodo: "Yes. Scales, theory, the piece they're working on, always on top.", them: "Not listed." },
      ],
    },
    {
      group: "For your students",
      rows: [
        { feature: "Student login", trenodo: "Phone number and a 4 digit PIN. No app, no account, no password.", them: "A student and parent portal." },
        { feature: "What they see", trenodo: "Their notes, homework and material in one place.", them: "Lesson notes, scheduling and payment history." },
      ],
    },
  ],
  theyWin: [
    "Scheduling, rescheduling and calendar sync.",
    "Invoices, online payments and late fees.",
    "SMS reminders and attendance tracking.",
    "A website with online booking.",
  ],
  weWin: [
    "Free right now. My Music Staff is $16.95 a month.",
    "Private notes next to what you share.",
    "A tagged library of your own material.",
    "Students log in with phone and PIN. Nothing to forget.",
  ],
  faqs: [
    { q: "Can Trenodo Tutor replace My Music Staff?", a: "Only if you don't need its business tools. Trenodo has no scheduling, invoices or payments. If you handle those another way, Trenodo covers the teaching side well." },
    { q: "Can I use both?", a: "Yes. Run the calendar and billing in My Music Staff, and share notes and material with Trenodo. The two jobs split well." },
    { q: "Is My Music Staff only for music teachers?", a: "Yes. Their sister product, TutorBird, is for other kinds of tutors." },
  ],
  sources: [
    { label: "My Music Staff pricing", href: "https://www.mymusicstaff.com/pricing/" },
    { label: "My Music Staff", href: "https://www.mymusicstaff.com/" },
  ],
};

export const tutorbird: Versus = {
  kind: "versus",
  slug: "tutorbird",
  tool: "tutor",
  competitor: "TutorBird",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Tutor vs TutorBird for music teachers. Scheduling, billing, lesson notes, student portal and price, compared honestly.",
  intro:
    "TutorBird is studio software for all kinds of tutors: math, languages, music and more. Trenodo Tutor is made only for music teachers, and only for the teaching part. Here is the honest comparison.",
  chooseThem:
    "you need a calendar, invoices, online payments and reminders. Or you teach more than music. TutorBird covers the whole business.",
  chooseUs:
    "you teach music, and want lesson notes, sheet music and practice videos in one place your students can reach. For free, right now. 🎓",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "$16.95 a month for a solo tutor, $4.95 for each extra. 30 day free trial." },
      ],
    },
    {
      group: "Running the studio",
      rows: [
        { feature: "Scheduling", trenodo: "No.", them: "Yes, with attendance." },
        { feature: "Invoices and payments", trenodo: "No.", them: "Yes." },
        { feature: "Reminders", trenodo: "No.", them: "Yes, SMS reminders included." },
        { feature: "Website builder", trenodo: "No.", them: "Yes, with free hosting." },
      ],
    },
    {
      group: "Teaching",
      rows: [
        { ...TEACHING_ROWS[0], them: "Yes." },
        { ...TEACHING_ROWS[1], them: "Not listed." },
        { ...TEACHING_ROWS[2], them: "File sharing." },
        { feature: "Made for", trenodo: "Music teachers only.", them: "All kinds of tutors." },
      ],
    },
    {
      group: "For your students",
      rows: [
        { feature: "Student login", trenodo: "Phone number and a 4 digit PIN. No app, no account.", them: "A student and parent portal." },
      ],
    },
  ],
  theyWin: [
    "Scheduling, invoices and online payments.",
    "SMS reminders.",
    "A website builder.",
    "Works for any subject, not just music.",
  ],
  weWin: [
    "Free right now.",
    "Made for music: sheet music, chord links and practice videos.",
    "Private notes next to what you share.",
    "Students log in with phone and PIN.",
  ],
  faqs: [
    { q: "Is TutorBird made for music teachers?", a: "It works for any tutor. The same company makes My Music Staff, which is their version for music teachers." },
    { q: "Can I use both?", a: "Yes. TutorBird for the calendar and billing, Trenodo for notes and material." },
  ],
  sources: [
    { label: "TutorBird pricing", href: "https://www.tutorbird.com/pricing/" },
  ],
};

export const opus1: Versus = {
  kind: "versus",
  slug: "opus1",
  tool: "tutor",
  competitor: "Opus1",
  lastChecked: LAST_CHECKED,
  description:
    "Trenodo Tutor vs Opus1. Music school software against a free tool for private teachers. Scheduling, billing, portal and price, compared honestly.",
  intro:
    "Opus1 is software for whole music schools: many teachers, many rooms, payroll and recitals. Trenodo Tutor is for one teacher and their students. If you teach alone, this comparison is mostly about what you don't need.",
  chooseThem:
    "you run a music school, with several teachers, locations and payroll. Opus1 is built for exactly that.",
  chooseUs:
    "you teach on your own, and want your lesson notes and material in one place for your students. Without a school-sized bill. 🎓",
  rows: [
    {
      group: "Price",
      rows: [
        { feature: "Cost", trenodo: PRICE, them: "Starter $98 a month, up to 200 active students. Growth and Ultimate on request. Free trial, no contract." },
      ],
    },
    {
      group: "Running the school",
      rows: [
        { feature: "Scheduling and self-booking", trenodo: "No.", them: "Yes." },
        { feature: "Billing and payments", trenodo: "No.", them: "Yes, automated." },
        { feature: "Teacher payroll", trenodo: "No.", them: "Yes." },
        { feature: "Recitals and events", trenodo: "No.", them: "Yes." },
        { feature: "Several locations", trenodo: "No.", them: "Yes, on the bigger plans." },
      ],
    },
    {
      group: "Teaching",
      rows: [
        { ...TEACHING_ROWS[0], them: "Learning management tools are included." },
        { feature: "Student login", trenodo: "Phone number and a 4 digit PIN.", them: "A student and parent portal." },
      ],
    },
  ],
  theyWin: [
    "Everything a music school needs to run.",
    "Payroll, recitals and several locations.",
    "Self-booking and automated billing.",
  ],
  weWin: [
    "Free right now, instead of from $98 a month.",
    "Made for one teacher, so it's quick to learn.",
    "Lesson notes, private notes and a material library.",
  ],
  faqs: [
    { q: "Is Opus1 good for a private teacher?", a: "It can work, but it's priced and built for schools, from $98 a month. A solo teacher usually needs much less." },
  ],
  sources: [
    { label: "Opus1 pricing", href: "https://opus1.io/pricing/" },
  ],
};

export const myMusicStaffAlternatives: Roundup = {
  kind: "roundup",
  slug: "my-music-staff-alternatives",
  tool: "tutor",
  title: "My Music Staff Alternatives for Music Teachers",
  lastChecked: LAST_CHECKED,
  description:
    "My Music Staff alternatives for private music teachers, compared honestly. Trenodo Tutor, TutorBird and Opus1, with price and what each one is for.",
  intro:
    "My Music Staff is the best-known software for music teachers. But it's not the only way to run your teaching. Here are the alternatives, and what each one is actually good at. Full disclosure: the first one is ours.",
  entries: [
    { name: "Trenodo Tutor", price: "Free right now", bestFor: "The teaching itself", body: "Lesson notes with a private part, a tagged material library, and a student portal with phone and PIN. No scheduling or billing.", isTrenodo: true },
    { name: "My Music Staff", price: "$16.95 a month", bestFor: "Running a music studio", body: "Calendar, invoices, online payments, reminders and a website. The full business package for music teachers.", compareSlug: "my-music-staff" },
    { name: "TutorBird", price: "$16.95 a month", bestFor: "Tutors of any subject", body: "The same kind of package as My Music Staff, from the same company, for all tutors.", compareSlug: "tutorbird" },
    { name: "Opus1", price: "From $98 a month", bestFor: "Music schools", body: "Scheduling, billing, payroll and recitals for schools with many teachers.", compareSlug: "opus1" },
  ],
  faqs: [
    { q: "Is there a free alternative to My Music Staff?", a: "For the teaching side, yes: Trenodo Tutor is free right now. For scheduling and billing, the paid tools are still the way to go." },
    { q: "Do I need studio software at all?", a: "Not always. Many private teachers manage the calendar with a normal calendar app, and only need a good place for notes and material." },
  ],
  sources: [
    { label: "My Music Staff pricing", href: "https://www.mymusicstaff.com/pricing/" },
    { label: "TutorBird pricing", href: "https://www.tutorbird.com/pricing/" },
    { label: "Opus1 pricing", href: "https://opus1.io/pricing/" },
  ],
};
