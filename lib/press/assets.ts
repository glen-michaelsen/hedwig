/**
 * What each kind of press-kit file is allowed to be.
 *
 * Shared by the browser (to filter the file picker and reject early) and by
 * the upload route (which can't trust any of that). No "server-only" here
 * for exactly that reason — but nothing in this file is a secret.
 */

export type AssetKind = "cover" | "photo" | "track" | "document";

export type AssetRule = {
  label: string;
  /** Plural, for headings and empty states. */
  plural: string;
  /** Only one allowed — a new upload replaces the old one. */
  single?: boolean;
  mimeTypes: string[];
  /** For the file picker, which matches on extension more reliably. */
  accept: string;
  maxBytes: number;
  hint: string;
};

const MB = 1024 * 1024;

export const ASSET_RULES: Record<AssetKind, AssetRule> = {
  cover: {
    label: "Album cover",
    plural: "Album cover",
    single: true,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    accept: ".jpg,.jpeg,.png,.webp",
    maxBytes: 25 * MB,
    hint: "JPG, PNG or WebP · 3000×3000 recommended · max 25 MB",
  },
  photo: {
    label: "Press photo",
    plural: "Press photos",
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    accept: ".jpg,.jpeg,.png,.webp",
    maxBytes: 25 * MB,
    hint: "JPG, PNG or WebP · full resolution · max 25 MB",
  },
  track: {
    label: "Track",
    plural: "Tracks",
    mimeTypes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/wave",
      "audio/vnd.wave",
      "audio/flac",
      "audio/x-flac",
    ],
    accept: ".mp3,.wav,.flac",
    maxBytes: 300 * MB,
    hint: "MP3, WAV or FLAC · max 300 MB",
  },
  document: {
    label: "Document",
    plural: "Documents",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf",
      "text/plain",
      "text/markdown",
    ],
    accept: ".pdf,.doc,.docx,.rtf,.txt,.md",
    maxBytes: 50 * MB,
    hint: "PDF, DOC, DOCX, RTF or TXT · max 50 MB",
  },
};

export const ASSET_KINDS = Object.keys(ASSET_RULES) as AssetKind[];

export function isAssetKind(value: string): value is AssetKind {
  return value in ASSET_RULES;
}

/**
 * Browsers disagree about audio MIME types — Safari calls a .wav
 * "audio/wave", Windows sometimes sends nothing at all — so the extension
 * is the fallback rather than an outright rejection.
 */
export function isAllowedFile(
  kind: AssetKind,
  contentType: string,
  filename: string,
): boolean {
  const rule = ASSET_RULES[kind];
  if (rule.mimeTypes.includes(contentType.toLowerCase())) return true;

  const extension = filename.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  return extension ? rule.accept.split(",").includes(extension) : false;
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) {
    const value = bytes / MB;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
