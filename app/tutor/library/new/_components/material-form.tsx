"use client";

import { useActionState, useState } from "react";
import {
  createMaterialAction,
  lookupLinkTitleAction,
  type NewMaterialState,
} from "../../../actions";
import { TagPicker } from "@/app/_components/tag-picker";
import {
  Card,
  ErrorText,
  button,
  input,
  label,
} from "@/app/_components/ui";

type Kind = "pdf" | "link" | "video";

const kinds: { value: Kind; title: string; hint: string }[] = [
  { value: "pdf", title: "PDF", hint: "Sheet music, worksheets" },
  { value: "link", title: "Link", hint: "Chords, theory, articles" },
  { value: "video", title: "Video", hint: "YouTube or Vimeo" },
];

export function MaterialForm({ allTags }: { allTags: string[] }) {
  const [kind, setKind] = useState<Kind>("pdf");
  const [title, setTitle] = useState("");
  const [looking, setLooking] = useState(false);
  const [state, action, pending] = useActionState<NewMaterialState, FormData>(
    createMaterialAction,
    {},
  );

  /**
   * Fill the title from the page as soon as a URL is entered — but only
   * when the field is empty, so it never overwrites something typed by
   * hand. Checked again when the answer arrives, since a title can be
   * typed while the lookup is in flight.
   */
  async function fillTitleFrom(url: string) {
    if (!url.trim() || title.trim()) return;

    setLooking(true);
    try {
      const found = await lookupLinkTitleAction(url);
      setTitle((current) => (current.trim() ? current : (found ?? "")));
    } catch {
      // A title is a convenience — the server tries again on save.
    } finally {
      setLooking(false);
    }
  }

  return (
    <Card>
      <form action={action} className="space-y-6">
        <input type="hidden" name="kind" value={kind} />

        <div className="grid gap-3 sm:grid-cols-3">
          {kinds.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setKind(option.value)}
              className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                kind === option.value
                  ? "border-brand-500 bg-brand-500/8 shadow-soft"
                  : "border-line bg-surface hover:border-line-strong hover:-translate-y-px"
              }`}
            >
              <span className="block text-sm font-medium">{option.title}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {option.hint}
              </span>
            </button>
          ))}
        </div>

        {kind === "pdf" ? (
          <div>
            <label className={label} htmlFor="file">
              PDF file
            </label>
            <input
              className={`${input} file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/12 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-brand-700 dark:file:text-brand-300`}
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              required
            />
            <p className="mt-2 text-xs text-faint">Up to 20 MB.</p>
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
              placeholder="https://…"
              required
              // Covers pasting with the mouse as well as typing and tabbing.
              onBlur={(event) => fillTitleFrom(event.target.value)}
              onPaste={(event) => {
                const pasted = event.clipboardData.getData("text");
                if (pasted) setTimeout(() => fillTitleFrom(pasted), 0);
              }}
            />
            <p className="mt-2 text-xs text-faint">
              We&rsquo;ll read the title from the page and fill it in below.
            </p>
          </div>
        )}

        <div>
          <label className={label} htmlFor="title">
            Title{" "}
            {looking && (
              <span className="font-normal normal-case tracking-normal text-faint">
                — reading the page…
              </span>
            )}
          </label>
          <input
            className={input}
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={kind === "pdf" ? "" : "Filled from the link"}
          />
        </div>

        <div>
          <label className={label} htmlFor="description">
            Description
          </label>
          <input className={input} id="description" name="description" />
        </div>

        <TagPicker options={allTags.map((t) => ({ value: t, label: t }))} />

        {state.error && <ErrorText>{state.error}</ErrorText>}

        <button className={button} disabled={pending}>
          {pending ? "Saving…" : "Add to library"}
        </button>
      </form>
    </Card>
  );
}
