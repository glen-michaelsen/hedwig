/**
 * Geist for the badges, fetched from Google Fonts as a subset of exactly
 * the characters a badge draws. next/og only bundles Geist Regular, and the
 * badges need the semibold weight too. A subset is a few KB, and because it
 * is built from the real text, a title with æ, ø or å still renders.
 *
 * Google serves TrueType (which Satori needs) to a client without a browser
 * user agent, and a Worker's fetch is one. If the fetch fails, the badge
 * still renders in next/og's default font, only without the semibold.
 */

type BadgeFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal";
};

async function loadWeight(
  weight: 400 | 600,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((response) => (response.ok ? response.text() : ""));

    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;

    const font = await fetch(match[1]);
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function loadBadgeFonts(text: string): Promise<BadgeFont[]> {
  const [regular, semibold] = await Promise.all([
    loadWeight(400, text),
    loadWeight(600, text),
  ]);

  const fonts: BadgeFont[] = [];
  if (regular) fonts.push({ name: "Geist", data: regular, weight: 400, style: "normal" });
  if (semibold) fonts.push({ name: "Geist", data: semibold, weight: 600, style: "normal" });
  return fonts;
}
