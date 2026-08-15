"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useTransition } from "react";
import {
  deleteBlockAction,
  reorderBlocksAction,
  saveBlockAction,
  toggleBlockAction,
} from "../actions";
import { BLOCK_KINDS, BLOCK_LABELS, type ParsedBlock } from "@/lib/bio/blocks";
import type { BlockKind } from "@/lib/bio/blocks";
import { Modal } from "@/app/_components/modal";
import {
  Empty,
  ErrorText,
  actionPill,
  actionPillBrand,
  button,
  buttonGhost,
  buttonQuiet,
  focusable,
  input,
  label,
} from "@/app/_components/ui";
import { useAction } from "./use-action";

type Editing = { mode: "add" } | { mode: "edit"; block: ParsedBlock };

function summarise(block: ParsedBlock): string {
  if (block.kind === "link") return block.config.label;
  if (block.kind === "text") {
    if (block.config.variant === "divider") return "Divider";
    return block.config.value?.slice(0, 60) ?? "Empty";
  }
  return block.config.url;
}

export function BlockEditor({
  blocks,
  clicks,
}: {
  blocks: ParsedBlock[];
  clicks: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Editing | null>(null);
  const [, startTransition] = useTransition();

  /**
   * After a drag we show the new order immediately and save in the
   * background. `key` is the order the server last gave us — when that
   * changes (the save landed, or a block was added or removed) the local
   * override is stale by definition and the server wins again.
   */
  const serverOrder = blocks.map((b) => b.id).join(",");
  const [override, setOverride] = useState<{
    key: string;
    ids: string[];
  } | null>(null);

  const ordered =
    override && override.key === serverOrder
      ? override.ids
          .map((id) => blocks.find((b) => b.id === id))
          .filter((b) => b !== undefined)
      : blocks;

  const sensors = useSensors(
    // A few pixels of movement before a drag starts, so the buttons on each
    // row still take clicks normally.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = ordered.findIndex((b) => b.id === active.id);
    const to = ordered.findIndex((b) => b.id === over.id);
    if (from === -1 || to === -1) return;

    const ids = arrayMove(ordered, from, to).map((b) => b.id);
    setOverride({ key: serverOrder, ids });
    startTransition(() => reorderBlocksAction(ids));
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          Blocks
        </h2>
        <button className={buttonGhost} onClick={() => setEditing({ mode: "add" })}>
          Add block
        </button>
      </div>

      {ordered.length === 0 ? (
        <Empty>Nothing on your page yet. Add your first block.</Empty>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={ordered.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {ordered.map((block) => (
                  <SortableRow
                    key={block.id}
                    block={block}
                    clicks={clicks[block.id] ?? 0}
                    onEdit={() => setEditing({ mode: "edit", block })}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <p className="mt-3 text-xs text-faint">
            Drag a block by its handle to reorder. With a keyboard: tab to a
            handle, press space, move with the arrow keys, space again to drop.
          </p>
        </>
      )}

      {editing && (
        <BlockModal editing={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function SortableRow({
  block,
  clicks,
  onEdit,
}: {
  block: ParsedBlock;
  clicks: number;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-3xl border bg-surface px-4 py-4 sm:px-5 ${
        isDragging
          ? "relative z-10 border-brand-400 shadow-lift"
          : "border-line shadow-soft"
      } ${block.visible ? "" : "opacity-60"}`}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${summarise(block)}`}
        // touch-none stops the browser scrolling the page instead of
        // starting the drag on a phone.
        className={`grid h-9 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-faint transition-colors hover:bg-surface-muted hover:text-foreground active:cursor-grabbing ${focusable}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
          <circle cx="9" cy="6" r="1.4" />
          <circle cx="15" cy="6" r="1.4" />
          <circle cx="9" cy="12" r="1.4" />
          <circle cx="15" cy="12" r="1.4" />
          <circle cx="9" cy="18" r="1.4" />
          <circle cx="15" cy="18" r="1.4" />
        </svg>
      </button>

      <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
        {BLOCK_LABELS[block.kind].title}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {summarise(block)}
        </span>
        {clicks > 0 && (
          <span className="mt-0.5 block text-xs tabular-nums text-faint">
            {clicks} clicks
          </span>
        )}
      </span>

      <span className="flex shrink-0 items-center gap-2">
        <form action={toggleBlockAction}>
          <input type="hidden" name="blockId" value={block.id} />
          <input
            type="hidden"
            name="visible"
            value={block.visible ? "false" : "true"}
          />
          <button className={actionPill}>
            {block.visible ? "Hide" : "Show"}
          </button>
        </form>

        <button className={actionPillBrand} onClick={onEdit}>
          Edit
        </button>

        <form action={deleteBlockAction}>
          <input type="hidden" name="blockId" value={block.id} />
          <button
            className="px-1 text-xs text-faint transition-colors hover:text-rose-600"
            aria-label={`Delete ${summarise(block)}`}
          >
            ✕
          </button>
        </form>
      </span>
    </li>
  );
}

function BlockModal({
  editing,
  onClose,
}: {
  editing: Editing;
  onClose: () => void;
}) {
  const existing = editing.mode === "edit" ? editing.block : null;
  const [kind, setKind] = useState<BlockKind>(existing?.kind ?? "link");
  const { error, pending, onSubmit } = useAction(saveBlockAction, onClose);

  return (
    <Modal
      open
      onClose={onClose}
      title={existing ? "Edit block" : "Add a block"}
      description={
        existing ? undefined : "Pick what this one does, then fill it in."
      }
    >
      <form onSubmit={onSubmit} className="space-y-6 px-6 py-6 sm:px-7">
        {existing && <input type="hidden" name="blockId" value={existing.id} />}
        <input type="hidden" name="kind" value={kind} />

        {!existing && (
          <div className="grid gap-3 sm:grid-cols-2">
            {BLOCK_KINDS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                className={`rounded-3xl border px-5 py-4 text-left transition-all ${
                  kind === option
                    ? "border-brand-500 bg-brand-500/8"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <span className="block text-sm font-medium">
                  {BLOCK_LABELS[option].title}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {BLOCK_LABELS[option].hint}
                </span>
              </button>
            ))}
          </div>
        )}

        {kind === "link" && (
          <>
            <div>
              <label className={label} htmlFor="label">
                Button text
              </label>
              <input
                className={input}
                id="label"
                name="label"
                defaultValue={
                  existing?.kind === "link" ? existing.config.label : ""
                }
                placeholder="Book a lesson"
                required
              />
            </div>
            <div>
              <label className={label} htmlFor="url">
                Link
              </label>
              <input
                className={input}
                id="url"
                name="url"
                type="url"
                defaultValue={
                  existing?.kind === "link" ? existing.config.url : ""
                }
                placeholder="https://…"
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
                defaultValue={
                  existing?.kind === "link"
                    ? (existing.config.description ?? "")
                    : ""
                }
                placeholder="Optional line underneath"
              />
            </div>
          </>
        )}

        {kind === "text" && (
          <>
            <div>
              <label className={label} htmlFor="variant">
                Type
              </label>
              <select
                className={input}
                id="variant"
                name="variant"
                defaultValue={
                  existing?.kind === "text" ? existing.config.variant : "paragraph"
                }
              >
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="divider">Divider</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="value">
                Text
              </label>
              <textarea
                className={`${input} min-h-24 leading-relaxed`}
                id="value"
                name="value"
                defaultValue={
                  existing?.kind === "text" ? (existing.config.value ?? "") : ""
                }
                placeholder="Leave empty for a divider"
              />
            </div>
          </>
        )}

        {(kind === "player" || kind === "video") && (
          <div>
            <label className={label} htmlFor="url">
              {kind === "player" ? "Music link" : "Video link"}
            </label>
            <input
              className={input}
              id="url"
              name="url"
              type="url"
              defaultValue={
                existing?.kind === "player" || existing?.kind === "video"
                  ? existing.config.url
                  : ""
              }
              placeholder={
                kind === "player"
                  ? "https://open.spotify.com/track/…"
                  : "https://youtube.com/watch?v=…"
              }
              required
            />
            <p className="mt-2 text-xs text-faint">
              {kind === "player"
                ? "Spotify, Apple Music and SoundCloud play in place. Bandcamp shows as a link."
                : "YouTube and Vimeo play in place."}
            </p>
          </div>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <div className="flex flex-wrap items-center gap-3">
          <button className={button} disabled={pending}>
            {pending ? "Saving…" : existing ? "Save block" : "Add block"}
          </button>
          <button type="button" className={buttonQuiet} onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
