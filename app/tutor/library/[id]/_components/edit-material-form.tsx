"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateMaterialAction, type EditMaterialState } from "../../../actions";
import { TagPicker } from "@/app/_components/tag-picker";
import {
  Card,
  ErrorText,
  KindBadge,
  button,
  buttonQuiet,
  input,
  label,
} from "@/app/_components/ui";

export function EditMaterialForm({
  material,
  allTags,
  selectedTags,
}: {
  material: {
    id: string;
    kind: "pdf" | "link" | "video";
    title: string;
    description: string | null;
    url: string | null;
    sizeBytes: number | null;
  };
  allTags: string[];
  selectedTags: string[];
}) {
  const [state, action, pending] = useActionState<EditMaterialState, FormData>(
    updateMaterialAction,
    {},
  );

  return (
    <Card>
      <form action={action} className="space-y-6">
        <input type="hidden" name="materialId" value={material.id} />

        <div className="flex items-center gap-3">
          <KindBadge kind={material.kind} />
          <span className="text-xs text-faint">
            The type can&rsquo;t be changed — delete and re-add to switch it.
          </span>
        </div>

        <div>
          <label className={label} htmlFor="title">
            Title
          </label>
          <input
            className={input}
            id="title"
            name="title"
            defaultValue={material.title}
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="description">
            Description
          </label>
          <input
            className={input}
            id="description"
            name="description"
            defaultValue={material.description ?? ""}
          />
        </div>

        {material.kind === "pdf" ? (
          <div>
            <label className={label} htmlFor="file">
              Replace the PDF{" "}
              <span className="font-normal normal-case tracking-normal text-faint">
                (optional)
              </span>
            </label>
            <input
              className={`${input} file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/12 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-brand-700 dark:file:text-brand-300`}
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
            />
            <p className="mt-2 text-xs text-faint">
              Leave empty to keep the current file
              {material.sizeBytes
                ? ` (${Math.round(material.sizeBytes / 1024)} KB)`
                : ""}
              . Anything already shared keeps working — the link stays the same.
            </p>
          </div>
        ) : (
          <div>
            <label className={label} htmlFor="url">
              URL
            </label>
            <input
              className={input}
              id="url"
              name="url"
              type="url"
              defaultValue={material.url ?? ""}
              required
            />
          </div>
        )}

        <TagPicker
          options={allTags.map((t) => ({ value: t, label: t }))}
          defaultSelected={selectedTags}
        />

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <div className="flex flex-wrap items-center gap-3">
          <button className={button} disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </button>
          <Link href="/tutor/library" className={buttonQuiet}>
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
