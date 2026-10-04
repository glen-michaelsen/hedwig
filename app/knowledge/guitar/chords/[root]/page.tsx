import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChordFigure } from "../../../_components/chord-figure";
import { GuideFaq, GuideLayout } from "../../../_components/guide-layout";
import { focusable } from "@/app/_components/ui";
import {
  CHORD_QUALITIES,
  CHORD_ROOTS,
  chordNotes,
  getChordRoot,
  voicingsFor,
  type ChordRoot,
} from "@/lib/chord-diagrams/chord-variants";

// OpenNext on Workers has no cache for prerendered param pages, so these
// render per request. The data is static, so that's cheap.
export const dynamic = "force-dynamic";

/** "C# / Db" for a key with two names, else just "C". */
function keyName(root: ChordRoot) {
  return root.alias ? `${root.label} / ${root.alias}` : root.label;
}

function symbols(root: ChordRoot) {
  return CHORD_QUALITIES.map((quality) => `${root.label}${quality.suffix}`);
}

/** The open chord a capo turns into this key's major chord, at the lowest fret. */
function capoTip(root: ChordRoot) {
  const options = ["a", "c", "d", "e", "g"]
    .map((slug) => getChordRoot(slug)!)
    .map((open) => ({ open, fret: (root.pc - open.pc + 12) % 12 }))
    .filter((option) => option.fret > 0)
    .sort((a, b) => a.fret - b.fret);
  return options[0];
}

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

function faqsFor(root: ChordRoot) {
  const major = CHORD_QUALITIES.find((quality) => quality.key === "major")!;
  const minor = CHORD_QUALITIES.find((quality) => quality.key === "minor")!;
  const hasOpenMajor = voicingsFor(root, major)[0]?.slug.endsWith("-open");
  const tip = capoTip(root);

  return [
    {
      q: `What notes are in the ${root.label} chord?`,
      a: `${root.label} major is ${chordNotes(root, major).join(", ")}. ${root.label} minor is ${chordNotes(root, minor).join(", ")}: the same chord with the middle note one fret lower.`,
    },
    {
      q: `What is the easiest way to play ${root.label} on guitar?`,
      a: hasOpenMajor
        ? `The open ${root.label} chord at the top of this page. It uses open strings, so it needs the least strength in your fretting hand.`
        : `There's no open ${root.label} chord, so it's a barre chord or a capo. The easy way: put a capo on the ${ORDINAL[tip.fret]} fret and play an open ${tip.open.label} shape. It sounds as ${root.label}.`,
    },
  ];
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/guitar/chords/[root]">): Promise<Metadata> {
  const root = getChordRoot((await params).root);
  if (!root) return {};
  const title = `${keyName(root)} Chords on Guitar: Major, Minor, 7th and More`;
  const description = `Every ${root.label} guitar chord with a diagram: ${symbols(root).join(", ")}. Open shapes and barre shapes up the neck.`;
  const url = `/knowledge/guitar/chords/${root.slug}`;
  return {
    title: `${title} | Trenodo`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Trenodo", type: "article" },
  };
}

export default async function ChordRootPage({
  params,
}: PageProps<"/knowledge/guitar/chords/[root]">) {
  const root = getChordRoot((await params).root);
  if (!root) notFound();

  const sections = CHORD_QUALITIES.map((quality) => ({
    quality,
    symbol: `${root.label}${quality.suffix}`,
    notes: chordNotes(root, quality),
    voicings: voicingsFor(root, quality),
  }));
  const diagramCount = sections.reduce((sum, section) => sum + section.voicings.length, 0);
  const hasOpen = sections.some((section) => section.voicings.some((v) => v.slug.endsWith("-open")));
  const faqs = faqsFor(root);
  const title = `${keyName(root)} Chords on Guitar`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description: `Every ${root.label} guitar chord with a diagram.`,
        author: { "@type": "Organization", name: "Trenodo" },
        image: sections.flatMap((section) =>
          section.voicings.map((v) => `https://trenodo.com/images/knowledge/guitar/chords/${v.slug}.svg`),
        ),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  const chip = `inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium transition-colors hover:border-line-strong hover:text-brand-700 ${focusable}`;

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the chord data in code, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GuideLayout
        category="Guitar Chords"
        categoryHref="/knowledge/guitar/chords"
        title={title}
        intro={`Every common ${root.label} chord: major, minor, sevenths, sus chords and diminished. ${
          hasOpen ? "Open shapes first, then the barre shapes up the neck." : "All barre shapes, so warm up that index finger."
        } ${diagramCount} diagrams. 🎸`}
      >
        <nav aria-label="Chord types">
          <ul className="flex flex-wrap gap-2">
            {sections.map(({ quality, symbol }) => (
              <li key={quality.key}>
                <a href={`#${quality.key}`} className={chip}>
                  {symbol}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {sections.map(({ quality, symbol, notes, voicings }) => (
          <section key={quality.key} id={quality.key} className="scroll-mt-24">
            <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-semibold tracking-tight">
              {root.label} {quality.name}
              <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-sm font-semibold text-brand-700">
                {symbol}
              </span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted text-pretty">{quality.feel}</p>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex gap-1.5">
                <dt className="text-faint">Notes</dt>
                <dd className="font-semibold text-foreground">{notes.join(" ")}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-faint">Formula</dt>
                <dd className="font-semibold text-foreground">{quality.formula}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {voicings.map((voicing) => (
                <ChordFigure
                  key={voicing.slug}
                  slug={voicing.slug}
                  name={voicing.name}
                  shortName={voicing.shortName}
                  detail={voicing.position}
                />
              ))}
            </div>
          </section>
        ))}

        <nav aria-label="Chords in other keys">
          <h2 className="text-2xl font-semibold tracking-tight">Chords in other keys</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CHORD_ROOTS.filter((other) => other.slug !== root.slug).map((other) => (
              <li key={other.slug}>
                <Link href={`/knowledge/guitar/chords/${other.slug}`} className={chip}>
                  {keyName(other)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <GuideFaq items={faqs} />
      </GuideLayout>
    </>
  );
}
