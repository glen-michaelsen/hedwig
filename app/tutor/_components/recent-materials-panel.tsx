"use client";

import Link from "next/link";
import { useState } from "react";
import type { CreatedMaterial } from "../actions";
import { CreateMaterialModal } from "./create-material-modal";
import {
  Empty,
  KindBadge,
  Panel,
  PanelList,
  SectionTitle,
  focusable,
  panelRow,
} from "@/app/_components/ui";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * The dashboard's own material widget — five most recent, with the same
 * create flow as the lesson note's inline modal. New materials are
 * prepended locally rather than waiting on a round trip, same pattern as
 * MaterialAttachField.
 *
 * Header actions are icon-only circles (same shape as the calendar's
 * prev/next in LessonNotes) rather than labelled pills — this row sits
 * beside "Students" and "Recent lessons", whose headers carry no action at
 * all, so a couple of small circles keep all three titles the same height
 * instead of the widest one pushing its own table down.
 */
export function RecentMaterialsPanel({
  materials,
  allTags,
}: {
  materials: CreatedMaterial[];
  allTags: string[];
}) {
  const [items, setItems] = useState(materials);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <section>
      <SectionTitle
        action={
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/tutor/library"
              aria-label="See all material"
              title="See all material"
              className={`grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-foreground ${focusable}`}
            >
              <ArrowIcon />
            </Link>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              aria-label="Add material"
              title="Add material"
              className={`grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-500 ${focusable}`}
            >
              <PlusIcon />
            </button>
          </div>
        }
      >
        Material
      </SectionTitle>

      {items.length === 0 ? (
        <Empty>Nothing in your library yet.</Empty>
      ) : (
        <Panel>
          <PanelList>
            {items.slice(0, 5).map((m) => (
              <li key={m.id}>
                <Link href={`/tutor/library/${m.id}`} className={panelRow}>
                  <KindBadge kind={m.kind} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {m.title}
                  </span>
                </Link>
              </li>
            ))}
          </PanelList>
        </Panel>
      )}

      <CreateMaterialModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        allTags={allTags}
        submitLabel="Create material"
        onCreated={(material) =>
          setItems((current) => [material, ...current])
        }
      />
    </section>
  );
}
