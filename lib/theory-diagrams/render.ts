import type { CircleOfFifthsSegment } from "./types";

/**
 * Renders the circle of fifths to a standalone SVG string — same reasoning
 * as every other diagram in Knowledge: a real file with a real URL for
 * Google Images, hand-matched hex colors since a standalone SVG has no
 * access to the app's CSS variables, and the brand-purple palette so this
 * reads as the same visual family as the chord and scale diagrams.
 *
 * Twelve positions, spaced 30° apart starting at C (12 o'clock) and
 * moving clockwise. Labels stay upright regardless of angle — centering
 * them on their point with dominant-baseline handles every side of the
 * circle without needing per-angle vertical offsets.
 */
const COLOR = {
  background: "#ffffff",
  ring: "#825abe",
  tick: "#825abe",
  major: "#3d372c",
  minor: "#6b6153",
};

const WIDTH = 380;
const HEIGHT = 400;
const CENTER_X = 190;
const CENTER_Y = 178;
const RADIUS = 128;
const TICK_HALF_LENGTH = 15;
const MAJOR_OFFSET = 36;
const MINOR_OFFSET = 32;
const MAJOR_FONT_SIZE = 16;
const MINOR_FONT_SIZE = 14;
const STACK_GAP = 16;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pointAt(radius: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: round(CENTER_X + radius * Math.cos(angleRad)),
    y: round(CENTER_Y + radius * Math.sin(angleRad)),
  };
}

function renderLabelGroup(
  lines: string[],
  center: { x: number; y: number },
  fontSize: number,
  weight: string,
  color: string,
): string {
  const startY =
    lines.length === 1 ? center.y : center.y - (STACK_GAP * (lines.length - 1)) / 2;

  return lines
    .map((line, i) => {
      const y = round(startY + i * STACK_GAP);
      return `<text x="${center.x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n  ");
}

export function renderCircleOfFifthsSvg(segments: CircleOfFifthsSegment[]): string {
  const parts: string[] = [];

  parts.push(
    `<rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="16" fill="${COLOR.background}" />`,
    `<circle cx="${CENTER_X}" cy="${CENTER_Y}" r="${RADIUS}" fill="none" stroke="${COLOR.ring}" stroke-width="2.5" />`,
  );

  segments.forEach((segment, i) => {
    const angleDeg = -90 + i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const dirX = Math.cos(angleRad);
    const dirY = Math.sin(angleRad);

    // Tick mark straddling the ring, radial (pointing straight out from
    // center, like a clock face's hour marks) rather than tangential.
    const onRing = pointAt(RADIUS, angleDeg);
    const tickX1 = round(onRing.x - dirX * TICK_HALF_LENGTH);
    const tickY1 = round(onRing.y - dirY * TICK_HALF_LENGTH);
    const tickX2 = round(onRing.x + dirX * TICK_HALF_LENGTH);
    const tickY2 = round(onRing.y + dirY * TICK_HALF_LENGTH);
    parts.push(
      `<line x1="${tickX1}" y1="${tickY1}" x2="${tickX2}" y2="${tickY2}" stroke="${COLOR.tick}" stroke-width="3" stroke-linecap="round" />`,
    );

    const majorCenter = pointAt(RADIUS + MAJOR_OFFSET, angleDeg);
    const minorCenter = pointAt(RADIUS - MINOR_OFFSET, angleDeg);

    parts.push(
      renderLabelGroup(segment.major, majorCenter, MAJOR_FONT_SIZE, "700", COLOR.major),
    );
    parts.push(
      renderLabelGroup(segment.minor, minorCenter, MINOR_FONT_SIZE, "500", COLOR.minor),
    );
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="The circle of fifths">
  <title>The circle of fifths</title>
  ${parts.join("\n  ")}
</svg>
`;
}
