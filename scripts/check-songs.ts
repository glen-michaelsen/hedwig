/**
 * Every chord in every song chart must be one the chord pages can draw,
 * in the song's own key and in its capo version.
 *
 * Usage: npx tsx scripts/check-songs.ts
 */
import { bestCapo, chordsIn, diagramFor, shiftChord } from "../lib/songs/chords";
import { SONGS } from "../lib/songs/songs";

const problems: string[] = [];
const slugs = new Set<string>();

for (const song of SONGS) {
  if (slugs.has(song.slug)) problems.push(`${song.slug}: slug used twice`);
  slugs.add(song.slug);

  const capo = bestCapo(song);
  for (const chord of chordsIn(song)) {
    if (!diagramFor(chord)) problems.push(`${song.slug}: no diagram for "${chord}"`);
    if (capo && !diagramFor(shiftChord(chord, capo.fret))) {
      problems.push(`${song.slug}: no diagram for "${shiftChord(chord, capo.fret)}" (capo ${capo.fret})`);
    }
  }
  if (!diagramFor(song.key)) problems.push(`${song.slug}: key "${song.key}" isn't a chord we know`);
  if (song.meter && song.meter !== "4/4" && song.strumming.pattern) {
    problems.push(`${song.slug}: a 4/4 strum grid on a ${song.meter} song`);
  }
  if (song.bpm < 40 || song.bpm > 220) problems.push(`${song.slug}: bpm ${song.bpm} looks wrong`);
  if (song.strumming.pattern && song.strumming.pattern.length !== 8) problems.push(`${song.slug}: strumming needs 8 eighth notes`);

  console.log(
    `${song.title}: ${chordsIn(song).join(" ")}` +
      (capo ? ` | capo ${capo.fret}: ${chordsIn(song).map((c) => shiftChord(c, capo.fret)).join(" ")} (${capo.open} open)` : ""),
  );
}

if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log(`${SONGS.length} songs, all chords drawable.`);
