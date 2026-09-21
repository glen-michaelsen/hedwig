import type { ChordShape } from "./types";

/**
 * The shape a capo lets you reuse: same relative finger positions, just
 * measured from the capo instead of the nut. A string open in the
 * original shape needs no marker here — it just rings via the capo — and
 * a muted string stays muted regardless of where the capo sits.
 */
export function applyCapo(
  shape: ChordShape,
  capoFret: number,
  result: { name: string; shortName: string; slug: string },
): ChordShape {
  return {
    name: result.name,
    shortName: result.shortName,
    slug: result.slug,
    frets: shape.frets.map((fret) => (fret ? fret + capoFret : fret)),
    fingers: shape.fingers,
    baseFret: capoFret,
    barre: { fret: capoFret, fromString: 0, toString: 5, label: "CAPO" },
  };
}
