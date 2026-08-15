/**
 * The public page carries its own theme, independent of Trenodo's admin UI
 * (which is pinned light). Everything here is pure so the editor can preview
 * and warn with the same maths the page renders with.
 */

export type ThemePreset = {
  id: string;
  label: string;
  bg: string;
  card: string;
  fg: string;
  muted: string;
  accent: string;
  font: "sans" | "serif";
  /** Card and button corner radius, in px. */
  radius: number;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "midnight",
    label: "Midnight",
    bg: "#12101a",
    card: "#1c1926",
    fg: "#f5f3f8",
    muted: "#a49fb2",
    accent: "#8b5cf6",
    font: "sans",
    radius: 18,
  },
  {
    id: "ivory",
    label: "Ivory",
    bg: "#fdfaf6",
    card: "#ffffff",
    fg: "#2d231b",
    muted: "#6b6158",
    accent: "#825abe",
    font: "sans",
    radius: 18,
  },
  {
    id: "sand",
    label: "Sand",
    bg: "#efe6d9",
    card: "#fbf6ef",
    fg: "#3a2f24",
    muted: "#6f6152",
    accent: "#b4633a",
    font: "serif",
    radius: 14,
  },
  {
    id: "forest",
    label: "Forest",
    bg: "#101e18",
    card: "#182b22",
    fg: "#eef5f0",
    muted: "#9db3a7",
    accent: "#4ba97b",
    font: "serif",
    radius: 14,
  },
  {
    id: "blush",
    label: "Blush",
    bg: "#fbf0f1",
    card: "#ffffff",
    fg: "#3a2429",
    muted: "#7c6167",
    accent: "#c4526e",
    font: "sans",
    radius: 24,
  },
  {
    id: "mono",
    label: "Mono",
    bg: "#0a0a0a",
    card: "#171717",
    fg: "#fafafa",
    muted: "#a1a1a1",
    accent: "#fafafa",
    font: "sans",
    radius: 6,
  },
];

export function getPreset(id: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}

/* ------------------------------ contrast ------------------------------ */

export function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Text colour for a given ground. The artist picks one colour; we pick the
 * one that has to work with it, rather than asking them to.
 */
export function readableOn(background: string): string {
  return contrastRatio("#ffffff", background) >= contrastRatio("#101010", background)
    ? "#ffffff"
    : "#101010";
}

/* ---------------------------- resolved theme --------------------------- */

export type BioTheme = {
  bg: string;
  card: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
  radius: number;
  fontFamily: string;
  backgroundImage: string | null;
  /** True when text sits over a photo and needs a scrim to stay legible. */
  needsScrim: boolean;
};

const FONT_STACKS = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
};

export function resolveTheme(page: {
  themePreset: string;
  accentColor: string | null;
  backgroundKind: "preset" | "solid" | "gradient" | "image";
  backgroundValue: string | null;
}): BioTheme {
  const preset = getPreset(page.themePreset);

  const accent =
    page.accentColor && parseHex(page.accentColor)
      ? page.accentColor
      : preset.accent;

  let bg = preset.bg;
  let fg = preset.fg;
  let muted = preset.muted;
  let backgroundImage: string | null = null;
  let needsScrim = false;

  if (page.backgroundKind === "solid" && page.backgroundValue) {
    if (parseHex(page.backgroundValue)) {
      bg = page.backgroundValue;
      // Derived, not asked for — a chosen background can't be allowed to
      // take the preset's text colour down with it.
      fg = readableOn(bg);
      muted = fg === "#ffffff" ? "rgba(255,255,255,0.66)" : "rgba(16,16,16,0.62)";
    }
  } else if (page.backgroundKind === "gradient" && page.backgroundValue) {
    if (parseHex(page.backgroundValue)) {
      bg = page.backgroundValue;
      fg = readableOn(bg);
      muted = fg === "#ffffff" ? "rgba(255,255,255,0.66)" : "rgba(16,16,16,0.62)";
    }
  } else if (page.backgroundKind === "image" && page.backgroundValue) {
    backgroundImage = page.backgroundValue;
    // You cannot know what a photo looks like, so text always gets a scrim
    // and always uses the light pair.
    needsScrim = true;
    fg = "#ffffff";
    muted = "rgba(255,255,255,0.72)";
  }

  return {
    bg,
    card: page.backgroundKind === "preset" ? preset.card : "rgba(127,127,127,0.14)",
    fg,
    muted,
    accent,
    accentFg: readableOn(accent),
    radius: preset.radius,
    fontFamily: FONT_STACKS[preset.font],
    backgroundImage,
    needsScrim,
  };
}

/** CSS custom properties for the page wrapper. */
export function themeVars(theme: BioTheme): Record<string, string> {
  return {
    "--bio-bg": theme.bg,
    "--bio-card": theme.card,
    "--bio-fg": theme.fg,
    "--bio-muted": theme.muted,
    "--bio-accent": theme.accent,
    "--bio-accent-fg": theme.accentFg,
    "--bio-radius": `${theme.radius}px`,
    "--bio-font": theme.fontFamily,
  };
}
