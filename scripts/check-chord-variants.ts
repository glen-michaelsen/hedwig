/**
 * Checks every shape in lib/chord-diagrams/chord-variants.ts against music,
 * not against eyeballs: the strings it sounds must be exactly the chord's
 * notes (a four-note chord may drop its 5th), the lowest note must be the root, and the fingering must be
 * playable (one fret per finger, fits the four-fret diagram).
 *
 * Usage: npx tsx scripts/check-chord-variants.ts
 */
import {
  CHORD_QUALITIES,
  CHORD_ROOTS,
  STANDARD_TUNING,
  chordNotes,
  voicingsFor,
} from "../lib/chord-diagrams/chord-variants";

const problems: string[] = [];
let count = 0;

for (const root of CHORD_ROOTS) {
  for (const quality of CHORD_QUALITIES) {
    const voicings = voicingsFor(root, quality);
    if (voicings.length === 0) problems.push(`${root.symbol}${quality.suffix}: no shapes at all`);

    const expected = new Set(quality.intervals.map(({ semitones }) => (root.pc + semitones) % 12));

    for (const v of voicings) {
      count++;
      const label = `${v.slug} [${v.frets.map((f) => (f === null ? "x" : f)).join("")}]`;
      const sounding = v.frets.flatMap((fret, s) => (fret === null ? [] : [(STANDARD_TUNING[s] + fret) % 12]));
      const got = new Set(sounding);

      // A four-note chord may leave out its perfect 5th (the open C7 does):
      // it adds the least colour, and every chord book drops it.
      const fifth = (root.pc + 7) % 12;
      const mayDropFifth = quality.intervals.length === 4;
      const missing = [...expected].filter((pc) => !got.has(pc) && !(mayDropFifth && pc === fifth));
      const extra = [...got].filter((pc) => !expected.has(pc));
      if (missing.length || extra.length) {
        problems.push(`${label}: notes wrong (missing ${missing.join(",") || "none"}, extra ${extra.join(",") || "none"})`);
      }
      if (sounding[0] !== root.pc) problems.push(`${label}: lowest note isn't the root`);

      const fretted = v.frets.filter((fret): fret is number => fret !== null && fret > 0);
      const base = v.baseFret ?? 1;
      if (fretted.some((fret) => fret < base || fret > base + 3)) {
        problems.push(`${label}: doesn't fit the four-fret diagram from fret ${base}`);
      }

      const fingerFret = new Map<number, number>();
      v.frets.forEach((fret, s) => {
        const finger = v.fingers?.[s] ?? null;
        if (fret !== null && fret > 0 && !finger) problems.push(`${label}: string ${s + 1} fretted with no finger`);
        if ((fret === null || fret === 0) && finger) problems.push(`${label}: string ${s + 1} has a finger but isn't fretted`);
        if (fret && finger) {
          const seen = fingerFret.get(finger);
          if (seen !== undefined && seen !== fret) problems.push(`${label}: finger ${finger} on two frets`);
          fingerFret.set(finger, fret);
        }
      });
    }
  }
}

console.log(`${count} shapes checked across ${CHORD_ROOTS.length} keys.`);
if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log("All correct.");
console.log("Sample spellings:", ["c", "c-sharp", "e-flat", "a-flat", "f-sharp"]
  .map((slug) => {
    const root = CHORD_ROOTS.find((r) => r.slug === slug)!;
    return CHORD_QUALITIES.map((q) => `${root.symbol}${q.suffix}=${chordNotes(root, q).join(" ")}`).join("  ");
  })
  .join("\n"));
