"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  ASSET_RULES,
  formatBytes,
  isAllowedFile,
  type AssetKind,
} from "@/lib/press/assets";
import { buttonGhost, focusable, Pill } from "@/app/_components/ui";

type Progress = {
  name: string;
  sent: number;
  total: number;
  fileIndex: number;
  fileCount: number;
};

/**
 * Uploads in chunks straight to the release's upload route, which streams
 * each part into R2. Nothing here holds a whole file: the browser slices it
 * and only one slice is in flight at a time, so a 60 MB master behaves the
 * same as a 2 MB photo, just for longer.
 */
export function Uploader({
  releaseId,
  kind,
}: {
  releaseId: string;
  kind: AssetKind;
}) {
  const rule = ASSET_RULES[kind];
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadOne(file: File, fileIndex: number, fileCount: number) {
    if (file.size > rule.maxBytes) {
      throw new Error(
        `${file.name} is ${formatBytes(file.size)} — the limit is ${formatBytes(rule.maxBytes)}.`,
      );
    }
    if (!isAllowedFile(kind, file.type, file.name)) {
      throw new Error(`${file.name} isn't a file type this section takes.`);
    }

    const started = await fetch(`/press/${releaseId}/upload?phase=start`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      }),
    });

    const startBody = (await started.json()) as {
      key?: string;
      uploadId?: string;
      partSize?: number;
      error?: string;
    };
    if (!started.ok || !startBody.key || !startBody.uploadId) {
      throw new Error(startBody.error ?? "Couldn't start the upload.");
    }

    const { key, uploadId } = startBody;
    const partSize = startBody.partSize ?? 8 * 1024 * 1024;
    const parts: { partNumber: number; etag: string }[] = [];

    try {
      let partNumber = 1;
      for (let offset = 0; offset < file.size; offset += partSize) {
        const chunk = file.slice(offset, offset + partSize);

        const response = await fetch(
          `/press/${releaseId}/upload?phase=part&key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`,
          { method: "POST", body: chunk },
        );

        const body = (await response.json()) as {
          partNumber?: number;
          etag?: string;
          error?: string;
        };
        if (!response.ok || !body.etag) {
          throw new Error(body.error ?? "A chunk failed to upload.");
        }

        parts.push({ partNumber, etag: body.etag });
        setProgress({
          name: file.name,
          sent: Math.min(offset + partSize, file.size),
          total: file.size,
          fileIndex,
          fileCount,
        });
        partNumber += 1;
      }

      const finished = await fetch(
        `/press/${releaseId}/upload?phase=complete`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            key,
            uploadId,
            parts,
            kind,
            filename: file.name,
            contentType: file.type || "application/octet-stream",
          }),
        },
      );

      if (!finished.ok) {
        const body = (await finished.json()) as { error?: string };
        throw new Error(body.error ?? "The upload didn't finish.");
      }
    } catch (cause) {
      // Leave no half-finished upload behind to be billed for.
      await fetch(`/press/${releaseId}/upload?phase=abort`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, uploadId }),
      }).catch(() => {});
      throw cause;
    }
  }

  async function onPick(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    try {
      const list = Array.from(files);
      for (const [index, file] of list.entries()) {
        setProgress({
          name: file.name,
          sent: 0,
          total: file.size,
          fileIndex: index + 1,
          fileCount: list.length,
        });
        await uploadOne(file, index + 1, list.length);
      }
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const percent = progress
    ? Math.round((progress.sent / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={rule.accept}
        multiple={!rule.single}
        disabled={progress !== null}
        onChange={(event) => onPick(event.target.files)}
        className="hidden"
        id={`upload-${kind}`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={`upload-${kind}`}
          className={`${buttonGhost} cursor-pointer ${
            progress ? "pointer-events-none opacity-50" : ""
          } ${focusable}`}
        >
          {rule.single ? `Upload ${rule.label.toLowerCase()}` : `Add ${rule.plural.toLowerCase()}`}
        </label>
        <p className="text-xs text-faint">{rule.hint}</p>
      </div>

      {progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex min-w-0 items-center gap-2">
              {progress.fileCount > 1 && (
                <Pill active>
                  {progress.fileIndex} of {progress.fileCount}
                </Pill>
              )}
              <span className="truncate">{progress.name}</span>
            </span>
            <span className="shrink-0 pl-4 tabular-nums">{percent}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
