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
      className="h-3.5 w-3.5"
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
      className="h-3.5 w-3.5"
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
 * The header stays bare text, same as "Students" and "Recent lessons"
 * beside it — actions live in a footer bar under the table instead, so
 * this section's own list starts at the same line as its neighbours
 * rather than being pushed down by whatever the header happens to carry.
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

  const footer = (
    <>
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors hover:text-brand-600 dark:text-brand-300 ${focusable}`}
      >
        <PlusIcon />
        Add material
      </button>
      <Link
        href="/tutor/library"
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground ${focusable}`}
      >
        See all
        <ArrowIcon />
      </Link>
    </>
  );

  return (
    <section>
      <SectionTitle>Material</SectionTitle>

      {items.length === 0 ? (
        <>
          <Empty>Nothing in your library yet.</Empty>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface-muted px-6 py-3">
            {footer}
          </div>
        </>
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
          <div className="flex items-center justify-between border-t border-line bg-surface-muted px-6 py-3">
            {footer}
          </div>
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
